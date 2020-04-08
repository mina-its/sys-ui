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
        proxy: 'http://localhost'
    },

    productionSourceMap: false,

    crossorigin: "",

    pwa: {}

}
