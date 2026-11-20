import type { ChangeEvent } from 'react'
import { Field } from './Field'

interface FilePickerProps {
  label: string
  accept: string
  value: string | null
  clearLabel: string
  onChange: (url: string | null) => void
}

export function FilePicker({
  label,
  accept,
  value,
  clearLabel,
  onChange,
}: FilePickerProps) {
  const readFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => onChange(String(reader.result))
    reader.readAsDataURL(file)
  }

  return (
    <>
      <Field label={label} className="upload">
        <input type="file" accept={accept} onChange={readFile} />
      </Field>
      {value && (
        <button type="button" className="link" onClick={() => onChange(null)}>
          {clearLabel}
        </button>
      )}
    </>
  )
}
