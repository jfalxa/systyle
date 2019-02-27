import { Builder, System, Props, Wrapper } from '../src/types'
import { createSystem, merge } from '../src'

type Component = (props: Props) => any
const sys = (b: Builder<Component> = v => v) => createSystem(b)

function partitionBy(props: Props, by: (v: any, k: string) => boolean) {
  const match: Props = {}
  const rest: Props = {}

  Object.keys(props).forEach(key => {
    const value = props[key]

    if (by(value, key)) {
      match[key] = value
    } else {
      rest[key] = value
    }
  })

  return [match, rest]
}

it('creates a basic system', () => {
  const System = sys()

  expect(System({})).toEqual({})
  expect(System({ value: 0 })).toEqual({ value: 0 })
  expect(System.compute({})).toEqual({})
  expect(System.compute({ value: 0 })).toEqual({ value: 0 })
})

it('creates a system with custom builder', () => {
  const System = sys(() => () => ({ custom: true }))

  expect(System({})).toEqual({ custom: true })
  expect(System({ value: 0 })).toEqual({ custom: true })
})

it('attaches defaults to a system', () => {
  const System = sys().with({ common: true })
  const SystemA = System.with({ a: true })
  const SystemB = System.with({ b: true })
  const SystemCD = System.with({ c: true }, { d: true })

  expect(System({})).toEqual({ common: true })
  expect(SystemA({})).toEqual({ common: true, a: true })
  expect(SystemB({})).toEqual({ common: true, b: true })
  expect(SystemCD({})).toEqual({ common: true, c: true, d: true })
})

it('attaches a moulinette to a system', () => {
  const System = sys().with(({ input, ...props }) => ({ ...props, output: input })) // prettier-ignore

  expect(System({})).toEqual({})
  expect(System({ regular: true })).toEqual({ regular: true })
  expect(System({ input: 'test' })).toEqual({ output: 'test' })
  expect(System({ input: 'test', regular: true })).toEqual({ output: 'test', regular: true }) // prettier-ignore
})

it('attaches a sequence of moulinettes to a system', () => {
  function inputToBuffer({ input }: Props) {
    return { inputBuffer: input }
  }

  function bufferToBuffer({ inputBuffer }: Props) {
    return { outputBuffer: inputBuffer }
  }

  function bufferToOutput({ outputBuffer }: Props) {
    return { output: outputBuffer }
  }

  const SystemA = sys()
    .with(bufferToOutput)
    .with(bufferToBuffer)
    .with(inputToBuffer)

  const SystemB = sys().with(bufferToOutput, bufferToBuffer, inputToBuffer)
  const SystemC = sys().with([bufferToOutput, bufferToBuffer, inputToBuffer])
  const SystemD = sys().with([bufferToOutput], bufferToBuffer, inputToBuffer)
  const SystemE = sys().with([bufferToOutput, bufferToBuffer], inputToBuffer)
  const SystemF = sys().with(bufferToOutput, [bufferToBuffer, inputToBuffer])
  const SystemZ = sys().with([[[[[bufferToOutput]], [bufferToBuffer]], inputToBuffer]]) // prettier-ignore

  const systems = [SystemA, SystemB, SystemC, SystemD, SystemE, SystemF, SystemZ] // prettier-ignore

  systems.forEach(System => {
    expect(System({})).toEqual({})
    expect(System({ regular: true })).toEqual({})
    expect(System({ input: 'test' })).toEqual({ output: 'test' })
  })
})

it('can create an api to manage css', () => {
  const pickStyle = (props: Props) =>
    partitionBy(props, (_, key) =>
      ['display', 'fontFamily', 'fontSize', 'background', 'color'].includes(key)
    )

  const Styled = sys().with(props => {
    const [style, regular] = pickStyle(props)

    return {
      ...regular,
      as: props.as || 'div',
      style: merge(props.style, style)
    }
  })

  const Box = Styled.with({ display: 'flex' })
  const Text = Styled.with({ as: 'span', fontFamily: 'mono', fontSize: 16 })
  const BlueBox = Box.with({ background: 'blue' })
  const Title = Text.with({ as: 'h1', fontSize: 24 })

  expect(Styled({ color: '#fff' })).toEqual({ as: 'div', style: { color: '#fff' } }) // prettier-ignore
  expect(Box({})).toEqual({ as: 'div', style: { display: 'flex' } }) // prettier-ignore
  expect(Text({})).toEqual({ as: 'span', style: { fontFamily: 'mono', fontSize: 16 } }) // prettier-ignore
  expect(BlueBox({})).toEqual({ as: 'div', style: { display: 'flex', background: 'blue' } }) // prettier-ignore
  expect(Title({})).toEqual({ as: 'h1', style: { fontFamily: 'mono', fontSize: 24 } }) // prettier-ignore
})

it('ignores moulinettes that do not return objects', () => {
  const System = sys().with(
    props => ({ ...props, end: true }),
    ({ change, ...props }) => (change ? { ...props, middle: true } : null),
    { start: true }
  )

  expect(System({})).toEqual({ start: true, end: true })
  expect(System({ change: true })).toEqual({ start: true, middle: true, end: true }) // prettier-ignore
})

it('invokes a system moulinette statically', () => {
  const System = sys().with(({ input }) => ({ output: input }))
  expect(System.compute({ input: 'test' })).toEqual({ output: 'test' })
})

it('extends a system', () => {
  interface Ext extends System, Component {
    ok(): boolean
  }

  const Ext = sys().extend((Ext: Ext) => {
    Ext.ok = () => true
  })

  const ExtChild = Ext.with({ nothing: null })

  expect(Ext.ok()).toBeTruthy()
  expect(ExtChild.ok()).toBeTruthy()
})

it('wraps as system with functions', () => {
  const theme = { spacing: 8 }

  const withTheme: Wrapper<Component> = Component => props =>
    Component({ ...props, theme: merge(theme, props.theme || {}) })

  const A = sys().wrap(withTheme)
  const B = A.with({ other: true })

  expect(A({})).toEqual({ theme })
  expect(B({})).toEqual({ theme, other: true })
  expect(B({ theme: { fonts: { M: 16 }}})).toEqual({ other: true, theme: { spacing: 8, fonts: { M: 16 } } }) // prettier-ignore
})

it('can build something else than functions', () => {
  class Component {
    constructor(protected props: Props) {}
  }

  const builder = (moulinette: Function) =>
    class Moulinette extends Component {
      run() {
        return moulinette(this.props)
      }
    }

  const System = createSystem(builder)
  const A = System.with({ a: true })
  const B = A.with({ b: true })

  const system = new System({})
  const a = new A({})
  const b = new B({})
  const ab = new A({ b: true })
  const abc = new B({ c: true })

  expect(system).toEqual({ props: {} })
  expect(a.run()).toEqual({ a: true })
  expect(b.run()).toEqual({ a: true, b: true })
  expect(ab.run()).toEqual({ a: true, b: true })
  expect(abc.run()).toEqual({ a: true, b: true, c: true })
})
