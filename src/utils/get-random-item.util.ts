/**
 * @template T
 *
 * @param {T[]} array
 * @returns {T} - random item from array
 * */
export function getRandomItem<T>(array: T[]): T {
  const index = Math.floor(Math.random() * array.length);

  return array[index] as T;
}
