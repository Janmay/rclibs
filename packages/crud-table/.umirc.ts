export default {
  base: '/docs/',
  publicPath: '/static/',
  hash: true,
  history: {
    type: 'hash',
  },
  extraBabelPlugins: [['import', {libraryName: 'antd', style: 'css'}]],
};
