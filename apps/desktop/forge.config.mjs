export default {
  packagerConfig: {
    icon: './icons/app',
    asar: true,
    extraResources: [
      {
        from: '../webapp/out',
        to: 'webapp'
      }
    ]
  },
  rebuildConfig: {},
  makers: [],
  plugins: []
};