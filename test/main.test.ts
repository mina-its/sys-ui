jest.setTimeout(150000);
import  puppeteer = require("puppeteer");

let page: any;

async function click(selector: string) {
  await page.$eval(selector, (el: any) => el.click());
}

async function type(selector: string, val: string) {
  return await page.$eval(selector, (el, val) => el.value = val, val);
}

describe('e2e test', () => {
  beforeAll(async () => {

  });
  test('login', async () => {
    //expect(2+1).toBe(4);
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      slowMo: 30
    });
    page = await browser.newPage();
    await page.goto('http://dev.localhost:80/', {waitUntil: 'networkidle0'});
    await click('a[href="/login?f=1"]');


    //await page.$eval('a[href="/login-form?f=1"]', (el: any) => el.click());

    //  $('a[href="/login-form?f=1"]').click();
    // await type('input[name="email"]','root@gmail.com');
    // await type('input[name="password"]','1234');
    await page.type('input[name="email"]', 'root@gmail.com', {waitUntil: 'networkidle0'});
    await page.type('input[name="password"]', '1234', {waitUntil: 'networkidle0'});
    await click('button[class="btn btn-primary m-1"]');
    // await page.$eval('input[name="email"]', el => el.setAttribute('value', 'test@example.com'),{ waitUntil: 'networkidle0'});
    // await page.$eval('input[name="password"]', el => el.setAttribute('value', '1234'));
    await click('a[href="/test_gridView"]');

  });
});