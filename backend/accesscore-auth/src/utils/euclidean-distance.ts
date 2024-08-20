export const euclideanDistance = (arr1: Float32Array, arr2: Float32Array): number => {
  return Math.sqrt(arr1.reduce((sum, value, i) => sum + Math.pow(value - arr2[i], 2), 0));
}