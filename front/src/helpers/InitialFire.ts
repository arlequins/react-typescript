class Common {
  init(array: number[]): void {
    array.map((v) => {
      console.log(v + 1000);
    })
  }
}

export const InitialFire = new Common()
