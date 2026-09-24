const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    const { search, category, sort, minPrice, maxPrice } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) {
      query.category = category;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let productsQuery = Product.find(query);

    if (sort === 'price-asc') productsQuery = productsQuery.sort('price');
    else if (sort === 'price-desc') productsQuery = productsQuery.sort('-price');
    else if (sort === 'name') productsQuery = productsQuery.sort('name');
    else if (sort === 'newest') productsQuery = productsQuery.sort('-createdAt');

    const products = await productsQuery;
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    next(error);
  }
});

router.post('/', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const { name, description, price, stock, category, images } = req.body;
    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const product = new Product({
      name,
      description,
      price,
      stock: stock || 0,
      category,
      
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
