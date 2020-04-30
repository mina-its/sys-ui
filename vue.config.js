process.env.GOOGLE_API_KEY = "XX";

module.exports = {

    devServer: {
        host: 'localhost',
        proxy: 'http://localhost/'
    },

    productionSourceMap: false,
    crossorigin: "",
    pwa: {},

    css: {
        extract: true
    }
};
