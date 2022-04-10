export default (file: MaybeRef<File>) => {
  return asyncComputed(async () => {
    return new Uint8Array(await get(file).arrayBuffer())
  }, new Uint8Array())
}

