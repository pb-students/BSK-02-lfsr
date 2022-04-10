test('with starting state', async () => {
  const lfsr = useLFSR('1 + x + x ** 4', 0b0110)

  // TODO: Add last bit
  const byte = [...Array(8)].map(() => lfsr.next().value)

  expect(byte).toEqual([0, 1, 1, 0, 0, 1, 0, 0])
})
