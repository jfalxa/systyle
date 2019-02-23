import createSystem from '../src'

it('creates a basic system', () => {
  const System = createSystem()

  expect(System({})).toEqual({})
  expect(System({ value: 0 })).toEqual({ value: 0 })
  expect(System.moulinette({})).toEqual({})
  expect(System.moulinette({ value: 0 })).toEqual({ value: 0 })
})

it('creates a system with custom builder', () => {
  const System = createSystem(() => () => ({ custom: true }))

  expect(System({})).toEqual({ custom: true })
  expect(System({ value: 0 })).toEqual({ custom: true })
})

it('attaches defaults to a system', () => {
  const System = createSystem().with({ common: true })
  const SystemA = System.with({ a: true })
  const SystemB = System.with({ b: true })

  expect(System({})).toEqual({ common: true })
  expect(SystemA({})).toEqual({ common: true, a: true })
  expect(SystemB({})).toEqual({ common: true, b: true })
})

it('attaches a moulinette to a system', () => {
  const System = createSystem().with(({ input, ...props }) => ({
    ...props,
    output: input
  }))

  expect(System({})).toEqual({})
  expect(System({ regular: true })).toEqual({ regular: true })
  expect(System({ input: 'test' })).toEqual({ output: 'test' })

  expect(System({ input: 'test', regular: true })).toEqual({
    output: 'test',
    regular: true
  })
})
