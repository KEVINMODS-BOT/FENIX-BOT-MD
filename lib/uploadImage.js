import fetch from 'node-fetch';
import { FormData, Blob } from 'formdata-node';
import { fileTypeFromBuffer } from 'file-type'

export default async buffer => {
  const { ext, mime } = await fileTypeFromBuffer(buffer)
  let form = new FormData()
  const blob = new Blob([buffer.toArrayBuffer()], { type: mime })
  form.append('file', blob, 'tmp.' + ext)
  let res = await fetch('https://telegra.ph/upload', {
    method: 'POST',
    body: form
  })
  let img = await res.json()
  if (img.error) throw img.error
  return 'https://telegra.ph' + img[0].src
}
