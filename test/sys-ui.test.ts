import  puppeteer = require("puppeteer");
import  moment = require("moment");

let page: any;
let page2;
let browser;
jest.setTimeout(150000);

async function click(page,selector: string, innerHTML?) {
  if (innerHTML) {
    await page.$$eval(selector, (elements, val) => {
      const element = elements.find((element) => {
        console.log(element.innerHTML);
        return element.innerHTML == val
      });
      if (element == null) {
        console.error("element for click not found! " + val);
        console.log(elements.map(el => el.innerHTML));
        throw "element for click not found! " + val;
      } else
        element.click();
    }, innerHTML);
  } else
    await page.$eval(selector, (el: any) => {
      console.log(el);
      el.click();
    });
}

async function setProperty(selector: string, propName: string, value: string) {
  let element = await page.$eval(selector, function (el, val) {
    el.value = val;
  }, value);
}

async function set(selector: string, value) {
  if (value === true || value === false)
    await page.$eval(selector, (el, val) => el.checked = val, value);
  else
    await page.$eval(selector, (el, val) => el.value = val, value);
}

async function getProp(selector: string, propName: string) {
  let element = await page.$(selector);
  let value = await element.getProperty(propName);
  return value.jsonValue();
}

async function waitForSelector(page,selector, innerHTML?) {
  let res;
  if (innerHTML) {
    do {
      res = await page.$$eval(selector, (elements, val) => {
        const element = elements.find((element) => element.innerHTML == val);
        return element;
      }, innerHTML);
    } while (!res)
  } else
    await page.waitFor(selector);
}

async function submitRecord(row, disabled, name, age, birthday, language, codes: string[]) {
  // add disable property
  await page.waitFor(`tbody>:nth-child(${row})>:nth-child(2)>div>label`);
  if (disabled)
    await click(page,`tbody>:nth-child(${row})>:nth-child(2)>div>label`);

  // add image property
  // var futureFileChooser = page.waitForFileChooser();
  // await click(page,`tbody>:nth-child(${row})>:nth-child(3)>div>a`);
  // var fileChooser = await futureFileChooser;
  // await fileChooser.accept(['C:/develop/sys-ui/public/images/sys.logo.png']);


  // add birthday property
  if (birthday == "today") {
    //    click on calender
    await page.waitFor(`tbody>:nth-child(${row})>:nth-child(5)>div>div>div>i`);
    await click(page,`tbody>:nth-child(${row})>:nth-child(5)>div>div>div>i`);

    //    set date
    await page.waitFor(`div.date-time-picker>:nth-child(2)>button`);
    await click(page,`div.date-time-picker>:nth-child(2)>button`, 'Set');
  } else
    await page.type(`tbody>:nth-child(${row})>:nth-child(5)>div>div>input`, birthday);

  // add age property
  await page.type(`tbody>:nth-child(${row})>:nth-child(4)>input`, age.toString());

  // add name property
  await page.waitFor(`tbody>:nth-child(${row})>:nth-child(3)>input`);
  await page.type(`tbody>:nth-child(${row})>:nth-child(3)>input`, name);


  // select Language
  await click(page,`tbody>:nth-child(${row})>:nth-child(6)>input`);
  await page.waitFor('a.dropdown-item');
  await click(page,'a.dropdown-item', language);

  // select codes
  for (let code of codes) {
    await page.waitFor(`tbody>:nth-child(${row})>:nth-child(7)>div>:last-child`);
    await click(page,`tbody>:nth-child(${row})>:nth-child(7)>div>:last-child`);
    await click(page,`tbody>:nth-child(${row})>:nth-child(7)>div>:last-child`); //for small devices need!
    await waitForSelector(page,`a`, code);
    await click(page,`a`, code);
  }
}

async function emptyRecord(row) {
  // uncheck disable
  await page.waitFor(`tbody>:nth-child(${row})>:nth-child(2)>div>input`);
  let check = await getProp(`tbody>:nth-child(1)>:nth-child(2)>div>input`, "checked");
  if (check == true)
    await click(page,`tbody>:nth-child(${row})>:nth-child(2)>div>label`);

  // empty name
  await page.waitFor(`tbody>:nth-child(${row})>:nth-child(3)>input`);
  await set(`tbody>:nth-child(${row})>:nth-child(3)>input`, "");

  // add age property
  await set(`tbody>:nth-child(${row})>:nth-child(4)>input`, "");

  // add birthday property
  await set(`tbody>:nth-child(${row})>:nth-child(5)>div>div>input`, "");


  // select Language
  await set(`tbody>:nth-child(${row})>:nth-child(6)>input`, "");

  // empty codes
  let codeElements = await page.$$eval(`tbody>:nth-child(${row})>:nth-child(7)>div> *  `, (codes) => {
    codes.forEach(code => {
      console.log("code: " + code);
      let iElement = code.querySelector('i');
      if (iElement)
        iElement.click()
    });
  });
}

async function changeRecord(row, disabled, name, age, birthday, language, codes: string[]) {


}

async function checkCorrectness(row, disabled, name, age, birthday, language, codes: string[]) {
  //  property disabled
  let disableReal = await getProp(`tbody>:nth-child(${row})>:nth-child(2)>div>input`, 'checked');
  expect(disableReal).toBe(disabled);
  //  expect(page.$(`tbody>:nth-child(${1})>:nth-child(2)>div>label`).prop("checked")).toBeTruthy();

  // property name
  let nameReal = await getProp(`tbody>:nth-child(${row})>:nth-child(3) input`, 'value');
  expect(nameReal).toBe(name);

  // property date
  let birthdayReal = await getProp(`tbody>:nth-child(${row})>:nth-child(5)>div>div>input`, 'value');
  if (birthday == "today")
    expect(birthdayReal).toBe(moment(new Date()).format('YYYY/MM/DD').toString());
  else
    expect(birthdayReal).toBe(birthday);

  // property age
  let ageReal = await getProp(`tbody>:nth-child(${row})>:nth-child(4) input`, 'value');
  expect(ageReal).toBe(age.toString());

  // property language
  let languageReal = await getProp(`tbody>:nth-child(${row})>:nth-child(6) input`, 'value');
  expect(languageReal).toBe(language);

  // property codes
  for (let index in codes) {
    let codeReal = await page.$eval(`tbody>:nth-child(${row})>:nth-child(7)>div>:nth-child(${(parseInt(index) + 1)}) span`, el => el.innerHTML);
    expect(codeReal).toBe(codes[index]);
  }
}

async function deleteRecord(page,type, row?) {
  if(!row)
    row=1;
  //await page.waitFor('text-secondary.fa-lg.fal.fa-plus-circle');
  let hasRow = await page.$(`tbody>:nth-child(${row})>:nth-child(1)`);
  if (hasRow) {
    // open context menu
    await click(page,`tbody>:nth-child(${row})>:nth-child(1)`);
    if (type == "All")
      await click(page,'a', "Select All");
    else
      await click(page,'a', "Select");
    // delete
    await click(page,'button> i.fa-trash');
    // save
    await saveRefresh(page);
  }
}

async function saveRefresh(page) {
  // save
  console.log('save inserted documents');
  await page.waitFor('button.btn-success');
  await click(page,'button.btn-success');
  await waitForSelector(page,'span', 'Saved!');

  //refresh
  await page.reload({waitUntil: ["networkidle0", "domcontentloaded"]});
}

// e2e test
describe('e2e crud test', () => {
  test('Load DEV home page for starting the tests', async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      slowMo: 30
    });
    page = await browser.newPage();
    await page.goto('http://localhost:3400/dev-tools', {waitUntil: 'networkidle0'});

  });

  test('login', async () => {
    // await page.waitFor('a[href="/authCheck"]');
    // await click(page,'a[href="/authCheck"]');
    await page.waitFor('input[name="email"]');
    await page.type('input[name="email"]', 'jila.amini@gmail.com');
    await page.type('input[name="password"]', 'Mina1234');
    await click(page,'button[class="btn btn-primary m-1"]');
    // For too many redirect issue(I guess it is a kinds of a speed problem) needs to refresh 4 times!
    await page.waitFor(1000);
    await page.reload();
    await page.reload();
    await page.reload();
    await page.reload();
  });

  test('Loading testObject', async () => {
    await page.waitFor('a[href="/dev-tools/tests"]');
    await click(page,'a[href="/dev-tools/tests"]');
  });

  test('insert new document', async () => {
    await deleteRecord(page,'All');

    // click plus
    await waitForSelector(page,'i.fa-plus-circle');
    await click(page,'i.fa-plus-circle');

    //insert row 1
    await submitRecord(1, true, "Shila", 35, '2020/01/01', "English", ["Not Implemented", "Not Found"]);
    await click(page,'i.fa-plus-circle');

    //insert row 2
    await submitRecord(2, false, "Farhad", 40, 'today', 'فارسی', ["Not Found"]);
    await click(page,'i.fa-plus-circle');

    //insert row 3
    await submitRecord(3, true, "Asghar", 45, '', 'العربية', ["Ok"]);

    await saveRefresh(page);

    // testing saved successfully and correctly
    await checkCorrectness(1, true, "Shila", 35, '2020/01/01', "English", ["Not Implemented", "Not Found"]);
    await checkCorrectness(2, false, "Farhad", 40, 'today', 'فارسی', ["Not Found"]);
    await checkCorrectness(3, true, "Asghar", 45, '', 'العربية', ["Ok"]);
  });

  test('edit a document', async () => {
    await emptyRecord(1);
    await submitRecord(1, false, "Zhila", 15, '2020/02/02', "France", ["Forbidden"]);

    await saveRefresh(page);

    // testing saved successfully and correctly
    await checkCorrectness(1, false, "Zhila", 15, '2020/02/02', "France", ["Forbidden"]);
  });

  test('delete a document', async () => {
    await deleteRecord(page,'One',2);
  });

  test('delete all document', async () => {
      //await deleteRecord('All');
    }
  );

  test('edit in detailed view', async () => {
    await waitForSelector(page,`tbody>:nth-child(1)>:nth-child(1)`);

    // open context menu
    await click(page,`tbody>:nth-child(1)>:nth-child(1)`);

    // details
    await click(page,'a', "Details");

    // click on address
    await waitForSelector(page,'a', "Address");
    await click(page,'a', "Address");

    // type city
    await page.type('input[name=city]', 'Istanbul');

    //type street
    await page.type('input[name=street]', 'Libadyieh');

    await saveRefresh(page);

    //check correctnss
    // property city
    let cityReal = await getProp('input[name=city]', 'value');
    expect(cityReal).toBe('Istanbul');

    // property street
    let streetReal = await getProp('input[name=street]', 'value');
    expect(streetReal).toBe('Libadyieh');

    //change city value
    //emty city
    await set('input[name=city]', "");

    // type city
    await page.type('input[name=city]', 'NewYork');

    //save and refresh
    await saveRefresh(page);

    // again check new value of  city
    cityReal = await getProp('input[name=city]', 'value');
    expect(cityReal).toBe('NewYork');

    //return to test object
    await page.waitFor('a[href="/dev-tools/tests"]');
    await click(page,'a[href="/dev-tools/tests"]');

  });
});

// describe('Security check', function () {
//   test('Goto objects in new page', async () => {
//     browser = await puppeteer.launch({
//       headless: false,
//       defaultViewport: null,
//       slowMo: 30
//     });
//     page2 = await browser.newPage();
//     await page2.goto('http://localhost:3400/dev', {waitUntil: 'networkidle0'});
//
//     //login
//     await page2.type('input[name="email"]', 'jila.amini@gmail.com');
//     await page2.type('input[name="password"]', 'Mina1234');
//     await click(page2,'button[class="btn btn-primary m-1"]');
//
//     //load objects
//     await page2.waitFor('a[href="/objects"]');
//     await click(page2,'a[href="/objects"]');
//
//     //filter test objects
//     await page2.waitFor('input.filter-prop-value[name="title"]');
//     await page2.type('input.filter-prop-value[name="title"]','Tests');
//     await page2.keyboard.press('Enter');
//
//     // select test object
//     await page2.waitFor('a[href="/objects/5f5c745a47cafc1a18214c2e"]');
//     await click(page2,'a[href="/objects/5f5c745a47cafc1a18214c2e"]');
//   });
//
//   test('removing access to object test', async()=>{
//     //go to access section
//     await waitForSelector(page2,'a',"Access");
//     await click(page2,'a',"Access");
//
//     //delete old access
//     await deleteRecord(page2,"All");
//
//     //goto test object page in dev tools for access deny
//     await page.bringToFront();
//     await page.reload();
//
//     await waitForSelector(page,'h1','Global error');
//   });
//
//   test('giving access to object test',async()=>{
//     //new access
//     await page2.bringToFront();
//     await click(page2,'i.fa-plus-circle');
//
//     //select user and permission
//     await page2.type('tbody>:nth-child(1)>:nth-child(2)>input','shila amini');
//     await page2.keyboard.press('Enter');
//
//     await page2.type('tbody>:nth-child(1)>:nth-child(4)>input','full');
//     await page2.keyboard.press('Enter');
//
//     await saveRefresh(page2);
//
//     //check the access in testObject
//     await page.bringToFront();
//     await page.reload();
//     await waitForSelector(page,'a[href="/testObject"]');
//   });
//
//   test('remove access to a property', async ()=>{
//
//     let res= await page.$$eval('th',(elements)=>{
//       console.log(elements);
//       elements.forEach(el=>{
//         console.log(el);
//       });
//       let res=elements.find(el=> el.innerHTML.trim() == 'Age');
//       return res;
//     });
//
//     expect(res).toBeTruthy();
//
//     await page2.bringToFront();
//
//     //go to age property
//     await page2.goto("http://localhost/objects/5e6228db4cbdf5495c905b75/properties/5e622ad44cbdf5495c905b77");
//
//     //wait for access section
//     await waitForSelector(page2,'a',"Access");
//     await click(page2,'a',"Access");
//
//     //give access to farhad only
//     await waitForSelector(page2,'tbody>:nth-child(1)>:nth-child(2)>input');
//     await click(page2,'tbody>:nth-child(1)>:nth-child(2)>input');
//     await waitForSelector(page2,'a','Farhad Jalali');
//     await click(page2,'a','Farhad Jalali');
//     await saveRefresh(page2);
//
//     //check access in test object
//     await page.bringToFront();
//     await page.waitFor(1000);
//     await page.reload();
//     await page.waitFor(1000);
//
//     //search for age property
//      res= await page.$$eval('th',(elements)=>{
//       return elements.find(el=> el.innerHTML== 'Age');
//     });
//
//     expect(res).toBeFalsy();
//
//     await page2.bringToFront();
//     await waitForSelector(page2,'tbody>:nth-child(1)>:nth-child(2)>input');
//     await click(page2,'tbody>:nth-child(1)>:nth-child(2)>input');
//     await waitForSelector(page2,'a','Shila Amini');
//     await click(page2,'a','Shila Amini');
//     await saveRefresh(page2);
//
//   });
//
//   test('giving access to a property', async ()=>{
//
//   });
//
// });

describe('functionality check', function () {
  test('sort a document', async () => {
  });

  test('hide a property functionality check', async () => {
    //close the chromium
    //await browser.close();
    //browser.close();
  });
});