
"use client"
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import toast from "react-hot-toast";

interface Product {
    _id: string;
    productName: string;
    amountAvailable: number;
    cost: number;
}

export default function ProductDetails({ params }: any) {

    const [product, setProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({ productName: "", amountAvailable: "", cost: "" });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Fetch product details by ID
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${params.id}`);
                if (!res.ok) throw new Error("Failed to fetch product");
                const data = await res.json();
                setProduct(data);
                setFormData({ productName: data.productName, amountAvailable: data.amountAvailable.toString(), cost: data.cost.toString() });
            } catch (error) {
                toast.error("Error fetching product details");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [params.id]);

    // Update product details
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/products/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success("Product updated successfully");
            } else {
                toast.error("Failed to update product");
            }
        } catch (error) {
            toast.error("Error while updating product");
        }
    };

    // Delete product
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await fetch(`/api/products/${params.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Product deleted successfully");
                router.push("/products"); // Redirect after deletion
            } else {
                toast.error("Failed to delete product");
            }
        } catch (error) {
            toast.error("Error while deleting product");
        }
    };

    if (loading) return <div><LoadingSpinner/></div>;


    return (
        <div className="max-w-2xl mx-auto bg-white p-8 shadow-md rounded my-12">
            <h1 className="text-2xl font-bold mb-6 text-black">Product Details</h1>

            {product ? (
                <>
                    {/* Product Information */}
                    <form onSubmit={handleUpdate}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-black">Product Name</label>
                            <input
                                type="text"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                                value={formData.productName}
                                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-black">Amount Available</label>
                            <input
                                type="number"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                                value={formData.amountAvailable}
                                onChange={(e) => setFormData({ ...formData, amountAvailable: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-black">Cost</label>
                            <input
                                type="number"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                                value={formData.cost}
                                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-between">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none"
                            >
                                Update Product
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none"
                            >
                                Delete Product
                            </button>
                        </div>
                    </form>
                </>
            ) : (
                <p>Product not found</p>
            )}
        </div>
    );
}