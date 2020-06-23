module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
        modules: process.env.MODULES || false,
      },
    ],
    [
      '@babel/preset-react',
      {
        useBuiltIns: true,
      },
    ],
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
  ]
};
