module.exports = {

    devServer: {
        host: 'tixbox-admin.localhost',
        proxy: 'http://tixbox-admin.localhost/'
    },

    productionSourceMap: false,
    crossorigin: "",
    pwa: {},

    css: {
        extract: true
    }
};
