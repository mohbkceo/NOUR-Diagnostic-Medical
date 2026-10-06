import { useRef, useState } from 'react'
import { Upload, X, FileText } from 'lucide-react'
import { ACCEPT_ATTR, formatFileSize, validateDocumentFile } from '../../utils/file'
import { useLocale } from '../../i18n/LocaleProvider'

export function DocumentUpload({ file, onChange, error, setError }) {
  const { copy } = useLocale()
  const inputRef = useRef(null)
  const [checking, setChecking] = useState(false)

  async function handleFiles(fileList) {
    const selected = fileList?.[0]
    if (!selected) return
    setChecking(true)
    const result = await validateDocumentFile(selected)
    setChecking(false)
    if (!result.valid) {
      setError(copy.reservation.upload.errors[result.code] ?? copy.reservation.error)
      onChange(null)
      return
    }
    setError(null)
    onChange(selected)
  }

  const isImage = file && file.type.startsWith('image/')

  return (
    <div>
      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-line bg-white px-4 py-8 text-center transition-colors hover:border-primary"
        >
          <Upload size={20} className="text-primary" />
          <span className="text-sm font-medium text-ink">
            {checking ? copy.reservation.upload.checking : copy.reservation.upload.add}
          </span>
          <span className="text-xs text-ink-soft">{copy.reservation.upload.hint}</span>
        </button>
      ) : (
        <div className="flex items-center justify-between gap-3 rounded-md border border-line bg-white px-4 py-3">
          <div className="flex items-center gap-3 overflow-hidden">
            {isImage ? (
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="h-10 w-10 shrink-0 rounded-sm object-cover"
              />
            ) : (
              <FileText size={20} className="shrink-0 text-primary" />
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{file.name}</p>
              <p className="text-xs text-ink-soft">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <button
            type="button"
            aria-label={copy.reservation.upload.remove}
            onClick={() => onChange(null)}
            className="shrink-0 rounded-full p-1.5 text-ink-soft hover:bg-ink/5"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTR}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error ? (
        <p role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}
