module.exports = {
    devServer: {
        host: 'bid.localhost',
        proxy: 'http://bid.localhost:3400/'
    },

    productionSourceMap: false,
    crossorigin: "",
    pwa: {},

    css: {
        extract: true
    }
};
