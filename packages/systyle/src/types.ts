import { Props, System } from 'moulinette'
import { Interpolation } from 'emotion'

export type By = (value: any, key: string) => boolean
export type CSSTemplate = [TemplateStringsArray, Interpolation<Props>[]]

export type CSSGenProps = Props & {
  css?: Interpolation
  raw?: CSSTemplate[]
  className?: string
}

export type ElementProps = Props & {
  as?: string | Function
}

export interface Styled extends System {
  css(template: CSSTemplate[0], ...args: CSSTemplate[1]): this
  animate(timing: string, animation: object): this
}
