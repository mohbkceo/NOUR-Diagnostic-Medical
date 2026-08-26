import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { validateDocumentFile } from '../../utils/file'
import { uploadSiteImage } from '../../services/storage'

export function AdminImageUpload({ value, onChange, folder = 'misc' }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function handleFile(fileList) {
    const file = fileList?.[0]
    if (!file) return
    const result = await validateDocumentFile(file)
    if (!result.valid) {
      setError(result.error)
      return
    }
    setError(null)
    setBusy(true)
    try {
      const url = await uploadSiteImage(file, folder)
      onChange(url)
    } catch (err) {
      setError(err.message || "Échec de l'envoi.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      {value ? (
        <div className="flex items-center gap-3">
          <img src={value} alt="" className="h-16 w-16 rounded-md object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="flex items-center gap-1 text-sm text-ink-soft hover:text-red-600"
          >
            <X size={14} /> Retirer
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex items-center gap-2 rounded-md border border-dashed border-line px-4 py-2.5 text-sm text-ink-soft hover:border-primary"
        >
          <Upload size={16} />
          {busy ? 'Envoi…' : 'Ajouter une image'}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files)}
      />
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
