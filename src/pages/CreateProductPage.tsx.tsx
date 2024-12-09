import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProduct } from '../store/productsSlice';
import { useNavigate } from 'react-router-dom';
import './CreateProductPage.css';

const CreateProductPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!title.trim()) {
      return 'Title is required!';
    }
    if (!description.trim()) {
      return 'Description is required!';
    }
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      return 'Price must be a valid number greater than 0!';
    }
    if (
      !image.trim() ||
      !/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(image)
    ) {
      return 'Image URL must be a valid URL ending in an image file extension (e.g., .jpg, .png)!';
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    dispatch(
      addProduct({
        id: Date.now(),
        title,
        description,
        price: parseFloat(price),
        image,
        liked: false,
      })
    );

    navigate('/');
  };

  return (
    <div className="create-product">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Products
      </button>
      <h1>Create New Product</h1>
      <form onSubmit={handleSubmit} className="create-product-form">
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
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
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="create-button">
            Create Product
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

export default CreateProductPage;
