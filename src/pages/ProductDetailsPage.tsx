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

  const product = items.find((item) => item.id === Number(id));

  useEffect(() => {
    if (!product && status === 'idle') {
      dispatch(loadProducts());
    }
  }, [product, status, dispatch]);

  console.log({ id, product, items, status });

  if (status === 'loading' || (!product && status === 'idle')) {
    return <div className="loading">Loading product details...</div>;
  }

  if (status === 'failed') {
    return (
      <div className="error">
        <h2>Error Loading Product</h2>
        <button onClick={() => navigate('/')} className="back-link">
          ← Back to Products
        </button>
      </div>
    );
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
            <strong>Price:</strong> ${product?.price?.toFixed(2) || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
