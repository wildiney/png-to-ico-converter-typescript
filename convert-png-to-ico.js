import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'
import pngToIco from 'png-to-ico'

const questions = [
  {
    type: 'input',
    name: 'directory',
    message: 'Enter the directory to convert'
  }
]

inquirer
  .prompt(questions)
  .then((answers) => {
    const directory = answers.directory
    const filesInDir = fs.readdirSync(directory, { withFileTypes: true }).filter(dirent => dirent.isFile() && dirent.name.endsWith('.png'))
    filesInDir.forEach(async (file) => {
      try {
        await pngToIco(path.join(`${directory}`, `${file.name}`), path.join(`${directory}`, `${file.name.replace('.png', '.ico')}`))
          .then((buffer) => {
            if (!fs.existsSync(path.join(`${directory}`, '..', 'ico'))) {
              fs.mkdirSync(path.join(`${directory}`, '..', 'ico'))
            }
            fs.writeFileSync(path.join(`${directory}`, '..', 'ico', `${file.name.replace('.png', '.ico')}`), buffer)
          })
      } catch (error) {
        console.log("Error: ", error)
      }
    })
  })
  .catch((error) => {
    if (error.isTtyError) {
      console.log("Prompt couldn't be rendered in the current environment")
    } else {
      console.log('Something else went wrong')
    }
  })