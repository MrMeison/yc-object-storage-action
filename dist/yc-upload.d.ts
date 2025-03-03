import { Logger, Options } from './types.js';
import { S3Client } from '@aws-sdk/client-s3';
export declare function upload(s3Client: S3Client, logger: Logger, options: Options): Promise<void>;
