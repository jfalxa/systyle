import { Props } from '../types'

export function uid() {
  return Math.random()
    .toString(36)
    .slice(2)
}

export function addClassName(extraClassName: string) {
  return (props: Props) => ({
    ...props,
    className: [props.className, extraClassName].filter(Boolean).join(' ')
  })
}
