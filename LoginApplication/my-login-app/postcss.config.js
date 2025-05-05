module.exports = {
  plugins: [
    require('postcss-flexbugs-fixes'),
    require('postcss-preset-env')({ stage: 3 }),
    require('tailwindcss'),
    require('autoprefixer'),
    require('postcss-normalize')
  ],
}
