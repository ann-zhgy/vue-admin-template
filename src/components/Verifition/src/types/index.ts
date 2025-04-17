export enum CaptchaType {
  /** 滑块. */
  SLIDER = 'SLIDER',
  /** 旋转. */
  ROTATE = 'ROTATE',
  /** 拼接. */
  CONCAT = 'CONCAT',
  /** 文字图片点选. */
  WORD_IMAGE_CLICK = 'WORD_IMAGE_CLICK'
}

export type Point = {
  left?: number
  top?: number
}

export type VerifyComponent = {
  init: (leftTopPoint?: Point) => void
}
