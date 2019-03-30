import { Props } from '../types'

export function createElement({ as: type = 'div', ...props }: Props) {
  return { ...props, as: type }
}
