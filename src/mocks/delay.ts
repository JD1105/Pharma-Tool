export function delay(min = 300, max = 600): Promise<void> {
  const duration = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise((resolve) => setTimeout(resolve, duration))
}
