import input from '@inquirer/input';
import { getPNGfiles, convert } from './convert-png-to-ico'

export async function main () {
  const answers = await input({ 'message': 'Enter the directory to convert' })
  const directory = answers
  const filesInDir = getPNGfiles(directory)
  if (filesInDir?.length === 0) {
    throw new Error('No file ending with .png found in the directory')
  }
  await convert(directory, filesInDir)
  console.log('All files converted successfully')
}

main()
