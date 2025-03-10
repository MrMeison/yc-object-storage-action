# Deploy static site to Yandex Object Storage

![CI](https://github.com/MrMeison/yc-object-storage-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/MrMeison/yc-object-storage-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/MrMeison/yc-object-storage-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/MrMeison/yc-object-storage-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/MrMeison/yc-object-storage-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

This flow allows you to upload to
[Yandex Object Storage](https://cloud.yandex.ru/docs/storage/operations/hosting/setup)
so you can use it with Yandex CDN for a static site serving.

## Configuration

| Key               | Value                                                                             | Type        | Required |
| ----------------- | --------------------------------------------------------------------------------- | ----------- | -------- |
| `accessKeyId`     | Service account access key ID                                                     | `string`    | Yes      |
| `secretAccessKey` | Service account secret access key                                                 | `string`    | Yes      |
| `bucketName`      | Bucket name                                                                       | `string`    | Yes      |
| `sourceDir`       | Path to upload folder                                                             | `string`    | No       |
| `include`         | Include [patterns](https://github.com/mrmlnc/fast-glob#pattern-syntax) for files. | `multiline` | No       |
| `includeDots`     | Include dots files.                                                               | `boolean`   | No       |
| `exclude`         | Exclude [patterns](https://github.com/mrmlnc/fast-glob#pattern-syntax) for files. | `multiline` | No       |
| `clear`           | Clear bucket before deploy (default: `false`)                                     | `boolean`   | No       |

## Example

```yaml
name: Deploy static site to Yandex Object Storage
on:
  push:
    branches:
      - master
jobs:
  deploy:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16.x]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - name: Install NPM dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - uses: MrMeison/yc-object-storage-action@main
        with:
          accessKeyId: ${{ secrets.ACCESS_KEY_ID }}
          secretAccessKey: ${{ secrets.SECRET_ACCESS_KEY }}
          bucketName: ${{ secrets.BUCKET }}
          sourceDir: ./dist
          clear: true
```
