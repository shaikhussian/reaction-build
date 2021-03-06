import 'babel-polyfill';
import _ from 'lodash';
import { sleep } from 'deasync';
import createConfig from '../createConfig';
import log, { setLevel } from '../log';

if (_.includes(process.argv, '--verbose')) {
  setLevel('verbose');
}
if (_.includes(process.argv, '--debug')) {
  setLevel('debug');
}

module.exports = webpackConfig => {
  let config = null;
  createConfig({}).then(loadedConfig => {
    config = loadedConfig;
  });
  while (!config) sleep(100);
  webpackConfig.resolve.extensions.unshift('.web.js');
  webpackConfig.resolve.alias = {
    '~': config.paths.src,
    reaction: 'reaction-build/lib',
    'native-base': require.resolve('native-base-web'),
    'react/lib/ReactNativePropRegistry': require.resolve(
      'react-native-web/dist/modules/ReactNativePropRegistry'
    ),
    'react-native': require.resolve('react-native-web')
  };
  const jsxRule = _.find(
    webpackConfig.module.rules,
    rule => rule.loader.indexOf('babel-loader') > -1
  );
  _.assign(jsxRule, {
    query: {
      ...jsxRule.query,
      ...config.babel,
      plugins: [...jsxRule.query.plugins, ...(config.babel.plugins || [])],
      presets: [...jsxRule.query.presets, ...(config.babel.presets || [])]
    }
  });
  log.debug('webpackConfig', webpackConfig);
  return webpackConfig;
};
