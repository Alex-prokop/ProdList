import axios from 'axios';

const API_URL = 'https://fakestoreapi.com/products';

export const fetchProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const fetchProductById = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createProduct = async (product: {
  title: string;
  description: string;
  price: number;
  image: string;
  category?: string;
}) => {
  const response = await axios.post(API_URL, product);
  return response.data;
};

export const updateProduct = async (
  id: string,
  updatedData: Partial<{
    title: string;
    description: string;
    price: number;
    image: string;
    category?: string;
  }>
) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedData);
  return response.data;
};

export const deleteProductApi = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
