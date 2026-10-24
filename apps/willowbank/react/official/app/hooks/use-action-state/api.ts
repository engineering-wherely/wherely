export async function addToCart(count: number) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count: number) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return count - 1;
}
