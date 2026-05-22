import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from './firebase.js'

const MAX_SIZE_BYTES = 20 * 1024 * 1024

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_')
}

export async function uploadComplaintFiles({ files, complaintId, onProgress }) {
  if (!storage || !Array.isArray(files) || files.length === 0) return []

  const uploads = files.map(
    (file) =>
      new Promise((resolve, reject) => {
        if (file.size > MAX_SIZE_BYTES) {
          reject(new Error(`${file.name} is larger than 20MB.`))
          return
        }
        const filePath = `complaints/${complaintId}/${Date.now()}-${sanitizeFileName(file.name)}`
        const storageRef = ref(storage, filePath)
        const upload = uploadBytesResumable(storageRef, file)

        upload.on(
          'state_changed',
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            onProgress?.(file.name, progress)
          },
          (error) => reject(error),
          async () => {
            const url = await getDownloadURL(upload.snapshot.ref)
            resolve({
              name: file.name,
              path: filePath,
              type: file.type,
              size: file.size,
              url,
            })
          },
        )
      }),
  )

  return Promise.all(uploads)
}
