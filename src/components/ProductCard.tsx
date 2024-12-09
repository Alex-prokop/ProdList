import { Link } from 'react-router-dom';
import './ProductCard.css';

interface ProductCardProps {
  product: {
    id: number;
    title: string;
    description: string;
    image: string;
  };
  isFavorite: boolean;
  onLike: (id: number) => void;
  onDelete: (id: number) => void;
  onClick: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite,
  onLike,
  onDelete,
  onClick,
}) => {
  const { id, title, description, image } = product;

  return (
    <div
      className="product-card"
      onClick={() => onClick(id)}
      style={{ cursor: 'pointer' }}>
      <div className="card-image">
        <img src={image} alt={title} />
      </div>
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-description">{description.substring(0, 50)}...</p>
        <div className="card-actions">
          <button
            className={`like-button ${isFavorite ? 'liked' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onLike(id);
            }}>
            ❤️
          </button>
          <button
            className="delete-button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}>
            🗑️
          </button>
          <Link to={`/edit-product/${id}`}>
            <button
              className="edit-button"
              onClick={(e) => e.stopPropagation()}>
              ✏️ Edit
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
