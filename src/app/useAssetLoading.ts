import { useCallback, useEffect, useState } from 'react'
import { AssetStore, createAssetStore } from '../assets/AssetStore'
import { resolveBackgroundPreset } from '../domain/buildRenderSpec'
import type { AnimatorFormState } from '../domain/form'

export interface AssetLoadingController {
  store: AssetStore | null
  error: string
}

export function useAssetLoading(form: AnimatorFormState): AssetLoadingController {
  const [store, setStore] = useState<AssetStore | null>(null)
  const [error, setError] = useState('')

  const reportError = useCallback((cause: unknown) => {
    setError(cause instanceof Error ? cause.message : String(cause))
  }, [])

  useEffect(() => {
    let cancelled = false
    createAssetStore()
      .then((created) => {
        if (!cancelled) setStore(created)
      })
      .catch(reportError)
    return () => {
      cancelled = true
    }
  }, [reportError])

  useEffect(() => {
    if (!store || form.portraitUploadUrl || !form.variantId) return
    store.ensureVariant(form.characterId, form.variantId).catch(reportError)
  }, [store, form.characterId, form.variantId, form.portraitUploadUrl, reportError])

  useEffect(() => {
    if (!store) return
    store.setPortraitUpload(form.portraitUploadUrl).catch(reportError)
  }, [store, form.portraitUploadUrl, reportError])

  useEffect(() => {
    if (!store || form.backgroundChoice === 'green' || form.backgroundChoice === 'upload') return
    const name = resolveBackgroundPreset(form.backgroundChoice, store.backgroundManifest)
    store.ensureBackground(name).catch(reportError)
  }, [store, form.backgroundChoice, reportError])

  useEffect(() => {
    if (!store) return
    store.setBackgroundUpload(form.backgroundUploadUrl).catch(reportError)
  }, [store, form.backgroundUploadUrl, reportError])

  return { store, error }
}
