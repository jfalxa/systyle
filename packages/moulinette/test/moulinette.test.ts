import { createSystem, Builder, System, Props, merge } from '../src'

const sys = (b: Builder = v => v) => createSystem(b)

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

  const SystemA = sys().with(bufferToOutput, bufferToBuffer, inputToBuffer)

  const SystemB = sys()
    .with(bufferToOutput)
    .with(bufferToBuffer)
    .with(inputToBuffer)

  expect(SystemA({})).toEqual({})
  expect(SystemA({ regular: true })).toEqual({})
  expect(SystemA({ input: 'test' })).toEqual({ output: 'test' })

  expect(SystemB({})).toEqual({})
  expect(SystemB({ regular: true })).toEqual({})
  expect(SystemB({ input: 'test' })).toEqual({ output: 'test' })
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

  expect(Styled({ color: '#fff' })).toEqual({
    as: 'div',
    style: { color: '#fff' }
  })

  expect(Box({})).toEqual({
    as: 'div',
    style: { display: 'flex' }
  })

  expect(Text({})).toEqual({
    as: 'span',
    style: { fontFamily: 'mono', fontSize: 16 }
  })

  expect(BlueBox({})).toEqual({
    as: 'div',
    style: { display: 'flex', background: 'blue' }
  })

  expect(Title({})).toEqual({
    as: 'h1',
    style: { fontFamily: 'mono', fontSize: 24 }
  })
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
  interface Ext extends System {
    ok(): boolean
  }

  const Ext = sys().extend((Ext: Ext) => {
    Ext.ok = () => true
  })

  const ExtChild = Ext.with({ nothing: null })

  expect(Ext.ok()).toBeTruthy()
  expect(ExtChild.ok()).toBeTruthy()
})
