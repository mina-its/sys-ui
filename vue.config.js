module.exports = {

    devServer: {
        host: 'localhost',
        proxy: 'http://localhost'
    },

    productionSourceMap: false,
    crossorigin: "",
    pwa: {},

    css: {
        extract: true
    }
};
