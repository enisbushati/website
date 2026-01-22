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

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

function buildImageSrc(imageUrl?: string) {
    if (!imageUrl) return "";

    // absolute URL from backend
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        return encodeURI(imageUrl);
    }

    // backend returns full path like /uploads/abc.png
    if (imageUrl.startsWith("/")) {
        return `${API_BASE}${encodeURI(imageUrl)}`;
    }

    // backend returns only filename like abc.png -> assume /uploads/
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
            <button onClick={() => onAdd(p)} style={{ marginTop: "8px" }}>
                Add to basket
            </button>
        </div>
    );
}

export default function HomePageClient() {
    const [products, setProducts] = useState<Product[]>([]);
    const [basket, setBasket] = useState<Product[]>([]);
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
        setBasket((prev) => [...prev, product]);
    }

    function removeFromBasket(index: number) {
        setBasket((prev) => prev.filter((_, i) => i !== index));
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
                {basket.map((item, index) => (
                    <div key={index} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span>
                            {item.name} – {item.price} €
                        </span>
                        <button
                            onClick={() => removeFromBasket(index)}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "12px",
                                padding: 0,
                            }}
                            aria-label="Remove from basket"
                        >
                            x
                        </button>
                    </div>
                ))}

                {basket.length > 0 && (
                    <>
                        <hr />
                        <strong>Total: {basket.reduce((sum, item) => sum + item.price, 0)} €</strong>
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
