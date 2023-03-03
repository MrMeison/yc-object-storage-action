import {upload} from '../src/yc-upload'
import {expect, test} from '@jest/globals'
import {logger} from '../__mock__/logger'
import {mockClient} from 'aws-sdk-client-mock';

import {
  S3Client,
  ListObjectsCommand,
  DeleteObjectsCommand,
  PutObjectCommand
} from '@aws-sdk/client-s3'

let s3Mock: ReturnType<typeof mockClient>;

const baseOptions = {
  sourceDir: './__fixtures__/upload',
  accessKeyId: 'accessKeyId',
  secretAccessKey: 'secretAccessKey',
  region: 'region',
};

beforeEach(() => {
  s3Mock = mockClient(S3Client);
  s3Mock.on(PutObjectCommand).resolves({});
  s3Mock.on(DeleteObjectsCommand).resolves({});
  s3Mock.on(ListObjectsCommand).resolves({
    Contents: [
      { Key: 'file1.txt'},
      { Key: 'file2.txt'},
      { Key: 'file3.txt'}
    ]
  });

})
test('clean', async () => {
  const s3Client = new S3Client({});

  await upload(s3Client, logger, {
    ...baseOptions,
    clear: true,
    include: ['**'],
    bucketName: 'bucket',
    exclude: []
  })

  expect(s3Mock.commandCalls(DeleteObjectsCommand, {
    Bucket: 'bucket',
    Delete: {
      Objects: [
        {Key: 'file1.txt'},
        {Key: 'file2.txt'},
        {Key: 'file3.txt'}
      ]
    }
  }, true)).toHaveLength(1);
})

test('exclude', async () => {
  const s3Client = new S3Client({});

  await upload(s3Client, logger, {
    ...baseOptions,
    clear: true,
    include: ['**'],
    bucketName: 'bucket',
    exclude: ['**/*.html']
  })

  expect(s3Mock.commandCalls(PutObjectCommand)).toHaveLength(2)
})

test('include', async () => {
  const s3Client = new S3Client({});

  await upload(s3Client, logger, {
    ...baseOptions,
    clear: true,
    include: ['**/*.html'],
    bucketName: 'bucket',
    exclude: []
  })

  expect(s3Mock.commandCalls(PutObjectCommand)).toHaveLength(2)
})
