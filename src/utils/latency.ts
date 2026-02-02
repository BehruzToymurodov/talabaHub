export async function withLatency<T>(fn: () => T, ms = 450) {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(fn()), ms);
  });
}
