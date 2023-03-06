import {Logger} from '../src/types'

export const logger: Logger = {
  log: (...messages) => {
    console.log(messages.join('\n'))
  },
  info: (...messages) => {
    console.log(messages.join('\n'))
  },
  warn: (...messages) => {
    console.warn(messages.join('\n'))
  },
  error: (...messages) => {
    console.error(messages.join('\n'))
  },
  debug: (...messages) => {
    console.debug(messages.join('\n'))
  }
}
