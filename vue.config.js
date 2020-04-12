module.exports = {

    devServer: {
        host: 'alchemyadmin.localhost',
        proxy: 'http://alchemyadmin.localhost'
    },

    productionSourceMap: false,
    crossorigin: "",
    pwa: {},

    css: {
        extract: true
    }
};
