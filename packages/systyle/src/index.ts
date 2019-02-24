import { merge, Props, System, Moulinette } from 'moulinette'
import { cx, css as emotion, Interpolation } from 'emotion'
import { partition, compact, isEmpty } from './helpers'
import { isCSSProperty } from './css'

type CSSTemplate = [TemplateStringsArray, Interpolation<Props>[]]

type CSSGenProps = Props & {
  css?: Interpolation
  raw?: CSSTemplate[]
  className?: string
}

type ElementProps = Props & {
  as?: string | Function
}

interface Styled extends System {
  css(template: CSSTemplate[0], ...args: CSSTemplate[1]): this
  animate(timing: string, animation: object): this
}

function chunk(moulinette: Moulinette): Moulinette {
  return props => ({ ...props, ...moulinette(props) })
}

function computeArgs(args: CSSTemplate[1], props: Props) {
  return args.map((arg: any) => (typeof arg === 'function' ? arg(props) : arg))
}

function template(raw: CSSTemplate[] = [], props: Props) {
  return raw.map(([template, args]) =>
    emotion(template, ...computeArgs(args, props))
  )
}

export function createElement({ as: type = 'div', ...props }: ElementProps) {
  return { ...props, as: type }
}

export function generateCSS({ css, raw, className, ...props }: CSSGenProps) {
  return { ...props, className: cx(className, template(raw, props), emotion(css)) } // prettier-ignore
}

export function pickCSS(input: Props) {
  const [cssProps, props] = partition(input, isCSSProperty)
  const css = compact(merge(props.css || {}, cssProps))

  if (!isEmpty(css)) {
    props.css = css
  }

  return props
}

export function extension(Styled: Styled) {
  Styled.css = (template, ...args) =>
    Styled.with(
      chunk(({ raw = [] }) => ({
        raw: [[template, args], ...raw]
      }))
    )
}
