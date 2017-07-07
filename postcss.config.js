module.exports = {
  plugins: [
    require('precss')({
      parser: require('postcss-scss')
    }),
    require('cssnano')({
      autoprefixer: {
        add: true,
        remove: true,
        browsers: ['> 5% in CN'],
      },
      discardComments: {
        removeAll: true,
      },
      discardUnused: false,
      mergeIdents: false,
      reduceIdents: false,
      safe: true,
    }),
    require('postcss-px2rem')({remUnit: 76}),
  ]
}
