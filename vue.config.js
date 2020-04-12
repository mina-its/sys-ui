const path = require('path');

module.exports = {
    configureWebpack: {
        output: {
            libraryExport: 'default'
        }
    },

    devServer: {
        host: 'localhost',
        proxy: 'http://localhost'
    },

    productionSourceMap: false,
    crossorigin: "",
    pwa: {},
}
