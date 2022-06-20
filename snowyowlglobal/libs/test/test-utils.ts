export function waitForTrue(test: () => Promise<boolean>, timer = 250): Promise<void> {

  return new Promise(resolve => {
    test().then(answer => {
      if (answer) {
        resolve();
      }
      else {
        setTimeout(() => {
          waitForTrue(test, timer).then(() => resolve());
        }, timer)
      }
    })
  });
}

export function timerPromise(time: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => resolve(), time);
  })
}
