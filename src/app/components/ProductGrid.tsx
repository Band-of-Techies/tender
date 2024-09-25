'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Make sure to import useRouter

import LoadingSpinner from './LoadingSpinner';

const defaultImage = 'https://via.placeholder.com/150';

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [sellerId, setsellerId] = useState('');
  const router = useRouter(); // Initialize useRouter

  const buyRole = "buyer";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
        
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    getUserDetails();
  }, []);

 
  const getUserDetails = async () => {
    try {
      const res = await axios.get('/api/users/userinfo');
      setUserRole(res.data.data.roles);
      setsellerId(res.data.data._id);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log('An unknown error occurred');
      }
    }
  };



  const handleButtonClick = (product: any) => {
    if (product.amountAvailable === 0) {
      alert("This product is out of stock."); // Alert for out of stock
      return;
    }

    if (userRole === buyRole) {
      router.push(`/buyproduct/${product._id}`); // Navigate to buy product
    } else {

      if(product.sellerId ===sellerId)
      {
        router.push(`/productdetails/${product._id}`); // Navigate to product details
      }
      else
      {
        alert("You are not authorized to view this product");
      }
     
    }
  };

  if (loading) {
    return (
      <LoadingSpinner />
    )
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => {
            const isOutOfStock = product.amountAvailable === 0;
            const isLimitedStock = product.amountAvailable < 6;

            return (
              <div key={product._id} className="border rounded-lg overflow-hidden shadow-lg">

                <div className="relative aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 cursor-pointer"
                  onClick={() => handleButtonClick(product)}>
                  <img
                    alt="image"
                    src={defaultImage}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                  {isOutOfStock && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Out of Stock</span>
                  )}
                  {isLimitedStock && (
                    <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">Limited</span>
                  )}
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900 transition pl-4">
                  {product.productName}
                </h3>
                <p className="mt-1 text-lg font-bold text-gray-800 pl-4">
                  $ {product.cost}
                </p>

                <button
                  onClick={() => handleButtonClick(product)} // Add onClick handler
                  className={`mt-2 w-full text-sm py-2 rounded ${buyRole === userRole ? 'bg-indigo-600' : 'bg-red-600'
                    } text-white hover:${buyRole === userRole ? 'bg-indigo-700' : 'bg-red-700'
                    } transition duration-300 ease-in-out`}
                >
                  {buyRole === userRole ? 'Buy Now' : 'Show Details'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
