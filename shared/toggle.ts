import { ref } from 'vue'

export default (initialValue: boolean): [Ref<boolean>, (v: boolean) => void] => {
  const val = ref<boolean>(initialValue)
  const method = (newValue: boolean) => {
    val.value = newValue
  }
  return [val, method]
}
