import easycp from 'easycp';
import log from '~/log';

export default async function buildExpo(options) {
  log.debug('options', options);
  log.info('building expo . . .');
  await easycp('exp build');
}