class Common {
  init(array: number[]): void {
    array.map((v) => {
      // tslint:disable:no-console
      console.log(v + 1000)
    })
  }
}

export const InitialFire = new Common()
