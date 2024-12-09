import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { loadProducts } from '../store/productsSlice';
import './ProductDetailsPage.css';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { items, status } = useSelector((state: RootState) => state.products);

  const product = items.find((item) => item.id === parseInt(id || '0'));

  useEffect(() => {
    if (!product && status === 'idle') {
      dispatch(loadProducts() as any);
    }
  }, [product, status, dispatch]);

  if (status === 'loading' || (!product && status === 'idle')) {
    return <div className="loading">Loading...</div>;
  }

  if (!product && status === 'succeeded') {
    return (
      <div className="product-details">
        <h2>Product Not Found</h2>
        <button onClick={() => navigate('/')} className="back-link">
          ← Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-details">
      <button onClick={() => navigate('/')} className="back-link">
        ← Back to Products
      </button>
      <div className="product-details-content">
        <img
          src={product?.image}
          alt={product?.title}
          className="product-image"
        />
        <div className="product-details-info">
          <h1>{product?.title}</h1>
          <p>{product?.description}</p>
          <p>
            <strong>Price:</strong> ${product?.price.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
