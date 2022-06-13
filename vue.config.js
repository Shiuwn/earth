module.exports = {
  lintOnSave: false,
  publicPath: './',
  assetsDir: 'static',
  css: {
    // 全局配置utils.scss,详细配置参考vue-cli官网
    loaderOptions: {
      scss: {
        prependData: '@import "~@/assets/styles/utils.scss";',
      },
    },
  },
}
