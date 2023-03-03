import process from 'node:process'
import * as core from '@actions/core'
import {YANDEX_CLOUD_ENDPOINT, YANDEX_CLOUD_REGION} from './constants'
import {upload as ycUpload} from './yc-upload'
import {Options, Logger} from './types'
import {S3Client} from '@aws-sdk/client-s3'

async function run(): Promise<void> {
  try {
    const include = core.getMultilineInput('include')

    const options: Options = {
      accessKeyId: core.getInput('accessKeyId', {
        required: true
      }),
      secretAccessKey: core.getInput('secretAccessKey', {
        required: true
      }),
      bucketName: core.getInput('bucketName', {required: true}),
      sourceDir: core.getInput('sourceDir') || process.cwd(),
      include: include.length > 0 ? include : ['**'],
      exclude: core.getMultilineInput('exclude'),
      region: core.getInput('region') || YANDEX_CLOUD_REGION,
      clear: core.getBooleanInput('clear')
    }

    const logger: Logger = {
      log: (...messages) => {
        core.info(messages.join('\n'))
      },
      warn: (...messages) => {
        core.warning(messages.join('\n'))
      }
    }

    const s3 = new S3Client({
      endpoint: YANDEX_CLOUD_ENDPOINT,
      credentials: {
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey
      },
      region: options.region
    })

    await ycUpload(s3, logger, options)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
