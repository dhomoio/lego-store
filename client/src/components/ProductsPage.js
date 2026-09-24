import React, { useState, useEffect } from 'react';
import { SERVER_HOST } from '../config/global_constants';

export const ProductsPage = props => {
  const { addToCart, setErrorMessage } = props;

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${SERVER_HOST}/api/products`);
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setErrorMessage('Failed to load products');
    }
  };

  const filterProducts = () => {
    let filtered = [...products];
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    setFilteredProducts(filtered);
  };

  return (
    <div>
      <h2>Products</h2>
      <div className="af_searchFilter">
        <input placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="city">City</option>
          <option value="technic">Technic</option>
          <option value="starwars">Star Wars</option>
          <option value="harrypotter">Harry Potter</option>
          <option value="classic">Classic</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name</option>
        </select>
      </div>
      <div className="af_productsGrid">
        {filteredProducts.map(product => (
          <div key={product._id} className="af_productCard">
            <img src={product.images?.[0] ? (product.images[0].startsWith('data:') ? product.images[0] : `${SERVER_HOST}${product.images[0]}`) : 'https://via.placeholder.com/250x200/1a1a2e/e94560?text=Lego'} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="af_price">${product.price}</p>
            <p>Stock: {product.stock}</p>
            <button className="af_btn" onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};
