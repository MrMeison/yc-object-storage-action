import path from 'node:path'
import fs from 'node:fs'
import mime from 'mime-types'
import fg from 'fast-glob'
import {Logger, Options} from './types'
import {
  S3Client,
  ListObjectsCommand,
  DeleteObjectsCommand,
  PutObjectCommand
} from '@aws-sdk/client-s3'

const emptyS3Bucket = async (
  s3Client: S3Client,
  bucketName: string
): Promise<void> => {
  const listCommand = new ListObjectsCommand({Bucket: bucketName})
  const listedObjects = await s3Client.send(listCommand)

  if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
    return
  }

  const deleteKeys = listedObjects.Contents.map(c => ({
    Key: c.Key as string
  }))

  const deleteCommand = new DeleteObjectsCommand({
    Bucket: bucketName,
    Delete: {Objects: deleteKeys}
  })
  await s3Client.send(deleteCommand)

  if (listedObjects.IsTruncated) {
    await emptyS3Bucket(s3Client, bucketName)
  }
}

export async function upload(
  s3Client: S3Client,
  logger: Logger,
  options: Options
): Promise<void> {
  if (options.clear) {
    await emptyS3Bucket(s3Client, options.bucketName)
  }

  const sourceDirFullPath = path.resolve(options.sourceDir)

  const fileStream = fg.stream(options.include, {
    ignore: options.exclude,
    cwd: options.sourceDir,
    onlyFiles: true
  })

  const s3Requests = []
  for await (const entry of fileStream) {
    const filePath = entry.toString()

    const type = mime.lookup(filePath) || 'text/plain'
    const putCommand = new PutObjectCommand({
      Key: filePath,
      Bucket: options.bucketName,
      Body: fs.createReadStream(path.resolve(sourceDirFullPath, filePath)),
      ContentType: type
    })

    logger.info(`Starting to upload: ${filePath}`)

    s3Requests.push(
      // eslint-disable-next-line github/no-then
      s3Client.send(putCommand).then(() => {
        logger.info(`Uploaded: ${filePath}`)
      })
    )
  }

  try {
    await Promise.all(s3Requests)
  } catch (e) {
    if (e instanceof Error) {
      logger.error('Error: ', e.message)
    }
    throw e
  }
}
