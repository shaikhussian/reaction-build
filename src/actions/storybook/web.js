import easycp from 'easycp';
import fs from 'fs-extra';
import path from 'path';
import clean from '../clean';
import createConfig from '../../createConfig';
import log from '../../log';

export default async function storybookWeb(options, config) {
  if (!config) {
    config = await createConfig({ options });
    log.debug('options', options);
    log.debug('config', config);
  }
  if (options.clean) await clean(options, config);
  const storiesPath = fs.existsSync(
    path.resolve(config.paths.stories, '.storybook')
  )
    ? path.resolve(config.paths.stories, '.storybook')
    : path.resolve('node_modules/reaction-build/lib/storybook');
  await easycp(
    `node node_modules/@storybook/react/bin -p ${
      config.ports.storybook
    } -c ${storiesPath}${options.debug ? ' -- --debug' : ''}${
      options.verbose ? ' -- --verbose' : ''
    }`
  );
}
