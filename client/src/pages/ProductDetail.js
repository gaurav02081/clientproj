import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Image,
  Badge,
  Divider,
  SimpleGrid,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Alert,
  AlertIcon,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiShare2 } from 'react-icons/fi';

import { fetchProductById } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';

const MotionBox = motion(Box);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  
  const { product, loading, error } = useSelector((state) => state.product);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }

    if (quantity > product.stock) {
      toast({
        title: 'Insufficient Stock',
        description: `Only ${product.stock} items available.`,
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    dispatch(addToCart({
      ...product,
      quantity,
    }));

    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const renderStars = (rating) => {
    return Array(5).fill('').map((_, index) => (
      <StarIcon
        key={index}
        color={index < rating ? 'yellow.400' : 'gray.300'}
        boxSize={4}
      />
    ));
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50" py={20}>
        <Container maxW="lg">
          <VStack spacing={8} textAlign="center">
            <Text color="gray.600">Loading product...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box minH="100vh" bg="gray.50" py={20}>
        <Container maxW="lg">
          <VStack spacing={8} textAlign="center">
            <Heading size="lg" color="gray.800">
              Product Not Found
            </Heading>
            <Text color="gray.600">
              The product you're looking for doesn't exist or has been removed.
            </Text>
            <Button colorScheme="brand" onClick={() => navigate('/products')}>
              Browse Products
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="1200px">
        <VStack spacing={8} align="stretch">
          {/* Breadcrumb */}
          <HStack spacing={2} color="gray.600" fontSize="sm">
            <Button variant="link" onClick={() => navigate('/')} size="sm">
              Home
            </Button>
            <Text>/</Text>
            <Button variant="link" onClick={() => navigate('/products')} size="sm">
              Products
            </Button>
            <Text>/</Text>
            <Text>{product.name}</Text>
          </HStack>

          <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
            {/* Product Images */}
            <Box flex="1">
              <VStack spacing={4}>
                {/* Main Image */}
                <Box
                  w="full"
                  h="400px"
                  borderRadius="xl"
                  overflow="hidden"
                  border="1px"
                  borderColor={borderColor}
                >
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    w="full"
                    h="full"
                    objectFit="cover"
                  />
                </Box>

                {/* Thumbnail Images */}
                {product.images.length > 1 && (
                  <HStack spacing={2} overflowX="auto" w="full" pb={2}>
                    {product.images.map((image, index) => (
                      <Box
                        key={index}
                        w="80px"
                        h="80px"
                        borderRadius="md"
                        overflow="hidden"
                        border="2px"
                        borderColor={selectedImage === index ? 'anime.primary' : borderColor}
                        cursor="pointer"
                        onClick={() => setSelectedImage(index)}
                        transition="all 0.2s"
                        _hover={{ borderColor: 'anime.primary' }}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          w="full"
                          h="full"
                          objectFit="cover"
                        />
                      </Box>
                    ))}
                  </HStack>
                )}
              </VStack>
            </Box>

            {/* Product Info */}
            <Box flex="1">
              <VStack spacing={6} align="flex-start">
                {/* Product Header */}
                <VStack align="flex-start" spacing={3}>
                  <HStack spacing={3}>
                    <Badge colorScheme="blue" variant="subtle">
                      {product.category}
                    </Badge>
                    <Badge colorScheme="green" variant="subtle">
                      {product.anime}
                    </Badge>
                  </HStack>
                  
                  <Heading size="xl" color="gray.800">
                    {product.name}
                  </Heading>
                  
                  <HStack spacing={2}>
                    {renderStars(product.rating)}
                    <Text fontSize="sm" color="gray.600">
                      ({product.reviews?.length || 0} reviews)
                    </Text>
                  </HStack>
                </VStack>

                {/* Price */}
                <VStack align="flex-start" spacing={2}>
                  <HStack spacing={3}>
                    <Text fontSize="2xl" fontWeight="bold" color="anime.primary">
                      {formatPrice(product.price)}
                    </Text>
                    {product.discount > 0 && (
                      <Text
                        fontSize="lg"
                        color="gray.500"
                        textDecoration="line-through"
                      >
                        {formatPrice(product.price + (product.price * product.discount / 100))}
                      </Text>
                    )}
                  </HStack>
                  
                  {product.discount > 0 && (
                    <Badge colorScheme="red" variant="solid">
                      {product.discount}% OFF
                    </Badge>
                  )}
                </VStack>

                {/* Stock Status */}
                <Alert
                  status={product.stock > 0 ? 'success' : 'error'}
                  borderRadius="md"
                >
                  <AlertIcon />
                  {product.stock > 0 
                    ? `${product.stock} items in stock`
                    : 'Out of stock'
                  }
                </Alert>

                {/* Quantity and Add to Cart */}
                <VStack align="flex-start" spacing={4} w="full">
                  <HStack spacing={4}>
                    <Text fontWeight="medium">Quantity:</Text>
                    <NumberInput
                      value={quantity}
                      onChange={(value) => setQuantity(parseInt(value) || 1)}
                      min={1}
                      max={product.stock}
                      size="md"
                      w="120px"
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </HStack>

                  <HStack spacing={4} w="full">
                    <Button
                      colorScheme="brand"
                      size="lg"
                      flex="1"
                      leftIcon={<FiShoppingCart />}
                      onClick={handleAddToCart}
                      isDisabled={product.stock === 0}
                    >
                      Add to Cart
                    </Button>
                    
                    <IconButton
                      icon={<FiHeart />}
                      variant="outline"
                      size="lg"
                      aria-label="Add to wishlist"
                    />
                    
                    <IconButton
                      icon={<FiShare2 />}
                      variant="outline"
                      size="lg"
                      aria-label="Share product"
                    />
                  </HStack>
                </VStack>

                {/* Product Description */}
                <Box w="full">
                  <Text color="gray.700" lineHeight="tall">
                    {product.description}
                  </Text>
                </Box>
              </VStack>
            </Box>
          </Flex>

          {/* Product Details Tabs */}
          <Box
            bg={cardBg}
            borderRadius="xl"
            border="1px"
            borderColor={borderColor}
            boxShadow="sm"
          >
            <Tabs variant="enclosed" colorScheme="brand">
              <TabList>
                <Tab>Description</Tab>
                <Tab>Specifications</Tab>
                <Tab>Reviews</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <VStack spacing={4} align="flex-start">
                    <Text color="gray.700" lineHeight="tall">
                      {product.description}
                    </Text>
                    
                    {product.features && (
                      <Box w="full">
                        <Heading size="md" mb={3}>Features</Heading>
                        <VStack align="flex-start" spacing={2}>
                          {product.features.map((feature, index) => (
                            <HStack key={index} spacing={2}>
                              <Box w={2} h={2} bg="anime.primary" borderRadius="full" />
                              <Text>{feature}</Text>
                            </HStack>
                          ))}
                        </VStack>
                      </Box>
                    )}
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <VStack align="flex-start" spacing={3}>
                      <Text fontWeight="bold">Category:</Text>
                      <Text>{product.category}</Text>
                      
                      <Text fontWeight="bold">Anime:</Text>
                      <Text>{product.anime}</Text>
                      
                      <Text fontWeight="bold">Brand:</Text>
                      <Text>{product.brand || 'N/A'}</Text>
                    </VStack>
                    
                    <VStack align="flex-start" spacing={3}>
                      <Text fontWeight="bold">Material:</Text>
                      <Text>{product.material || 'N/A'}</Text>
                      
                      <Text fontWeight="bold">Dimensions:</Text>
                      <Text>{product.dimensions || 'N/A'}</Text>
                      
                      <Text fontWeight="bold">Weight:</Text>
                      <Text>{product.weight || 'N/A'}</Text>
                    </VStack>
                  </SimpleGrid>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={4} align="flex-start">
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((review, index) => (
                        <Box key={index} w="full" p={4} border="1px" borderColor={borderColor} borderRadius="md">
                          <HStack justify="space-between" mb={2}>
                            <Text fontWeight="bold">{review.user}</Text>
                            <HStack spacing={1}>
                              {renderStars(review.rating)}
                            </HStack>
                          </HStack>
                          <Text color="gray.600">{review.comment}</Text>
                        </Box>
                      ))
                    ) : (
                      <Text color="gray.500">No reviews yet. Be the first to review this product!</Text>
                    )}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default ProductDetail; 