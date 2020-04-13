module.exports = {

    devServer: {
        host: '192.168.1.12',
        proxy: 'http://192.168.1.12'
    },

    productionSourceMap: false,
    crossorigin: "",
    pwa: {},

    css: {
        extract: true
    }
};
