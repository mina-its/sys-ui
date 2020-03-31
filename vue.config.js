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

    productionSourceMap: false,

    crossorigin: "",

    pwa: {}

}
