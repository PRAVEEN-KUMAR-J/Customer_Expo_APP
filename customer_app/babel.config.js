// Ensure Expo Router knows where the app directory is for web bundling
process.env.EXPO_ROUTER_APP_ROOT = './app';

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['expo-router/babel'],
  };
};

