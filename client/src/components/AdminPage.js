import React, { useState, useEffect } from 'react';
import { SERVER_HOST } from '../config/global_constants';

export const AdminPage = props => {
  const { setPage, setSuccessMessage, setErrorMessage } = props;

  const [products, setProducts] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock: '', category: 'city' });

  useEffect(() => {
    fetchProducts();
    fetchAdminUsers();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${SERVER_HOST}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setErrorMessage('Failed to load products');
    }
  };

  const fetchAdminUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${SERVER_HOST}/api/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setAdminUsers(data);
      } else {
        setAdminUsers([]);
        setErrorMessage(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      setAdminUsers([]);
      setErrorMessage('Error fetching users');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${SERVER_HOST}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMessage('Product added!');
        setNewProduct({ name: '', description: '', price: '', stock: '', category: 'city' });
        fetchProducts();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(data.error || 'Failed to add product');
      }
    } catch (err) {
      setErrorMessage('Error: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Delete this product?')) return;
    try {
      const res = await fetch(`${SERVER_HOST}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSuccessMessage('Product deleted!');
        fetchProducts();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage('Failed to delete product');
      }
    } catch (err) {
      setErrorMessage('Error: ' + err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Delete this user?')) return;
    try {
      const res = await fetch(`${SERVER_HOST}/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSuccessMessage('User deleted!');
        fetchAdminUsers();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage('Failed to delete user');
      }
    } catch (err) {
      setErrorMessage('Error: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button className="af_btn af_btnSecondary" onClick={() => setPage('home')}>Back to Store</button>

      <h3>Add Product</h3>
      <div className="af_searchFilter">
        <input placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
        <input placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
        <input placeholder="Price" type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
        <input placeholder="Stock" type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
        <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
          <option value="city">City</option>
          <option value="technic">Technic</option>
          <option value="starwars">Star Wars</option>
          <option value="harrypotter">Harry Potter</option>
          <option value="classic">Classic</option>
        </select>
        <button className="af_btn af_btnSuccess" onClick={handleAddProduct}>Add</button>
      </div>

      <h3>Products</h3>
      <div className="af_productsGrid">
        {products.map(p => (
          <div key={p._id} className="af_productCard">
            <h4>{p.name}</h4>
            <p>${p.price} | Stock: {p.stock}</p>
            <button className="af_btn af_btnDanger" onClick={() => handleDeleteProduct(p._id)}>Delete</button>
          </div>
        ))}
      </div>

      <h3>Users</h3>
      <table className="af_adminTable">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr>
        </thead>
        <tbody>
          {adminUsers.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button className="af_btn af_btnDanger" onClick={() => handleDeleteUser(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
