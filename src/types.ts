/* eslint-disable @typescript-eslint/no-explicit-any */
export type Options = {
  accessKeyId: string
  secretAccessKey: string
  bucketName: string
  region: string
  sourceDir: string
  include: string[]
  includeDots: boolean
  exclude: string[]
  clear: boolean
}

export type Logger = {
  log: (...messages: any[]) => void
  info: (...message: any[]) => void
  error: (...message: any[]) => void
  debug: (...message: any[]) => void
  warn: (...message: any[]) => void
}
