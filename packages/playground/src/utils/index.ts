export const sleep = (time: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve()
    }, time)
  })
}
