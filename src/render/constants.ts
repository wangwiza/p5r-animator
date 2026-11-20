export const GREEN = '#00ff00'
export const FONT = '"Optima Nova", Georgia, serif'
export const GROUP_OPACITY = 0.9
export const HIGHLIGHT_BOX_BLACK = '#000000'
export const HIGHLIGHT_BOX_GREY = '#3a3a3a'

export const PORTRAIT = { width: 768, height: 768, slide: 40 }
export const SHADOW = { opacity: 0.8, x: -24, y: 24, slideDuration: 0.2 }

const FONT_SIZE = 32

// Measured from the diagonal white name plate in the 1:1 textbox crop.
export const NAME = { x: 722, y: 814, fontSize: FONT_SIZE, angleDeg: -15.3 }

// Safe inner region of the black text area (crop x200-880, y180-305).
export const DIALOGUE = {
  x: 645,
  y: 873,
  width: 680,
  height: 135,
  fontSize: FONT_SIZE,
  minFontSize: 20,
  lineHeight: 42,
  maxLines: 3,
}

export const DIALOGUE_VERTICAL_OFFSET = 6
