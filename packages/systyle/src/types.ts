import { Props, System } from 'moulinette'
import { Interpolation } from 'emotion'

export type By = (value: any, key: string, props: Props) => boolean
export type CSSTemplate = [TemplateStringsArray, Interpolation<Props>[]]

export type CSSGenProps = Props & {
  css?: [CSSTemplate | Interpolation][]
  className?: string
}

export type ElementProps = Props & {
  as?: string | Function
}

export type ClassProps = Props & {
  classNames?: string[]
}

export interface Styled extends System {
  css(template: CSSTemplate[0], ...args: CSSTemplate[1]): this
  animate(timing: string, animation: object): this
}
