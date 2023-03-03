export type Options = {
  accessKeyId: string
  secretAccessKey: string
  bucketName: string
  region: string
  sourceDir: string
  include: string[]
  exclude: string[]
  clear: boolean
}

export type Logger = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log: (...messages: any[]) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn: (...message: any[]) => void
}
