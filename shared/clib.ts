export const copyText = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
  } else {
    prompt('Copy to clipboard: Ctrl+C, Enter', text)
  }
}
