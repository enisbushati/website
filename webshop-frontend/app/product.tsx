"use client";
import React, { useState } from "react";
export default function AddProduct() {
    const [name,setName] = useState("");
    const [category,setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [image,setImage] = useState<File | null>(null);
    const [mesaage,setMessage] = useState("");

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
            setMessage(" Failed to save product");
        }

        
    }
}