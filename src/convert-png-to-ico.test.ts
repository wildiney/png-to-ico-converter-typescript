import { existsSync, rmdirSync } from 'fs'
import { join } from 'path'
import { getPNGfiles, convert } from '../src/convert-png-to-ico'

afterAll(() => {
  const directory = join('tests', 'ico')
  if (existsSync(directory)) {
    rmdirSync(directory, { recursive: true })
  }
})

test('should return an array of files', () => {
  const filesInDir = getPNGfiles('./tests/png')
  expect(filesInDir).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: 'icon.png' })
    ])
  )
})

test('should convert a test file', async () => {
  const directory = join('tests', 'png')
  const filesInDir = getPNGfiles(directory)
  const converted = await convert(directory, filesInDir)
  expect(converted).toBe(true)
})

test('should make dir', async () => {
  const directory = join('tests', 'png')
  await convert(directory, getPNGfiles(directory))
  const folderCreated = existsSync(join(directory, '..', 'ico'))
  expect(folderCreated).toBe(true)
})
