<script setup lang="ts">
const ACTION_ENCRYPT = 0
const ACTION_DECRYPT = 1

const plaintext = refWithControl('')
const encrypted = refWithControl('')

const algs = [
  { name: 'Rail fence', meta: 3, ...useRailFence() },
  { name: 'Matrix (A)', meta: '3-1-4-2', ...useMatrixACipher() },
  { name: 'Columnar Transposition (B)', meta: 'CONVENIENCE', ...useColumnarTranspositionCipher() },
  { name: 'Write Row Read Column (C)', meta: 'CONVENIENCE', ...useMatrixCCipher() },
  { name: 'Caesar', meta: 3, ...useCaesarCipher() },
  { name: 'Vigenère', meta: 'BREAKBREAKBR', ...useVigenereCipher() },
]

const algorithmName = ref(algs[0].name)
const algorithm = computed(() => algs.find(({ name }) => name === algorithmName.value))

const lastAction = ref()
watch(encrypted, () => (lastAction.value = ACTION_DECRYPT))
watch(plaintext, () => (lastAction.value = ACTION_ENCRYPT))

const meta = ref(algs[0].meta)
watch(algorithmName, () => (meta.value = algorithm.value.meta))

const error = ref()
watchEffect(() => {
  const { encrypt, decrypt } = algorithm.value

  const k = isNaN(+meta.value)
    ? meta.value
    : +meta.value

  const fn = lastAction.value === ACTION_ENCRYPT
    ? encrypt
    : decrypt

  const source = lastAction.value === ACTION_ENCRYPT
    ? plaintext
    : encrypted

  const destination = lastAction.value === ACTION_ENCRYPT
    ? encrypted
    : plaintext

  try {
    destination.set(fn(source.value, k), false)
    error.value = undefined
  } catch (e) {
    console.log(e)
    destination.set('', false)
    error.value = 'The value of key / n is invalid'
  }
})
</script>

<template>
  <div class="h-full flex items-center justify-center flex-col">
    <div class="grid grid-cols-3 gap-x-4 gap-y-12 text-gray-700 font-sans text-sm bg-white p-8 rounded shadow-lg">
      <label>
        algorithm
        <select v-model="algorithmName" class="block mt-2">
          <option v-for="a of algs" :key="a.name">{{ a.name }}</option>
        </select>
      </label>
      <div />
      <label>
        key / n
        <input v-model="meta" placeholder="key / n" class="block mt-2">
      </label>
      <label>
        plaintext
        <input v-model="plaintext" @paste="lastAction = ACTION_ENCRYPT" placeholder="plaintext" class="block mt-2">
      </label>
      <div class="justify-center text-xs flex items-center">to / from</div>
      <label>
        encrypted
        <input v-model="encrypted" @paste="lastAction = ACTION_DECRYPT" placeholder="encrypted" class="block mt-2">
      </label>
    </div>
    <transition name="fade">
      <div v-if="error" class="absolute bottom-0 w-full left-0 h-64 overflow-hidden">
        <div class="bg-red-500 p-4 rounded-md text-white absolute bottom-4 left-1/2 transform -translate-x-1/2">{{ error }}</div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.15s cubic-bezier(1, 0.5, 0.8, 1);
}

.fade-enter-from,
.fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>