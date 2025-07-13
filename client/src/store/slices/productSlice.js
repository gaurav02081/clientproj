import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      // Clean parameters - remove empty strings and undefined values
      const cleanParams = {};
      Object.entries(params).forEach(([key, value]) => {
        if (value !== '' && value !== undefined && value !== null) {
          cleanParams[key] = value;
        }
      });
      
      const response = await api.get('/products', { params: cleanParams });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch products';
      return rejectWithValue(message);
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'product/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/featured');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch featured products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'product/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch product';
      return rejectWithValue(message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'product/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/categories');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch categories');
    }
  }
);

export const fetchAnimeList = createAsyncThunk(
  'product/fetchAnimeList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/anime');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch anime list');
    }
  }
);

// Admin actions
export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create product';
      return rejectWithValue(message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update product';
      return rejectWithValue(message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${productId}`);
      return productId;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete product';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  products: [],
  featuredProducts: [],
  currentProduct: null,
  categories: [],
  animeList: [],
  filters: {
    category: '',
    anime: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    sort: '-createdAt',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNext: false,
    hasPrev: false,
  },
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        anime: '',
        search: '',
        minPrice: '',
        maxPrice: '',
        sort: '-createdAt',
      };
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Featured Products
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProducts = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Fetch Anime List
      .addCase(fetchAnimeList.fulfilled, (state, action) => {
        state.animeList = action.payload;
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct?._id === action.payload._id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(p => p._id !== action.payload);
        if (state.currentProduct?._id === action.payload) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearCurrentProduct, clearError } = productSlice.actions;
export default productSlice.reducer; 