import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { loadProducts, updateProduct } from '../store/productsSlice';
import './EditProductPage.css';

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { items, status, error } = useSelector(
    (state: RootState) => state.products
  );

  const product = items.find((item) => item.id === parseInt(id || '0'));

  const [title, setTitle] = useState(product?.title || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price.toString() || '');
  const [image, setImage] = useState(product?.image || '');

  useEffect(() => {
    if (!product && status === 'idle') {
      dispatch(loadProducts() as any);
    }
  }, [product, status, dispatch]);

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setDescription(product.description);
      setPrice(product.price.toString());
      setImage(product.image);
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (product) {
      dispatch(
        updateProduct({
          id: product.id,
          title,
          description,
          price: parseFloat(price),
          image,
          liked: product.liked,
        })
      );
      navigate(`/product/${product.id}`);
    }
  };

  if (status === 'loading') {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Products
        </button>
      </div>
    );
  }

  if (!product && status === 'succeeded') {
    return (
      <div className="not-found">
        <h2>Product Not Found</h2>
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="edit-product">
      <h1>Edit Product</h1>
      <form onSubmit={handleSubmit} className="edit-product-form">
        <div className="form-group">
          <label>Title:</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Image URL:</label>
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="save-button">
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
