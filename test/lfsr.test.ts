test('with starting state', async () => {
  const lfsr = useLFSR('1 + x + x ** 4', 0b0110)

  const byte = [...Array(8)].map(() => lfsr.next().value)
  expect(byte).toEqual([0, 1, 1, 0, 0, 1, 0, 0])
})

test('2bit-initial', async () => {
  const lfsr = useLFSR('1 + x + x ** 2', 0b10)

  const byte = [...Array(8)].map(() => lfsr.next().value)
  expect(byte).toEqual([0,1,1,0,1,1,0,1])
})
test('3bit-initial', async () => {
  const lfsr = useLFSR('1 + x + x ** 2', 0b101)

  const byte = [...Array(8)].map(() => lfsr.next().value)
  expect(byte).toEqual([1,0,1,1,0,1,1,0])
})


test('4bit-initial with 4 bits to XOR', async () => {
  const lfsr = useLFSR('1 + x + x ** 2 + x ** 3 + x ** 4', 0b1010)

  const byte = [...Array(8)].map(() => lfsr.next().value)
  expect(byte).toEqual([0,1,0,1,0,0,1,0])
})

test('4bit-initial with 3 bits to XOR', async () => {
  const lfsr = useLFSR('1 + x + x ** 2 + x ** 3 ', 0b1010)

  const byte = [...Array(8)].map(() => lfsr.next().value)
  expect(byte).toEqual([0,1,0,1,0,1,0,1])
})

test('5bit-initial with 4 bits to XOR', async () => {
  const lfsr = useLFSR('1 + x + x ** 2 + x ** 4 + x ** 5 ', 0b01010)

  const byte = [...Array(8)].map(() => lfsr.next().value)
  expect(byte).toEqual([0,1,0,1,0,0,1,0])
})

test('5bit-initial with 5 bits to XOR', async () => {
  const lfsr = useLFSR('1 + x + x ** 2 + x ** 3 + x ** 4 + x ** 5 ', 0b01010)

  const byte = [...Array(8)].map(() => lfsr.next().value)
  expect(byte).toEqual([0,1,0,1,0,0,0,1])
})

//errors

test('4bit-initial with 1 bit to XOR', async () => {
  try{
    useLFSR('1 + x', 0b1010)
  }
  catch(err){
    expect(err.message).toEqual('Invalid polynomial: Polynomial has to include at least 2 expressions with x')
  }
})

test('4bit-initial without constant 1 in polymonial', async () => {
  try{
    useLFSR('x + x ** 2 + x ** 3', 0b1010)
  }
  catch(err){
    expect(err.message).toEqual(`Invalid polynomial: Polynomial has to include a constant '1'`)
  }
})

test('invalid expression', async () => {
  try{
    useLFSR('1 + x + x ** 2  x ** 3', 0b1010)
  }
  catch(err){
    expect(err.message).toEqual(`Invalid expression: x ** 2  x ** 3`)
  }
})