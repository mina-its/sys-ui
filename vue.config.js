module.exports = {
    devServer: {
        host: 'localhost',
        proxy: 'http://localhost:3400/'
    },

    productionSourceMap: false,
    crossorigin: "",
    pwa: {},

    css: {
        extract: true
    }
};
