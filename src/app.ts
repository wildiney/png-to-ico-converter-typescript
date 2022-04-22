import { prompt } from 'inquirer'
import { getPNGfiles, convert } from './convert-png-to-ico'

const questions = [
  {
    type: 'input',
    name: 'directory',
    message: 'Enter the directory to convert'
  }
]

export async function main () {
  const answers = await prompt(questions)
  const { directory } = answers
  const filesInDir = getPNGfiles(directory)
  if (filesInDir?.length === 0) {
    throw new Error('No file ending with .png found in the directory')
  }
  await convert(directory, filesInDir)
  console.log('All files converted successfully')
}

main()
