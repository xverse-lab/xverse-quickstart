export function toast(text: string) {
  ;(window as any)
    .Toastify({
      text,
      duration: 3000,
    })
    .showToast()
}
