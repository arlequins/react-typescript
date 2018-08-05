import fs from 'fs'
import * as path from 'path'

const absolutePath = path.join(__filename.split('index.js')[0], '..', 'dist')
const manifest = path.join(absolutePath, 'assets.json')
const jsonData = JSON.parse(fs.readFileSync(manifest, 'utf8'))

const jsList = Object.keys(jsonData)
  .filter((key: string) => key.indexOf('.js') > -1 && key.indexOf('/manifest.js') === -1)
  .map((str: string) => `<script type="text/javascript" src="${jsonData[str]}"></script>`)

const manifestList = Object.keys(jsonData)
  .filter((key: string) => key.indexOf('/manifest.json') > -1 )
  .map((str: string) => `<link rel="manifest" href="${jsonData[str]}">`)

const cssList = Object.keys(jsonData)
  .filter((key: string) => key.indexOf('.css') > -1 )
  .map((str: string) => `<link rel="stylesheet" type="text/css" href="${jsonData[str]}">`)

export const Assets = {
  js: jsList,
  css: cssList,
  manifest: manifestList,
}
