import { Moulinette, StyledSystem, Builder } from './types'

import { merge, flatten, compose, moulinettify } from './moulinette'
import { systyle } from './moulinettes'
import { uid, addClassName } from './moulinettes/classname'

export function createStyled<C, S extends C & StyledSystem>(
  builder: Builder<C>,
  moulinettes: Moulinette[] = []
) {
  const className = `s${uid()}`

  const moulinette: Moulinette = compose([
    addClassName(className),
    systyle,
    ...moulinettes
  ])

  const Styled = builder(moulinette) as S

  Styled.with = (...extras) => 
    createStyled(builder, [...moulinettes, ...flatten(extras).map(moulinettify)]) // prettier-ignore

  Styled.as = type => Styled.with({ as: type })

  Styled.className = className
  Styled.toString = () => `.${className}`

  return Styled
}

export { compose, merge }
export default createStyled
