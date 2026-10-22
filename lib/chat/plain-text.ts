/** Match whole-response removal of ** even when a pair spans two deltas. */
export function createBoldMarkerFilter() {
  let pendingStar = false
  return {
    push(chunk: string): string {
      let text = ""
      for (const character of chunk) {
        if (character === "*") {
          if (pendingStar) pendingStar = false
          else pendingStar = true
        } else {
          if (pendingStar) { text += "*"; pendingStar = false }
          text += character
        }
      }
      return text
    },
    finish(): string {
      const text = pendingStar ? "*" : ""
      pendingStar = false
      return text
    },
  }
}
