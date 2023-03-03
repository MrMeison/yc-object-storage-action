import {Logger} from '../src/types'

export const logger: Logger = {
  log: (...messages) => {
    // eslint-disable-next-line no-console
    console.log(messages.join('\n'))
  },
  warn: (...messages) => {
    // eslint-disable-next-line no-console
    console.log(messages.join('\n'))
  }
}
