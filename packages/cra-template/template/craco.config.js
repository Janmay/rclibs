const CracoLessPlugin = require('craco-less');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

const themeVars = require('./config/theme');

module.exports = {
  plugins: [
    // antd dayjs
    new AntdDayjsWebpackPlugin(),
    // antd theme
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: themeVars,
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
