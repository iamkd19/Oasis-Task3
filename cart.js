const express = require('express');
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
const cart = express.Router();
const User=require('../../models/User.js');

cart.use(bodyParser.json());

cart.get('/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // const cartProducts = user.cart.map(item => {
        //     return {
        //         productId: item.product,
        //         quantity: item.quantity,
        //     };
        // });

        // res.status(200).json(cartProducts);
        const cartProducts=user.cart;
        res.status(200).json(cartProducts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


cart.put('/:id', async (req, res) => {
    const { productId, pname, price } = req.body;

    const userId = req.params.id;
    
    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const productExists = user.cart.some(product => product._id.toString() === productId);
        console.log(productExists);
        if (productExists) {
            return res.status(200).json({ status: "ok", message: 'Product is already exists in Cart' });
        }

        user.cart.push({ _id: productId, name: pname, quantity: 1, price: price });
        await user.save();
        console.log("Product is added to cart successfully.");
        res.status(200).json({ status: "ok", message: 'Product is added to cart successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

cart.put('/:id/update/:productId/:newQuantity', async (req, res) => {
    try {
        const id = req.params.id;
        const productId = req.params.productId;
        const newQuantity = req.params.newQuantity;
    
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid productId' });
        }
        
        const cartItem = user.cart.find(item => item._id.toString() === productId);
    
        if (!cartItem) {
            return res.status(404).json({ error: 'Product not found in user\'s cart' });
        }
        cartItem.quantity = newQuantity > 0 ? newQuantity : 1;
        await user.save();
        const updatedCart=user.cart;
        console.log(updatedCart);
        res.status(200).json(updatedCart);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

cart.delete('/:userId/remove/:productId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const productId = req.params.productId;
    
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid productId' });
        }
    
        // const index = user.cart.findIndex(item => item.product.toString() === productId);
        const index = user.cart.findIndex(item => item._id.toString() === productId);
        if (index === -1) {
            return res.status(404).json({ error: 'Product not found in user\'s cart' });
        }
    
        user.cart.splice(index, 1);
        await user.save();
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports=cart;