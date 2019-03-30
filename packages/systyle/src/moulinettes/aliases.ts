import { rename } from './helpers'

export const aliases = rename({
  bg: 'backgroundColor',
  m: 'margin',
  mx: ['marginLeft', 'marginRight'],
  my: ['marginTop', 'marginBottom'],
  mt: 'marginTop',
  mr: 'marginRight',
  mb: 'marginBottom',
  ml: 'marginLeft',
  p: 'padding',
  px: ['paddingLeft', 'paddingRight'],
  py: ['paddingTop', 'paddingBottom'],
  pt: 'paddingTop',
  pr: 'paddingRight',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  b: 'border',
  bx: ['borderLeft', 'borderRight'],
  by: ['borderTop', 'borderBottom'],
  bt: 'borderTop',
  br: 'borderRight',
  bb: 'borderBottom',
  bl: 'borderLeft',
  font: 'fontFamily',
  size: 'fontSize'
})
