// Client-side file validation for the reservation document upload.
// Extension + declared MIME type are trivially spoofable, so we also sniff
// the file's magic bytes before accepting it. This is a UX convenience —
// the Edge Function re-validates independently server-side.

export const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024 // 8MB

export const ACCEPTED_TYPES = {
  'image/jpeg': { extensions: ['jpg', 'jpeg'], signature: [0xff, 0xd8, 0xff] },
  'image/png': { extensions: ['png'], signature: [0x89, 0x50, 0x4e, 0x47] },
  'image/webp': { extensions: ['webp'], signature: [0x52, 0x49, 0x46, 0x46] },
  'application/pdf': { extensions: ['pdf'], signature: [0x25, 0x50, 0x44, 0x46] },
}

export const ACCEPT_ATTR = '.jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf'

function getExtension(filename) {
  const parts = filename.toLowerCase().split('.')
  return parts.length > 1 ? parts.pop() : ''
}

async function readSignature(file, length) {
  const buffer = await file.slice(0, length).arrayBuffer()
  return new Uint8Array(buffer)
}

function matchesSignature(bytes, signature) {
  return signature.every((byte, i) => bytes[i] === byte)
}

export async function validateDocumentFile(file) {
  if (!file) return { valid: false, error: 'Aucun fichier sélectionné.' }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: 'Le fichier dépasse la taille maximale de 8 Mo.' }
  }

  const declaredType = ACCEPTED_TYPES[file.type]
  const extension = getExtension(file.name)

  if (!declaredType || !declaredType.extensions.includes(extension)) {
    return {
      valid: false,
      error: 'Format non supporté. Formats acceptés : JPG, PNG, WEBP, PDF.',
    }
  }

  try {
    const bytes = await readSignature(file, 4)
    if (!matchesSignature(bytes, declaredType.signature)) {
      return { valid: false, error: 'Le contenu du fichier ne correspond pas à son format.' }
    }
  } catch {
    return { valid: false, error: 'Impossible de lire le fichier.' }
  }

  return { valid: true, error: null }
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

// Generates a random, unguessable storage path — never trust or reuse the
// original filename (it can contain path traversal characters or collide).
export function buildSafeStoragePath(file) {
  const extension = getExtension(file.name) || 'bin'
  const random =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  const day = new Date().toISOString().slice(0, 10)
  return `${day}/${random}.${extension}`
}
