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
  return api<Cart>("/cart");
}

export function addToCart(productId: number, quantity = 1) {
  return api<Cart>("/cart/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity }),
  });
}

export function removeFromCart(productId: number) {
  return api<Cart>(`/cart/items/${productId}`, {
    method: "DELETE",
  });
}

export function clearCart() {
  return api<Cart>("/cart", {
    method: "DELETE",
  });
}
