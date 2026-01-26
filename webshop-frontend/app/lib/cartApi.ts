import { api } from "./api";

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
  total: number;
};

export function getCart() {
  return api<Cart>("/api/cart");
}

export function addToCart(productId: number, quantity = 1) {
  return api<Cart>("/api/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export function removeFromCart(productId: number) {
  return api<Cart>(`/api/cart/items/${productId}`, { method: "DELETE" });
}

export function clearCart() {
  return api<Cart>("/api/cart", { method: "DELETE" });
}
