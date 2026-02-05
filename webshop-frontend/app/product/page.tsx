"use client";
import React, { useState } from "react";
export default function AddProduct() {
    const [name,setName] = useState("");
    const [category,setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [image,setImage] = useState<File | null>(null);
    const [message,setMessage] = useState("");

    async function handleSubmit(e :React.FormEvent) {

        if (!image) {
            setMessage("Please select an image.");
            return;
        }

        const formData = new FormData();
        formData.append("name",name);
        formData.append("category", category);
        formData.append("price", price);
        formData.append("image", image);

        const response = await fetch("http://localhost:8080/products", {
            method: "POST",
            body: formData,
        });

        if (response.ok){
            setMessage(" Product saved successfully");
        }
        else{
            setMessage("Failed to save product");
        }
    }

    return(
        <form onSubmit={handleSubmit} >
            <div style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                width: "220px",
            }}>
                <h2>Add Product</h2>
            <input
                type="text"
                placeholder = "Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
              <input
                type="text"
                placeholder = "Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
            />

            <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                required
            />
            <button className="SaveButton" type="submit" style={{ marginTop: "8px" ,  border: "2px solid #4f46e5"}}>💾 Save Product</button>
            <p>{message}</p>
            </div>
        </form>
    );
}