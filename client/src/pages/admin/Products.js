import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Badge,
  IconButton,
  useColorModeValue,
  Alert,
  AlertIcon,
  Spinner,
  Flex,
  Spacer,
  Checkbox,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Tooltip,
  SimpleGrid,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiSearch, 
  FiFilter,
  FiMoreVertical,
  FiEye,
  FiStar,
  FiPackage,
  FiCheck,
  FiX
} from 'react-icons/fi';

import { fetchProducts } from '../../store/slices/productSlice';

const MotionBox = motion(Box);

const AdminProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { products, loading, error } = useSelector((state) => state.product);
  
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    dispatch(fetchProducts());
    fetchCategories();
  }, [dispatch]);

  const fetchCategories = async () => {
    try {
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
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleEdit = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const handleView = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Product deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        dispatch(fetchProducts());
      } else {
        const data = await response.json();
        toast({
          title: 'Error',
          description: data.message || 'Failed to delete product',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      const deletePromises = selectedProducts.map(productId =>
        fetch(`/api/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      );

      await Promise.all(deletePromises);
      
      toast({
        title: 'Success',
        description: `${selectedProducts.length} products deleted successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setSelectedProducts([]);
      dispatch(fetchProducts());
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete products',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedProducts(filteredProducts.map(product => product._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId, isChecked) => {
    if (isChecked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.anime.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !categoryFilter || 
      (Array.isArray(product.category) && 
       product.category.some(cat => 
         typeof cat === 'object' ? cat.slug === categoryFilter : cat === categoryFilter
       ));
    
    const matchesStatus = !statusFilter || 
      (statusFilter === 'in-stock' && product.stock > 0) ||
      (statusFilter === 'out-of-stock' && product.stock === 0) ||
      (statusFilter === 'featured' && product.isFeatured);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50" py={20}>
        <Container maxW="lg">
          <VStack spacing={8} textAlign="center">
            <Spinner size="xl" color="anime.primary" />
            <Text color="gray.600">Loading products...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="1400px">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Flex justify="space-between" align="center">
              <VStack align="flex-start" spacing={2}>
                <Heading size="xl" color="gray.800">
                  Manage Products
                </Heading>
                <Text color="gray.600">
                  Add, edit, and manage your anime merchandise products
                </Text>
              </VStack>
              <Button
                leftIcon={<FiPlus />}
                colorScheme="anime"
                onClick={() => navigate('/admin/products/new')}
                size="lg"
              >
                Add Product
              </Button>
            </Flex>
          </MotionBox>

          {/* Error Alert */}
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {/* Filters and Search */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Box
              bg={cardBg}
              borderRadius="xl"
              p={6}
              boxShadow="sm"
              border="1px"
              borderColor={borderColor}
            >
              <VStack spacing={4} align="stretch">
                {/* Search and Filters */}
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiSearch color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </InputGroup>
                  
                  <Select
                    placeholder="Filter by category"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category._id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                  
                  <Select
                    placeholder="Filter by status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="in-stock">In Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                    <option value="featured">Featured</option>
                  </Select>
                </SimpleGrid>

                {/* Bulk Actions */}
                {selectedProducts.length > 0 && (
                  <HStack justify="space-between" p={4} bg="blue.50" borderRadius="md">
                    <Text fontWeight="medium">
                      {selectedProducts.length} product(s) selected
                    </Text>
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        colorScheme="red"
                        leftIcon={<FiTrash2 />}
                        onClick={handleBulkDelete}
                      >
                        Delete Selected
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedProducts([])}
                      >
                        Clear Selection
                      </Button>
                    </HStack>
                  </HStack>
                )}
              </VStack>
            </Box>
          </MotionBox>

          {/* Products Table */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box
              bg={cardBg}
              borderRadius="xl"
              overflow="hidden"
              boxShadow="sm"
              border="1px"
              borderColor={borderColor}
            >
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>
                      <Checkbox
                        isChecked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        isIndeterminate={selectedProducts.length > 0 && selectedProducts.length < filteredProducts.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </Th>
                    <Th>Image</Th>
                    <Th>Name</Th>
                    <Th>Category</Th>
                    <Th>Price</Th>
                    <Th>Stock</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredProducts.map((product) => (
                    <Tr key={product._id} _hover={{ bg: 'gray.50' }}>
                      <Td>
                        <Checkbox
                          isChecked={selectedProducts.includes(product._id)}
                          onChange={(e) => handleSelectProduct(product._id, e.target.checked)}
                        />
                      </Td>
                      <Td>
                        <Image
                          src={product.images?.[0] || '/placeholder-image.jpg'}
                          alt={product.name}
                          w="50px"
                          h="50px"
                          objectFit="cover"
                          borderRadius="md"
                          fallbackSrc="https://via.placeholder.com/50x50?text=No+Image"
                        />
                      </Td>
                      <Td>
                        <VStack align="flex-start" spacing={1}>
                          <Text fontWeight="medium" noOfLines={1}>
                            {product.name}
                          </Text>
                          <Text fontSize="sm" color="gray.600" noOfLines={1}>
                            {product.anime}
                          </Text>
                          {product.isFeatured && (
                            <Badge size="sm" colorScheme="yellow" variant="subtle">
                              <FiStar size="12" /> Featured
                            </Badge>
                          )}
                        </VStack>
                      </Td>
                      <Td>
                        <VStack align="flex-start" spacing={1}>
                          {Array.isArray(product.category) && product.category.length > 0 ? (
                            product.category.map((cat, index) => (
                              <Badge key={index} colorScheme="blue" variant="subtle" size="sm">
                                {typeof cat === 'object' ? cat.name : cat}
                              </Badge>
                            ))
                          ) : (
                            <Badge colorScheme="gray" variant="subtle" size="sm">
                              No Category
                            </Badge>
                          )}
                        </VStack>
                      </Td>
                      <Td fontWeight="bold">{formatPrice(product.price)}</Td>
                      <Td>
                        <Text color={product.stock > 0 ? 'green.600' : 'red.600'} fontWeight="medium">
                          {product.stock}
                        </Text>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={product.stock > 0 ? 'green' : 'red'}
                          variant="solid"
                        >
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <Tooltip label="View Product">
                            <IconButton
                              icon={<FiEye />}
                              size="sm"
                              variant="ghost"
                              colorScheme="blue"
                              onClick={() => handleView(product._id)}
                              aria-label="View product"
                            />
                          </Tooltip>
                          <Tooltip label="Edit Product">
                            <IconButton
                              icon={<FiEdit />}
                              size="sm"
                              variant="ghost"
                              colorScheme="blue"
                              onClick={() => handleEdit(product._id)}
                              aria-label="Edit product"
                            />
                          </Tooltip>
                          <Tooltip label="Delete Product">
                            <IconButton
                              icon={<FiTrash2 />}
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => {
                                setProductToDelete(product);
                                setIsDeleteDialogOpen(true);
                              }}
                              aria-label="Delete product"
                            />
                          </Tooltip>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              
              {filteredProducts.length === 0 && (
                <Box p={8} textAlign="center">
                  <Text color="gray.500">No products found matching your criteria.</Text>
                </Box>
              )}
            </Box>
          </MotionBox>
        </VStack>
      </Container>

      {/* Delete Confirmation Dialog */}
      <AlertDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Delete Product</AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              colorScheme="red" 
              ml={3} 
              onClick={() => {
                if (productToDelete) {
                  handleDelete(productToDelete._id);
                  setIsDeleteDialogOpen(false);
                  setProductToDelete(null);
                }
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
};

export default AdminProducts; 