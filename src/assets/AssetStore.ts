import { mergePresetDefaults } from '../domain/presets'
import type {
  BackgroundManifest,
  BackgroundSource,
  LayerRect,
  PortraitSource,
  PresetDefaults,
  PresetLayer,
  PresetManifest,
  TextboxManifest,
} from '../domain/types'
import { loadImage } from './loadImage'
import { loadJson } from './loadJson'
import { publicUrl } from './publicUrl'

interface AssetStoreData {
  textbox: HTMLImageElement
  textboxManifest: TextboxManifest
  presetManifest: PresetManifest
  backgroundManifest: BackgroundManifest
  defaultBackground: HTMLImageElement
}

export interface PresetLayerImage {
  image: HTMLImageElement
  rect: LayerRect
}

export class AssetStore {
  readonly textboxManifest: TextboxManifest
  readonly presetManifest: PresetManifest
  readonly backgroundManifest: BackgroundManifest

  private readonly textbox: HTMLImageElement
  private readonly images = new Map<string, HTMLImageElement>()
  private readonly variantLoads = new Map<string, Promise<void>>()
  private readonly backgroundImages = new Map<string, HTMLImageElement>()
  private readonly backgroundLoads = new Map<string, Promise<void>>()

  private portraitUpload: HTMLImageElement | null = null
  private backgroundUpload: HTMLImageElement | null = null
  private portraitUploadToken = 0
  private backgroundUploadToken = 0

  constructor(data: AssetStoreData) {
    this.textbox = data.textbox
    this.textboxManifest = data.textboxManifest
    this.presetManifest = data.presetManifest
    this.backgroundManifest = data.backgroundManifest
    this.backgroundImages.set(data.backgroundManifest.default, data.defaultBackground)
  }

  getTextboxSheet(): HTMLImageElement {
    return this.textbox
  }

  getCharacter(id: string) {
    return this.presetManifest[id] ?? null
  }

  getVariant(characterId: string, variantId: string) {
    return this.getCharacter(characterId)?.variants.find((variant) => variant.id === variantId) ?? null
  }

  async ensureVariant(characterId: string, variantId: string): Promise<void> {
    const variant = this.getVariant(characterId, variantId)
    if (!variant) throw new Error(`Unknown preset variant: ${characterId}/${variantId}`)

    const key = `${characterId}/${variantId}`
    const pending = this.variantLoads.get(key)
    if (pending) return pending

    const task = (async () => {
      await Promise.all([
        this.loadInto(variant.base),
        ...variant.eyes.map((layer) => this.loadInto(layer.file)),
        ...variant.mouths.map((layer) => this.loadInto(layer.file)),
      ])
    })()

    this.variantLoads.set(key, task)
    try {
      await task
    } finally {
      this.variantLoads.delete(key)
    }
  }

  getBaseImage(characterId: string, variantId: string): HTMLImageElement | null {
    const variant = this.getVariant(characterId, variantId)
    if (!variant) return null
    return this.images.get(variant.base) ?? null
  }

  getEyeLayer(characterId: string, variantId: string, index: number): PresetLayerImage | null {
    return this.getLayer(characterId, variantId, 'eyes', index)
  }

  getMouthLayer(characterId: string, variantId: string, index: number): PresetLayerImage | null {
    return this.getLayer(characterId, variantId, 'mouths', index)
  }

  getPortrait(source: PortraitSource): HTMLImageElement | null {
    if (source.kind === 'upload') return this.portraitUpload
    return this.getBaseImage(source.characterId, source.variantId)
  }

  getBackground(source: BackgroundSource): HTMLImageElement | null {
    if (source.kind === 'green') return null
    if (source.kind === 'upload') return this.backgroundUpload
    return this.backgroundImages.get(source.name) ?? null
  }

  async ensureBackground(name: string): Promise<void> {
    if (this.backgroundImages.has(name)) return

    const pending = this.backgroundLoads.get(name)
    if (pending) return pending

    const url = this.backgroundManifest.items[name]
    if (!url) throw new Error(`Unknown background preset: ${name}`)

    const task = loadImage(publicUrl(url)).then((image) => {
      this.backgroundImages.set(name, image)
    })

    this.backgroundLoads.set(name, task)
    try {
      await task
    } finally {
      this.backgroundLoads.delete(name)
    }
  }

  async setPortraitUpload(url: string | null): Promise<void> {
    const token = ++this.portraitUploadToken
    const image = url ? await loadImage(url) : null
    if (token === this.portraitUploadToken) this.portraitUpload = image
  }

  async setBackgroundUpload(url: string | null): Promise<void> {
    const token = ++this.backgroundUploadToken
    const image = url ? await loadImage(url) : null
    if (token === this.backgroundUploadToken) this.backgroundUpload = image
  }

  private async loadInto(file: string): Promise<void> {
    if (this.images.has(file)) return
    this.images.set(file, await loadImage(publicUrl(file)))
  }

  private getLayer(
    characterId: string,
    variantId: string,
    kind: 'eyes' | 'mouths',
    index: number,
  ): PresetLayerImage | null {
    const variant = this.getVariant(characterId, variantId)
    if (!variant) return null

    const layer: PresetLayer | undefined = variant[kind][index]
    if (!layer) return null

    const image = this.images.get(layer.file)
    if (!image) return null

    return { image, rect: layer.rect }
  }
}

export async function createAssetStore(): Promise<AssetStore> {
  const [textboxManifest, generatedPresets, presetDefaults, backgroundManifest] = await Promise.all([
    loadJson<TextboxManifest>(publicUrl('textbox.json')),
    loadJson<PresetManifest>(publicUrl('presets.json')),
    loadJson<PresetDefaults>(publicUrl('preset-defaults.json')),
    loadJson<BackgroundManifest>(publicUrl('backgrounds.json')),
  ])

  const presetManifest = mergePresetDefaults(generatedPresets, presetDefaults)

  const [textbox, defaultBackground] = await Promise.all([
    loadImage(publicUrl(textboxManifest.sheet)),
    loadImage(publicUrl(backgroundManifest.items[backgroundManifest.default])),
    document.fonts.load('44px "Optima Nova"'),
    document.fonts.load('36px "Optima Nova"'),
  ])

  return new AssetStore({
    textbox,
    textboxManifest,
    presetManifest,
    backgroundManifest,
    defaultBackground,
  })
}
