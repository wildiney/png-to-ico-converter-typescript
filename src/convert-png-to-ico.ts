import {
  existsSync, readdirSync, mkdirSync, writeFileSync, Dirent
} from 'fs'
import path from 'path'
import pngToIco from 'png-to-ico'

export function getPNGfiles (directory: string): Dirent[] {
  if (!existsSync(directory)) throw new Error('Directory does not exist')

  return readdirSync(directory, { withFileTypes: true })
    .filter((dirent) => dirent.isFile() && dirent.name.endsWith('.png'))
}

export async function convert (directory: string, files: Dirent[]) {
  await files.forEach(async (file) => {
    try {
      const buffer = await pngToIco(path.join(directory, file.name))
      if (!existsSync(path.join(directory, '..', 'ico'))) {
        mkdirSync(path.join(directory, '..', 'ico'))
      }
      writeFileSync(path.join(directory, '..', 'ico', `${file.name.replace('.png', '.ico')}`), buffer)
    } catch (error) {
      throw new Error(String(error))
    }
  })
  return true
}
