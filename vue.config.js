module.exports = {
    publicPath: './', //项目打包跟目录
    assetsDir: 'static', //静态资源放置目录
    outputDir: process.env.outputDir, // 打包生成目录
    lintOnSave: true, // 关闭eslint检查
    runtimeCompiler: false, // 是否使用包含运行时编译器的 Vue 构建版本
    productionSourceMap: true, // 生产环境的 source map
    devServer: {
        port: 8088, // 端口号
        host: '127.0.0.1',
        disableHostCheck: true, //内网穿透
        https: false, // https:{type:Boolean}
        open: true, //配置自动启动浏览器
        proxy: {
            '/api': {
                target: '<url>',
                ws: false,
                changeOrigin: true
            }
        },
        overlay: {
            warnings: false,
            errors: false
        }
    },
    // 配置全局scss
    css: {
        loaderOptions: {
            sass: {
                data: '@import "@/assets/css/theme/theme.scss";'
            }
        }
    },
    configureWebpack: {
        externals: {
            vue: 'Vue',
            Axios: 'axios',
            vuex: 'Vuex',
            moment: 'moment',
            'vue-router': 'VueRouter'
        }
    }
}