module.exports = {
    devServer: {
        host: 'dev.localhost',
        proxy: 'http://dev.localhost:3400/'
    },

    productionSourceMap: false,
    crossorigin: "",
    pwa: {},

    css: {
        extract: true
    }
};
