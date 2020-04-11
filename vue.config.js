const path = require('path');

module.exports = {
    configureWebpack: {
        output: {
            libraryExport: 'default'
        },
        devServer: {
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        }
    },

    devServer: {
        host: 'alchemyadmin.localhost',
        proxy: 'http://alchemyadmin.localhost'
    },

    productionSourceMap: false,
    crossorigin: "",
    pwa: {},
}
