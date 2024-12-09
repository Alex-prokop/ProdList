import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchProducts, createProduct } from '../api/productsApi';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  liked: boolean;
}

interface ProductsState {
  items: Product[];
  favorites: number[];
  deletedIds: number[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  favorites: [],
  deletedIds: [],
  status: 'idle',
  error: null,
};

export const loadProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchProducts();
      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch products');
    }
  }
);

export const createProductThunk = createAsyncThunk(
  'products/create',
  async (
    product: {
      title: string;
      description: string;
      price: number;
      image: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await createProduct(product);
      return response;
    } catch (error) {
      return rejectWithValue('Failed to create product');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    toggleLike(state, action: PayloadAction<number>) {
      const id = action.payload;
      if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter((favId) => favId !== id);
      } else {
        state.favorites.push(id);
      }
    },
    deleteProduct(state, action: PayloadAction<number>) {
      const id = action.payload;
      state.deletedIds.push(id);
      state.items = state.items.filter((product: Product) => product.id !== id);
      state.favorites = state.favorites.filter((favId) => favId !== id);
    },
    addProduct(state, action: PayloadAction<Product>) {
      const existingProduct = state.items.find(
        (product) => product.id === action.payload.id
      );
      if (!existingProduct) {
        state.items.push(action.payload);
      }
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const index = state.items.findIndex(
        (product) => product.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload
          .map((product: Product) => ({
            ...product,
            liked: false,
          }))
          .filter((product: Product) => !state.deletedIds.includes(product.id));
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        console.error(action.payload);
      })

      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.items.push({ ...action.payload, liked: false });
      })
      .addCase(createProductThunk.rejected, (state, action) => {
        state.error = action.payload as string;
        console.error(action.payload);
      });
  },
});

export const { toggleLike, deleteProduct, addProduct, updateProduct } =
  productsSlice.actions;

export default productsSlice.reducer;
