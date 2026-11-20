import type { ReactNode } from 'react'

interface FieldProps {
  label: ReactNode
  children: ReactNode
  className?: string
}

export function Field({ label, children, className }: FieldProps) {
  return <label className={className}>{label}{children}</label>
}
