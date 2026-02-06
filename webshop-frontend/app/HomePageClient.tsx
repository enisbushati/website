"use client";

import { ShoppingCart, Heart, User, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
};

type CartItem = Product & { quantity: number };

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

function buildImageSrc(imageUrl?: string) {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return encodeURI(imageUrl);
  if (imageUrl.startsWith("/uploads/")) return `${API_BASE}${encodeURI(imageUrl)}`;
  if (imageUrl.startsWith("/")) return `${API_BASE}${encodeURI(imageUrl)}`;
  return `${API_BASE}/uploads/${encodeURIComponent(imageUrl)}`;
}

function getImageFileName(imageUrl?: string) {
  if (!imageUrl) return "";
  const clean = imageUrl.split("?")[0];
  const parts = clean.split("/");
  return decodeURIComponent(parts[parts.length - 1] || "");
}

function ProductCard({
  p,
  onAdd,
  isLiked,
  onToggleLike,
}: {
  p: Product;
  onAdd: (p: Product) => void;
  isLiked: boolean;
  onToggleLike: (productId: number) => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const imgSrc = buildImageSrc(p.imageUrl);
  const fileName = getImageFileName(p.imageUrl);

  return (
    <div
      style={{
        border: "1px solid #e0a5a5",
        padding: "10px",
        marginBottom: "10px",
        width: "160px",
        textAlign: "center",
        borderRadius: "12px",
      }}
    >
      <div
        style={{
          width: "110px",
          height: "110px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 10px auto",
          background: "#ffffff",
          overflow: "hidden",
          borderRadius: "10px",
          position: "relative",
        }}
      >
        <button
          onClick={() => onToggleLike(p.id)}
          aria-label={isLiked ? "Remove like" : "Like product"}
          title={isLiked ? "Unlike" : "Like"}
          style={{
            position: "absolute",
            top: "6px",
            right: "6px",
            width: "26px",
            height: "26px",
            borderRadius: "999px",
            border: "none",
            background: "rgba(255, 255, 255, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        >
          <Heart size={14} color={isLiked ? "#e11d48" : "#6b7280"} fill={isLiked ? "#e11d48" : "none"} />
        </button>
        {p.imageUrl && !imageFailed ? (
          <img
            src={imgSrc}
            alt={p.name}
            onError={() => setImageFailed(true)}
            style={{ maxWidth: "75%", maxHeight: "75%", objectFit: "contain" }}
          />
        ) : (
          <div style={{ textAlign: "center", color: "#888", fontSize: "12px" }}>
            <div style={{ fontWeight: 600 }}>{p.name}</div>
            <div>{p.price} kr</div>
            {fileName && <div style={{ fontSize: "10px", marginTop: "6px" }}>{fileName}</div>}
          </div>
        )}
      </div>

      <h3 style={{ margin: "6px 0", fontSize: "12px", fontWeight: 600 }}>{p.name}</h3>
      <p style={{ margin: "0 0 6px 0", opacity: 0.85, fontSize: "12px" }}>{p.category}</p>
      <strong style={{ fontSize: "13px" }}>{p.price} kr</strong>

      <button
        onClick={() => onAdd(p)}
        style={{
          marginTop: "8px",
          width: "100%",
          padding: "10px",
          backgroundColor: "#47aa8a",
          color: "white",
          border: "none",
          borderRadius: "20px",
          fontWeight: "bold",
          fontSize: "11px",
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
  const [query, setQuery] = useState("");
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());

  // Dynamic categories
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Fetch helpers
  const fetchAll = () => {
    setError("");
    fetch(`${API_BASE}/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data: Product[]) => setProducts(data))
      .catch((err) => setError(err.message));
  };

  const fetchByCategory = (category: string) => {
    setError("");
    fetch(`${API_BASE}/products/category/${encodeURIComponent(category)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data: Product[]) => setProducts(data))
      .catch((err) => setError(err.message));
  };

  const fetchCategories = () => {
    setError("");
    fetch(`${API_BASE}/products/categories`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data: string[]) => setCategories(data))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    fetchAll();
    fetchCategories();
  }, []);

  function addItemToCart(product: Product) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function removeFromCart(productId: number) {
    const confirmed = window.confirm("Are you sure you want to remove this item?");
    if (!confirmed) return;

    setCartItems((prev) => prev.filter((item) => item.id !== productId));
}


  function updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  function toggleLike(productId: number) {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  }

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [products, query]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filterBtnStyle = (active: boolean) =>
    ({
      padding: "10px 14px",
      borderRadius: "999px",
      border: "1px solid #3e5f6b",
      background: active ? "#4b8597" : "white",
      color: active ? "white" : "#123",
      cursor: "pointer",
      fontWeight: 700,
      fontSize: "12px",
    } as const);

  if (error) return <h1>X {error}</h1>;

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "14px",
      }}
    >
      {/* TOP BAR */}
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: "10px 12px",
          borderRadius: "10px",
          border: "1px solid #3e5f6b",
          background: "#78cce6",
        }}
      >
        <div style={{ color: "white", fontWeight: 700, fontSize: "18px" }}>Products</div>

        <div
          style={{
            flex: 1,
            maxWidth: "300px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#4b8597",
            border: "1px solid #78cce6",
            borderRadius: "999px",
            padding: "10px 10px",
          }}
        >
          <Search size={18} color="white" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              color: "white",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <Heart size={20} color="white" />
          <User size={20} color="white" />
          <ShoppingCart size={20} color="white" />
        </div>
      </div>

      {/* CATEGORY FILTER BUTTONS (dynamic) */}
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          style={filterBtnStyle(activeCategory === "All")}
          onClick={() => {
            setActiveCategory("All");
            fetchAll();
          }}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            style={filterBtnStyle(activeCategory === cat)}
            onClick={() => {
              setActiveCategory(cat);
              fetchByCategory(cat);
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PRODUCTS + CART LAYOUT */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "20px",
          maxWidth: "1400px",
        }}
      >
        {/* LEFT SPACER: balances the cart so products stay centered */}
        {cartItems.length > 0 && <div style={{ width: "400px" }} />}

        {/* PRODUCTS */}
        <div style={{ width: "100%", maxWidth: "1100px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px" }}>
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                p={p}
                onAdd={addItemToCart}
                isLiked={likedIds.has(p.id)}
                onToggleLike={toggleLike}
              />
            ))}
          </div>
        </div>

        {/* CART – shown on the right */}
        {cartItems.length > 0 && (
          <div style={{ width: "400px" }}>
            <div
              style={{
                background: "#1f2933",
                border: "1px solid #374151",
                borderRadius: "12px",
                padding: "14px",
                color: "#f9fafb",
              }}
            >
              <h2 style={{ margin: "0 0 20px 0", fontSize: "20px", fontWeight: 600 }}>
                🛒 Shopping Cart
              </h2>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                    borderBottom: "1px solid #374151",
                    gap: "16px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: 500 }}>
                      {item.name}
                    </h4>
                    <p style={{ margin: 0, fontSize: "13px", color: "#cbd5f5" }}>
                      {item.category}
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "8px",
                        border: "1px solid #374151",
                        background: "transparent",
                        color: "#f9fafb",
                        cursor: "pointer",
                      }}
                    >
                      −
                    </button>
                    <span style={{ minWidth: "18px", textAlign: "center" }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "8px",
                        border: "1px solid #374151",
                        background: "transparent",
                        color: "#f9fafb",
                        cursor: "pointer",
                      }}
                    >
                      +
                    </button>
                  </div>

                  <strong>{(item.price * item.quantity).toFixed(2)} kr</strong>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#f87171",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                    aria-label="Remove item"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <div style={{ marginTop: "16px", fontWeight: 700 }}>
                Total: {subtotal.toFixed(2)} kr
              </div>

              <button
                onClick={clearCart}
                style={{
                  marginTop: "12px",
                  width: "100%",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "1px solid #374151",
                  background: "transparent",
                  color: "#f9fafb",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
