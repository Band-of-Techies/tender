"use client";

import { useState } from "react";
import toast from "react-hot-toast";


interface FormData {
  productName: string;
  amountAvailable: string;
  cost: string;
}

export default function AddProductForm() {
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    amountAvailable: "",
    cost: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    let errors: Partial<FormData> = {};

    if (!formData.productName.trim()) {
      errors.productName = "Product name is required";
    }
    if (!formData.amountAvailable || isNaN(Number(formData.amountAvailable))) {
      errors.amountAvailable = "Amount available must be a valid number";
    }
    if (!formData.cost || isNaN(Number(formData.cost))) {
      errors.cost = "Cost must be a valid number";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const result = await res.json();
        toast.success("Product added successfully!");
        setFormData({ productName: "", amountAvailable: "", cost: "" });
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to add product");
      }
    } catch (error) {
      toast.error("An error occurred while submitting");
    }
  };

  return (
<form
  onSubmit={handleSubmit}
  className="max-w-lg mx-auto p-4 bg-white shadow-md rounded my-8" 
>
  <div className="mb-4">
    <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
      Product Name
    </label>
    <input
      type="text"
      id="productName"
      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black" // Added text-black
      value={formData.productName}
      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
    />
    {errors.productName && <p className="text-red-600 text-sm">{errors.productName}</p>}
  </div>

  <div className="mb-4">
    <label htmlFor="amountAvailable" className="block text-sm font-medium text-gray-700">
      Amount Available
    </label>
    <input
      type="number"
      id="amountAvailable"
      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black" // Added text-black
      value={formData.amountAvailable}
      onChange={(e) => setFormData({ ...formData, amountAvailable: e.target.value })}
    />
    {errors.amountAvailable && <p className="text-red-600 text-sm">{errors.amountAvailable}</p>}
  </div>

  <div className="mb-4">
    <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
      Cost
    </label>
    <input
      type="number"
      id="cost"
      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black" // Added text-black
      value={formData.cost}
      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
    />
    {errors.cost && <p className="text-red-600 text-sm">{errors.cost}</p>}
  </div>

  <button
    type="submit"
    className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
  >
    Add Product
  </button>
</form>


  );
}
