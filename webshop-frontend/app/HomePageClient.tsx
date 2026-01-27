
"use client";
import { addToCart } from "./lib/cartApi";
import { ShoppingCart, Heart, User, Search } from "lucide-react";
import { useEffect, useState } from "react";

type Product = {
    id: number;
    name: string;
    category: string;
    price: number;
    imageUrl?: string;
};
type BasketItem = Product & { quantity: number };

type CartItem = Product & {
    quantity: number;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

function buildImageSrc(imageUrl?: string) {
  if (!imageUrl) return "";

  // absolute URL from backend
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return encodeURI(imageUrl);
  }

  // backend returns path like /uploads/abc.png
  if (imageUrl.startsWith("/uploads/")) {
    return `${API_BASE}${encodeURI(imageUrl)}`;
  }

  // other absolute paths
  if (imageUrl.startsWith("/")) {
    return `${API_BASE}${encodeURI(imageUrl)}`;
  }

  // backend returns only filename like abc.png
  return `${API_BASE}/uploads/${encodeURIComponent(imageUrl)}`;
}

function getImageFileName(imageUrl?: string) {
    if (!imageUrl) return "";
    const clean = imageUrl.split("?")[0];
    const parts = clean.split("/");
    return decodeURIComponent(parts[parts.length - 1] || "");
}

function ProductCard({ p, onAdd }: { p: Product; onAdd: (p: Product) => void }) {
    const [imageFailed, setImageFailed] = useState(false);
    const imgSrc = buildImageSrc(p.imageUrl);
    const fileName = getImageFileName(p.imageUrl);

    return (
        <div
            style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                width: "220px",
            }}
        >
            {/* Fixed-size image box */}
            <div
                style={{
                    width: "200px",
                    height: "200px",
                    border: "1px solid #ddd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "10px",
                    background: "#fafafa",
                    overflow: "hidden",
                }}
            >
                {p.imageUrl && !imageFailed ? (
                    <img
                        src={imgSrc}
                        alt={p.name}
                        onError={() => setImageFailed(true)}
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                        }}
                    />
                ) : (
                    <div style={{ textAlign: "center", color: "#888", fontSize: "13px" }}>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        <div>{p.price} €</div>
                        {fileName && (
                            <div style={{ fontSize: "11px", marginTop: "6px" }}>{fileName}</div>
                        )}
                    </div>
                )}
            </div>

            <h3 style={{ margin: "6px 0" }}>{p.name}</h3>
            <p style={{ margin: "0 0 6px 0", opacity: 0.85 }}>{p.category}</p>
            <strong>{p.price} €</strong>
            <br />
            <button
        onClick={() => onAdd(p)}
        style={{
        marginTop: "10px",
        width: "100%",
        padding: "12px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "10px",
        fontWeight: "bold",
        fontSize: "15px",
      cursor: "pointer",
  }}
>
  

                Add to basket
            </button>
        </div>
    );
}

export default function HomePageClient() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${API_BASE}/products`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch products");
                return res.json();
            })
            .then((data: Product[]) => setProducts(data))
            .catch((err) => setError(err.message));
    }, []);

    function addToCart(product: Product) {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    }

    function removeFromCart(productId: number) {
        setCartItems((prev) => prev.filter((item) => item.id !== productId));
    }

    function updateQuantity(productId: number, quantity: number) {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    }

    function clearCart() {
        setCartItems([]);
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.19; // 19% VAT
    const total = subtotal + tax;

    if (error) return <h1>❌ {error}</h1>;

    return (
        <main style={{ display: "flex", gap: "40px", padding: "20px" }}>
            {/* Products */}
            <div style={{ flex: 2 }}>
                <h1>Products</h1>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                    {products.map((p) => (
                        <ProductCard key={p.id} p={p} onAdd={addToCart} />
                    ))}
                </div>
            </div>

            {/* Cart */}
            <div style={{ flex: 1 }}>
                <div
                    style={{
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        padding: "24px",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                    }}
                >
                    <h2 style={{ margin: "0 0 20px 0", fontSize: "20px", fontWeight: 600 }}>
                        🛒 Shopping Cart
                    </h2>

                    {cartItems.length === 0 ? (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "40px 20px",
                                color: "#666",
                            }}
                        >
                            <p style={{ margin: 0, fontSize: "16px" }}>Your cart is empty</p>
                            <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#999" }}>
                                Add items to get started
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Cart Items */}
                            <div style={{ maxHeight: "400px", overflowY: "auto", marginBottom: "20px" }}>
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "16px",
                                            borderBottom: "1px solid #f0f0f0",
                                            gap: "16px",
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: 500 }}>
                                                {item.name}
                                            </h4>
                                            <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
                                                {item.category}
                                            </p>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                background: "#f5f5f5",
                                                borderRadius: "6px",
                                                padding: "4px",
                                            }}
                                        >
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    width: "28px",
                                                    height: "28px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "16px",
                                                    color: "#666",
                                                }}
                                                title="Decrease quantity"
                                            >
                                                −
                                            </button>
                                            <span
                                                style={{
                                                    minWidth: "24px",
                                                    textAlign: "center",
                                                    fontSize: "14px",
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    width: "28px",
                                                    height: "28px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "16px",
                                                    color: "#666",
                                                }}
                                                title="Increase quantity"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <div style={{ minWidth: "70px", textAlign: "right" }}>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: "15px",
                                                    fontWeight: 600,
                                                    color: "#1f2937",
                                                }}
                                            >
                                                {(item.price * item.quantity).toFixed(2)} €
                                            </p>
                                            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#999" }}>
                                                {item.price.toFixed(2)} € each
                                            </p>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                color: "#dc2626",
                                                fontSize: "20px",
                                                padding: "8px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                            title="Remove from cart"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Price Breakdown */}
                            <div
                                style={{
                                    borderTop: "2px solid #e5e7eb",
                                    paddingTop: "16px",
                                    marginBottom: "20px",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: "8px",
                                        fontSize: "14px",
                                    }}
                                >
                                    <span style={{ color: "#666" }}>Subtotal</span>
                                    <span style={{ fontWeight: 500 }}>{subtotal.toFixed(2)} €</span>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: "12px",
                                        fontSize: "14px",
                                    }}
                                >
                                    <span style={{ color: "#666" }}>Tax (19%)</span>
                                    <span style={{ fontWeight: 500 }}>{tax.toFixed(2)} €</span>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontSize: "18px",
                                        fontWeight: 700,
                                        color: "#1f2937",
                                        paddingTop: "8px",
                                        borderTop: "1px solid #e5e7eb",
                                    }}
                                >
                                    <span>Total</span>
                                    <span>{total.toFixed(2)} €</span>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                                <button
                                    style={{
                                        background: "#2563eb",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "8px",
                                        padding: "12px 16px",
                                        fontSize: "16px",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        transition: "background 0.2s",
                                    }}
                                    onMouseOver={(e) =>
                                        (e.currentTarget.style.background = "#1d4ed8")
                                    }
                                    onMouseOut={(e) =>
                                        (e.currentTarget.style.background = "#2563eb")
                                    }
                                    onClick={() => alert("Proceeding to checkout...")}
                                >
                                    Proceed to Checkout
                                </button>
                                <button
                                    style={{
                                        background: "none",
                                        color: "#dc2626",
                                        border: "1px solid #fecaca",
                                        borderRadius: "8px",
                                        padding: "12px 16px",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = "#fee2e2";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = "none";
                                    }}
                                    onClick={clearCart}
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Icons */}
            <div style={{ position: "absolute", top: 20, right: 20, display: "flex", gap: "16px" }}>
                <Search size={20} />
                <Heart size={20} />
                <User size={20} />
                <ShoppingCart size={20} />
            </div>
        </main>
    );
}
