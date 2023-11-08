import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';

const Basket = () => {
    const id = useSelector((state) => state.user._id);
    const [cart, setCart] = useState([]);
    const [productDetails, setProductDetails] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        axios.get(`http://localhost:8082/add2cart/${id}`)
            .then(res => {
                setCart(res.data);
                // Fetch product details for each item in the cart
                res.data.forEach(item => {
                    axios.get(`http://localhost:8082/products/all/${item._id}`)
                        .then(response => {
                            // Update productDetails with the fetched details
                            setProductDetails(prevProductDetails => ({
                                ...prevProductDetails,
                                [item._id]: response.data,
                            }));
                        })
                        .catch(error => {
                            console.error('Failed to fetch product details:', error.message);
                        });
                });
            })
            .catch(error => {
                console.error('Failed to fetch cart products:', error.message);
            });
    }, [id,cart]);

    const removeFromCart = (productId) => {
        axios.delete(`http://localhost:8082/add2cart/${id}/remove/${productId}`)
            .then(response => {
                console.log("Remove successfully!");
                // Remove the item from cart and productDetails
                setCart(cart.filter(item => item._id !== productId));
                setProductDetails(prevProductDetails => {
                    const newProductDetails = { ...prevProductDetails };
                    delete newProductDetails[productId];
                    return newProductDetails;
                });
            })
            .catch(error => {
                console.error('Failed to remove the product from the cart:', error.message);
            });
    };

    const updateQuantity = async (productId, newQuantity) => {
        await axios.put(`http://localhost:8082/add2cart/${id}/update/${productId}/${newQuantity}`)
            .then(response => {
                const updatedCart = response.data.cart;
                setCart(updatedCart);
                console.log("Quantity Updated successfully!");
            })
            .catch(error => {
                console.error('Failed to update quantity:', error.message);
            });
    };

    // Calculate individual prices for each item
    const individualPrices = cart.map(item => {
        const product = productDetails[item._id];
        return product ? product.price * item.quantity : 0;
    });

    // Calculate the total price
    const calculatedTotalPrice = individualPrices.reduce((total, price) => total + price, 0);

    // Update the total price state
    useEffect(() => {
        setTotalPrice(calculatedTotalPrice);
    }, [calculatedTotalPrice]);

    if (!cart) {
        return <p>Loading...</p>;
    }

    if (cart.length === 0) {
        return <p>Your cart is empty.</p>;
    }

    return (
<div className="bg-white rounded p-4 shadow-md">
    <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
    <ul>
        {cart.map((item, i) => (
            <li key={i} className="border-b border-gray-300 py-2">
                <div className="flex items-center justify-between">
                    <div className="w-2/5">
                        <span>{productDetails[item._id]?.name || 'Product Name Not Found'}</span>
                    </div>
                    <div className="w-2/5 flex justify-center items-center space-x-2">
                        <button className="text-red-500" onClick={() => removeFromCart(item._id)}>
                            Remove
                        </button>
                        <div className="flex items-center">
                            <button
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                className="w-8 h-8 bg-gray-500 text-white text-lg font-bold cursor-pointer"
                            >
                                -
                            </button>
                            <span className="mx-2 text-xl">{item.quantity}</span>
                            <button
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className="w-8 h-8 bg-gray-500 text-white text-lg font-bold cursor-pointer"
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div className="w-1/5 text-right">
                        {/* <span>₹{(productDetails[item._id]?.price * item.quantity).toFixed(2)}</span> */}
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                </div>
            </li>
        ))}
    </ul>
    <div className="mt-4">
        <strong>Total Price: ₹{totalPrice.toFixed(2)}</strong>
    </div>
</div>

    );
};

export default Basket;
