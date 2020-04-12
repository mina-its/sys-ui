const path = require('path');

module.exports = {
    devServer: {
        host: 'localhost',
        proxy: 'http://localhost'
    },

    productionSourceMap: false,
    crossorigin: "",
    pwa: {},
}
