import {Logger} from '../src/types'

export const logger: Logger = {
  log: (...messages) => {
    // eslint-disable-next-line no-console
    console.log(messages.join('\n'))
  },
  info: (...messages) => {
    // eslint-disable-next-line no-console
    console.log(messages.join('\n'))
  },
  warn: (...messages) => {
    // eslint-disable-next-line no-console
    console.warn(messages.join('\n'))
  },
  error: (...messages) => {
    // eslint-disable-next-line no-console
    console.error(messages.join('\n'))
  },
  debug: (...messages) => {
    // eslint-disable-next-line no-console
    console.debug(messages.join('\n'))
  }
}
