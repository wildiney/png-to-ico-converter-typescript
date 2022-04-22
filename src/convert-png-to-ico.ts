import {
  existsSync, readdirSync, mkdirSync, writeFileSync, Dirent
} from 'fs'
import path from 'path'
import { prompt } from 'inquirer'
import pngToIco from 'png-to-ico'

const questions = [
  {
    type: 'input',
    name: 'directory',
    message: 'Enter the directory to convert'
  }
]

function getPNGfiles (directory: string): Dirent[] {
  if (!existsSync(directory)) throw new Error('Directory does not exist')

  return readdirSync(directory, { withFileTypes: true })
    .filter((dirent) => dirent.isFile() && dirent.name.endsWith('.png'))
}

function convert (directory: string, files: Dirent[]) {
  files.forEach(async (file) => {
    try {
      await pngToIco(path.join(`${directory}`, `${file.name}`))
        .then((buffer) => {
          if (!existsSync(path.join(`${directory}`, '..', 'ico'))) {
            mkdirSync(path.join(`${directory}`, '..', 'ico'))
          }
          writeFileSync(path.join(`${directory}`, '..', 'ico', `${file.name.replace('.png', '.ico')}`), buffer)
        })
    } catch (error) {
      throw new Error(String(error))
    }
  })
  return true
}

async function main () {
  const answers = await prompt(questions)
  const { directory } = answers
  const filesInDir = await getPNGfiles(directory)
  if (filesInDir?.length === 0) {
    throw new Error('No file ending with .png found in the directory')
  }
  const converted = await convert(directory, filesInDir)
  if (converted) console.log('All files converted successfully')
}

main()
