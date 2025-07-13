import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  SimpleGrid,
  useColorModeValue,
  Alert,
  AlertIcon,
  Spinner,
  Checkbox,
  CheckboxGroup,
  Stack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const AdminProductForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const isEditing = !!id;
  
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: [],
    anime: '',
    brand: '',
    sku: '',
    material: '',
    dimensions: '',
    weight: '',
    images: [''],
    features: [''],
    discount: 0,
    featured: false,
  });

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch('/api/categories', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryChange = (selectedCategories) => {
    setFormData({
      ...formData,
      category: selectedCategories,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.price || !formData.stock || !formData.sku || formData.category.length === 0) {
        alert('Please fill in all required fields');
        return;
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        sku: formData.sku,
        category: formData.category,
        anime: formData.anime,
        brand: formData.brand,
        material: formData.material,
        dimensions: formData.dimensions,
        weight: formData.weight,
        images: formData.images.filter(img => img.trim()),
        features: formData.features.filter(feature => feature.trim()),
        discount: parseInt(formData.discount),
        isFeatured: formData.featured,
      };

      const url = isEditing 
        ? `/api/products/${id}`
        : '/api/products';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(isEditing ? 'Product updated successfully!' : 'Product created successfully!');
        navigate('/admin/products');
      } else {
        alert(data.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="800px">
        <VStack spacing={8} align="stretch">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heading size="xl" color="gray.800">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </Heading>
          </MotionBox>

          <Box
            bg={cardBg}
            borderRadius="xl"
            p={8}
            boxShadow="sm"
            border="1px"
            borderColor={borderColor}
          >
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={2} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Product Name</FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>SKU</FormLabel>
                    <Input
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      placeholder="Enter SKU (e.g., ANIME-001)"
                    />
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={2} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Price</FormLabel>
                    <NumberInput min={0}>
                      <NumberInputField
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Stock</FormLabel>
                    <NumberInput min={0}>
                      <NumberInputField
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="0"
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </SimpleGrid>

                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter product description"
                    rows={4}
                  />
                </FormControl>

                <SimpleGrid columns={2} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Categories</FormLabel>
                    {categoriesLoading ? (
                      <Spinner size="sm" />
                    ) : (
                      <CheckboxGroup
                        value={formData.category}
                        onChange={handleCategoryChange}
                      >
                        <Stack spacing={2}>
                          {categories.map((category) => (
                            <Checkbox key={category._id} value={category._id}>
                              {category.name}
                            </Checkbox>
                          ))}
                        </Stack>
                      </CheckboxGroup>
                    )}
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Anime Series</FormLabel>
                    <Input
                      name="anime"
                      value={formData.anime}
                      onChange={handleChange}
                      placeholder="Enter anime series"
                    />
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={2} spacing={4}>
                  <FormControl>
                    <FormLabel>Brand</FormLabel>
                    <Input
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      placeholder="Enter brand name"
                    />
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={2} spacing={4}>
                  <FormControl>
                    <FormLabel>Material</FormLabel>
                    <Input
                      name="material"
                      value={formData.material}
                      onChange={handleChange}
                      placeholder="e.g., PVC, Fabric, Metal"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Dimensions</FormLabel>
                    <Input
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleChange}
                      placeholder="e.g., 10cm x 5cm x 3cm"
                    />
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={2} spacing={4}>
                  <FormControl>
                    <FormLabel>Weight</FormLabel>
                    <Input
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="e.g., 500g"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Discount (%)</FormLabel>
                    <NumberInput min={0} max={100}>
                      <NumberInputField
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        placeholder="0"
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel>Image URLs (one per line)</FormLabel>
                  <Textarea
                    name="images"
                    value={formData.images.join('\n')}
                    onChange={(e) => setFormData({
                      ...formData,
                      images: e.target.value.split('\n').filter(url => url.trim())
                    })}
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                    rows={3}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Features (one per line)</FormLabel>
                  <Textarea
                    name="features"
                    value={formData.features.join('\n')}
                    onChange={(e) => setFormData({
                      ...formData,
                      features: e.target.value.split('\n').filter(feature => feature.trim())
                    })}
                    placeholder="High quality material&#10;Official licensed product&#10;Perfect for collectors"
                    rows={3}
                  />
                </FormControl>

                <FormControl>
                  <Checkbox
                    name="featured"
                    isChecked={formData.featured}
                    onChange={(e) => setFormData({
                      ...formData,
                      featured: e.target.checked
                    })}
                  >
                    Featured Product
                  </Checkbox>
                </FormControl>

                <HStack spacing={4}>
                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    flex="1"
                  >
                    {isEditing ? 'Update Product' : 'Add Product'}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate('/admin/products')}
                  >
                    Cancel
                  </Button>
                </HStack>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default AdminProductForm; 