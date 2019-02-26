import { Props } from 'moulinette/lib/types'

export function createElement({ as: type = 'div', ...props }: Props) {
  return { ...props, as: type }
}
