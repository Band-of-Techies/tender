"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FiRefreshCcw } from 'react-icons/fi'; // Import refresh icon
import LoadingSpinner from "@/app/components/LoadingSpinner";

type Product = {
    _id: string;
    productName: string;
    amountAvailable: number;
    cost: number; // cost is in cents
};

export default function BuyProductPage({
    params,
}: {
    params: { id: string };
}) {
    const [product, setProduct] = useState<Product | null>(null);
    const [totalCents, setTotalCents] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [deposit, setDeposit] = useState<number>(0);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [purchaseDetails, setPurchaseDetails] = useState<{ totalSpent: number; purchasedProducts: string; change: string } | null>(null);
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);


    const fetchProduct = async () => {
        try {
            const { data } = await axios.get(`/api/products/${params.id}`);
            if (data.amountAvailable > 0) {
                setProduct(data);
            } else {
                toast.error("This product is out of stock.");
                setError("Product out of stock");
            }
        } catch (error) {
            setError("Error fetching product details");
            toast.error("Failed to fetch product details.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchProduct();
        getUserDetails();
    }, [params.id]);

    const getUserDetails = async () => {
        try {
            const res = await axios.get('/api/users/userinfo');
            const userDeposit = res.data.data.deposit || 0;
            setDeposit(userDeposit);
            setTotalCents(userDeposit);
        } catch (error) {
            console.log('Error fetching user details:', error);
        }
    };

    const addMoney = (amount: number) => {
        setTotalCents((prevTotal) => prevTotal + amount);
    };

    const increaseQuantity = () => {
        if (product && quantity < product.amountAvailable) {
            setQuantity((prevQuantity) => prevQuantity + 1);
        } else {
            toast.error("Not enough stock available.");
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((prevQuantity) => prevQuantity - 1);
        }
    };

    const handlePurchase = async () => {
        if (!product) {
            toast.error("Product not available");
            return;
        }

        const totalPrice = product.cost * quantity;

        if (totalCents < totalPrice) {
            toast.error("Insufficient funds");
            return;
        }

        setButtonDisabled(true); // Disable buttons to prevent double-clicks

        try {
            const response = await axios.post('/api/buy', {
                productId: product._id,
                amount: quantity,
            });

            const { totalSpent, purchasedProducts, change } = response.data;

            setPurchaseDetails({ totalSpent, purchasedProducts: purchasedProducts.amount + "x " + product.productName, change: change.join(', ') });
            setTotalCents((prevTotal) => prevTotal - totalSpent);
            setQuantity(1);
            fetchProduct();
            setModalOpen(true);
        } catch (error) {
            toast.error("Failed to make the purchase.");
        } finally {
            setButtonDisabled(false); // Re-enable buttons
        }
    };

    const handleResetDeposit = async () => {
        setButtonDisabled(true); // Disable buttons to prevent double-clicks
        try {
            const res = await axios.post('/api/reset');
            if (res.status === 200) {
                setTotalCents(0);
                toast.success("Deposit reset successfully!");
                getUserDetails();
            }
        } catch (error) {
            toast.error("Failed to reset deposit.");
        } finally {
            setButtonDisabled(false); // Re-enable buttons
        }
    };

    const handleAddDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        setButtonDisabled(true); // Disable buttons to prevent double-clicks
        try {
            const res = await fetch(`/api/deposit`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ deposit: totalCents }),
            });

            if (res.ok) {
                toast.success("Deposit updated successfully!");
                getUserDetails();
            } else {
                toast.error("Failed to update deposit.");
            }
        } catch (error) {
            toast.error("Failed to update deposit.");
        } finally {
            setButtonDisabled(false); // Re-enable buttons
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setPurchaseDetails(null);
    };

    const refreshDeposit = () => {
        setTotalCents(deposit);
    };

    if (loading) return <div><LoadingSpinner/></div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Toaster position="top-right" />
            <div className="w-4/5 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 text-black">Selected Product</h2>
                    <div className="p-4 border border-gray-400 rounded-lg text-black">
                        <p className="text-lg text-black">{product?.productName || "Unknown Product"}</p>
                        <p>Price per unit: {product?.cost} cents</p>
                        <p>Stock: {product?.amountAvailable} available</p>
                    </div>

                    <div className="mt-4">
                        <label className="block text-black text-sm font-bold mb-2">Quantity</label>
                        <div className="flex items-center space-x-4 border-gray-700 rounded-lg">
                            <button
                                onClick={decreaseQuantity}
                                className="p-2 bg-gray-400 rounded-lg text-white"
                                disabled={quantity <= 1}
                            >
                                -
                            </button>
                            <span className="text-lg text-black">{quantity}</span>
                            <button
                                onClick={increaseQuantity}
                                className="p-2 bg-gray-400 rounded-lg"
                                disabled={!!(product && quantity >= product.amountAvailable)}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="text-lg font-bold text-black">Total Price: {product ? (product.cost * quantity) : 0} cents</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 text-black">Vending Machine</h2>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Total Cents In</label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                readOnly
                                value={totalCents}
                                className="w-full p-2 border border-gray-700 text-black rounded-lg"
                            />
                            <button onClick={refreshDeposit} className="ml-2 p-2 text-gray-600">
                                <FiRefreshCcw size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <button onClick={() => addMoney(5)} className="bg-white text-black border-2 border-black p-2 rounded-lg" disabled={buttonDisabled}>Add 5 Cents</button>
                        <button onClick={() => addMoney(10)} className="bg-white text-black border-2 border-black p-2 rounded-lg" disabled={buttonDisabled}>Add 10 Cents</button>
                        <button onClick={() => addMoney(20)} className="bg-white text-black border-2 border-black p-2 rounded-lg" disabled={buttonDisabled}>Add 20 Cents</button>
                        <button onClick={() => addMoney(50)} className="bg-white text-black border-2 border-black p-2 rounded-lg" disabled={buttonDisabled}>Add 50 Cents</button>
                        <button onClick={() => addMoney(100)} className="bg-white text-black border-2 border-black col-span-2 rounded-lg" disabled={buttonDisabled}>Add 100 Cents</button>
                    </div>

                    <div className="mb-4">
                        <button
                            onClick={handleAddDeposit}
                            className={`w-full p-2 bg-blue-500 text-white rounded-lg ${buttonDisabled ? "opacity-50" : ""}`}
                            disabled={buttonDisabled}
                        >
                            Add Deposit
                        </button>
                    </div>



                    <div className="mb-4">
                        <button
                            onClick={handlePurchase}
                            className={`w-full p-2 bg-green-500 text-white rounded-lg ${buttonDisabled ? "opacity-50" : ""}`}
                            disabled={buttonDisabled}
                        >
                            Buy
                        </button>

                    </div>
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black text-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96 h-72"> 
                        <h3 className="text-xl font-bold mb-4">Purchase Successful!</h3>
                        <p>Total Spent: {purchaseDetails?.totalSpent} cents</p>
                        <p>Purchased: {purchaseDetails?.purchasedProducts}</p>
                        <p>Change: {purchaseDetails?.change}</p>
                        <div className="mt-4 flex space-x-2">
                            <button
                                onClick={closeModal}
                                className="bg-blue-500 text-white p-2 rounded-lg flex-1" 
                            >
                                Close
                            </button>
                            <button
                                onClick={handleResetDeposit}
                                className={`bg-red-500 text-white p-2 rounded-lg flex-1 ${buttonDisabled ? "opacity-50" : ""}`}
                                disabled={buttonDisabled}
                            >
                                Reset Deposit
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
