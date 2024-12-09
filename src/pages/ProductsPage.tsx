import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  loadProducts,
  toggleLike,
  deleteProduct,
} from '../store/productsSlice';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

const ProductsPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { items, favorites, status } = useSelector(
    (state: RootState) => state.products
  );

  const [showFavorites, setShowFavorites] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadProducts());
    }
  }, [status, dispatch]);

  const filteredProducts = items
    .filter((item) => (showFavorites ? favorites.includes(item.id) : true))
    .filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div className="products-page">
      <h1>Products</h1>
      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="filter-buttons">
          <button
            onClick={() => setShowFavorites(false)}
            className={`filter-button ${!showFavorites ? 'active' : ''}`}>
            All Products
          </button>
          <button
            onClick={() => setShowFavorites(true)}
            className={`filter-button ${showFavorites ? 'active' : ''}`}>
            Favorites
          </button>
        </div>
      </div>

      <div className="product-grid">
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={favorites.includes(product.id)}
            onLike={(id) => dispatch(toggleLike(id))}
            onDelete={(id) => handleDelete(id)}
            onClick={(id) => {
              window.location.href = `/product/${id}`;
            }}
          />
        ))}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`pagination-button ${
              currentPage === index + 1 ? 'active' : ''
            }`}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
