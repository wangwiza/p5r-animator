import type { AnimatorFormState } from './form'

export const DEFAULT_DIALOGUE =
  'This is a custom dialogue! Type anything you like, then export a clip ready for your editor.'

export const DEFAULT_CHARACTER_ID = 'lavenza'
export const DEFAULT_BACKGROUND_CHOICE = 'preset:montreal'
export const DEFAULT_BACKGROUND_PRESET = 'montreal'
export const DEFAULT_NAME = 'Lavenza'
export const DEFAULT_HIGHLIGHT_INDICES = '0'
export const DEFAULT_HOLD_SECONDS = 4
export const DEFAULT_DOWNLOAD_NAME = 'p5r-dialogue.mp4'

export const INITIAL_FORM_STATE: AnimatorFormState = {
  characterId: DEFAULT_CHARACTER_ID,
  variantId: '',
  portraitUploadUrl: null,
  backgroundChoice: DEFAULT_BACKGROUND_CHOICE,
  backgroundUploadUrl: null,
  name: DEFAULT_NAME,
  highlightIndices: DEFAULT_HIGHLIGHT_INDICES,
  dialogue: DEFAULT_DIALOGUE,
  holdSeconds: DEFAULT_HOLD_SECONDS,
}
