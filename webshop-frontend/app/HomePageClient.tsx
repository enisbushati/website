
"use client";

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

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
function buildImageSrc(imageUrl?: string) {
  if (!imageUrl) return "";

  // absolute URL from backend
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return encodeURI(imageUrl);
  }

  // backend returns path like /uploads/abc.png
  if (imageUrl.startsWith("/uploads/")) {
    return `${API_BASE}/api${encodeURI(imageUrl)}`;
  }

  // other absolute paths
  if (imageUrl.startsWith("/")) {
    return `${API_BASE}${encodeURI(imageUrl)}`;
  }

  // backend returns only filename like abc.png
  return `${API_BASE}/api/uploads/${encodeURIComponent(imageUrl)}`;
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
    const [basket, setBasket] = useState<BasketItem[]>([]);
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

    function addToBasket(product: Product) {
  setBasket((prev) => {
    const found = prev.find((p) => p.id === product.id);

    if (found) {
      return prev.map((p) =>
        p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
      );
    }

    return [...prev, { ...product, quantity: 1 }];
  });
}


    function increaseQty(id: number) {
  setBasket((prev) =>
    prev.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    )
  );
}

function decreaseQty(id: number) {
  setBasket((prev) =>
    prev
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0)
  );
}
const [pressed, setPressed] = useState<string | null>(null);

function press(key: string) {
  setPressed(key);
  window.setTimeout(() => setPressed(null), 120);
}



    if (error) return <h1>❌ {error}</h1>;

    return (
        <main style={{ display: "flex", gap: "40px", padding: "20px" }}>
            {/* Products */}
            <div style={{ flex: 2 }}>
                <h1>Products</h1>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                    {products.map((p) => (
                        <ProductCard key={p.id} p={p} onAdd={addToBasket} />
                    ))}
                </div>
            </div>

            {/* Basket */}
            <div
                style={{
                    flex: 1,
                    borderLeft: "2px solid #ddd",
                    paddingLeft: "20px",
                }}
            >
                <h2>🛒 Basket</h2>

                {basket.length === 0 && <p>Basket is empty</p>}
{basket.map((item) => (
  <div
    key={item.id}
    style={{
      display: "flex",
      alignItems: "center",
      marginBottom: "8px",
    }}
  >
    {/* LEFT side: text takes full width so buttons align */}
    <span style={{ minWidth: "240px" }}>
      {item.name} – {item.price} € x {item.quantity}
    </span>

    {/* RIGHT side: fixed button area */}
    <div
      style={{
        display: "flex",
        gap: "6px",
        marginLeft: "12px", // ✅ moves buttons a bit to the RIGHT
      }}
    >
      <button
  onClick={() => {
    increaseQty(item.id);
    press(`plus-${item.id}`);
  }}
  style={{
    width: "26px",
    height: "26px",
    border: "1px solid #999",
    background: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    borderRadius: "4px",
    transition: "transform 120ms ease, background 120ms ease",
    transform: pressed === `plus-${item.id}` ? "scale(0.92)" : "scale(1)",
    backgroundColor: pressed === `plus-${item.id}` ? "#f2f2f2" : "#fff",
  }}
>
  +
</button>
      <button
  onClick={() => {
    decreaseQty(item.id);
    press(`minus-${item.id}`);
  }}
  style={{
    width: "26px",
    height: "26px",
    border: "1px solid #999",
    background: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    borderRadius: "4px",
    transition: "transform 120ms ease, background 120ms ease",
    transform: pressed === `minus-${item.id}` ? "scale(0.92)" : "scale(1)",
    backgroundColor: pressed === `minus-${item.id}` ? "#f2f2f2" : "#fff",
  }}
>
  −
</button>
    </div>
  </div>
))}


                {basket.length > 0 && (
                    <>
                        <hr />
                        <strong>Total: {basket.reduce((sum, item) => sum + item.price * item.quantity, 0)} €</strong>
                    </>
                )}
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
