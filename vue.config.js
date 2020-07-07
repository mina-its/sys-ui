module.exports = {
    devServer: {
        host: 'tasks.localhost',
        proxy: 'http://tasks.localhost:3400/'
    },

    productionSourceMap: false,
    crossorigin: "",
    pwa: {},

    css: {
        extract: true
    }
};
