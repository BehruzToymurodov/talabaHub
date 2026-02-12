export async function withLatency<T>(fn: () => T, ms = 450) {
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(fn());
      } catch (error) {
        reject(error);
      }
    }, ms);
  });
}
