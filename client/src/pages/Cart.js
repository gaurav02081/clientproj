import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Image,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
  Alert,
  AlertIcon,
  useColorModeValue,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiTrash2, FiArrowLeft, FiShoppingCart } from 'react-icons/fi';

import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';

const MotionBox = motion(Box);

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items, total, itemCount } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const pageBg = useColorModeValue('gray.50', 'gray.900');
  const emptyBg = useColorModeValue('gray.200', 'gray.700');
  const emptyIcon = useColorModeValue('gray.400', 'gray.500');
  const headingColor = useColorModeValue('gray.800', 'gray.100');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const badgeText = useColorModeValue('gray.500', 'gray.400');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const handleQuantityChange = (productId, quantity) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
    } else {
      navigate('/checkout');
    }
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  if (items.length === 0) {
    return (
      <Box minH="100vh" bg={pageBg} py={20}>
        <Container maxW="lg">
          <VStack spacing={8} textAlign="center">
            <Box
              w={20}
              h={20}
              bg={emptyBg}
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <FiShoppingCart size={40} color={emptyIcon} />
            </Box>
            
            <VStack spacing={4}>
              <Heading size="lg" color={headingColor}>
                Your cart is empty
              </Heading>
              <Text color={textColor}>
                Looks like you haven't added any items to your cart yet.
              </Text>
            </VStack>

            <Button
              colorScheme="brand"
              size="lg"
              leftIcon={<FiArrowLeft />}
              onClick={handleContinueShopping}
            >
              Start Shopping
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={pageBg} py={8}>
      <Container maxW="1200px">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <VStack spacing={4} textAlign="center">
              <Heading size="xl" color={headingColor}>
                Shopping Cart
              </Heading>
              <Text color={textColor}>
                You have {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
              </Text>
            </VStack>
          </MotionBox>

          <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
            {/* Cart Items */}
            <Box flex="1">
              <VStack spacing={4} align="stretch">
                {items.map((item) => (
                  <MotionBox
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box
                      bg={cardBg}
                      borderRadius="xl"
                      p={6}
                      border="1px"
                      borderColor={borderColor}
                      boxShadow="sm"
                    >
                      <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
                        {/* Product Image */}
                        <Box w={{ base: 'full', md: '120px' }} h="120px" flexShrink={0}>
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            w="full"
                            h="full"
                            objectFit="cover"
                            borderRadius="md"
                          />
                        </Box>

                        {/* Product Info */}
                        <Box flex="1">
                          <VStack align="flex-start" spacing={3}>
                            <Box w="full">
                              <HStack justify="space-between" align="flex-start">
                                <VStack align="flex-start" spacing={1} flex="1">
                                  <Text fontWeight="bold" fontSize="lg" noOfLines={2}>
                                    {item.name}
                                  </Text>
                                  <HStack spacing={2}>
                                    <Badge colorScheme="blue" variant="subtle">
                                      {item.category}
                                    </Badge>
                                    <Text fontSize="sm" color={badgeText}>
                                      {item.anime}
                                    </Text>
                                  </HStack>
                                </VStack>
                                
                                <IconButton
                                  icon={<FiTrash2 />}
                                  variant="ghost"
                                  colorScheme="red"
                                  size="sm"
                                  onClick={() => handleRemoveItem(item._id)}
                                  aria-label="Remove item"
                                />
                              </HStack>
                            </Box>

                            <HStack justify="space-between" w="full" align="center">
                              {/* Quantity Controls */}
                              <HStack spacing={3}>
                                <Text fontSize="sm" color={textColor}>
                                  Quantity:
                                </Text>
                                <NumberInput
                                  value={item.quantity}
                                  onChange={(value) => handleQuantityChange(item._id, parseInt(value) || 0)}
                                  min={1}
                                  max={item.stock}
                                  size="sm"
                                  w="100px"
                                >
                                  <NumberInputField />
                                  <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                  </NumberInputStepper>
                                </NumberInput>
                              </HStack>

                              {/* Price */}
                              <VStack align="flex-end" spacing={0}>
                                <Text fontWeight="bold" fontSize="lg">
                                  {formatPrice(item.price * item.quantity)}
                                </Text>
                                {item.discount > 0 && (
                                  <Text fontSize="sm" color="gray.500" textDecoration="line-through">
                                    {formatPrice((item.price + (item.price * item.discount / 100)) * item.quantity)}
                                  </Text>
                                )}
                              </VStack>
                            </HStack>

                            {/* Stock Warning */}
                            {item.quantity >= item.stock && (
                              <Alert status="warning" size="sm" borderRadius="md">
                                <AlertIcon />
                                Only {item.stock} items available in stock
                              </Alert>
                            )}
                          </VStack>
                        </Box>
                      </Flex>
                    </Box>
                  </MotionBox>
                ))}
              </VStack>

              {/* Clear Cart Button */}
              <Box textAlign="center" pt={4}>
                <Button
                  variant="ghost"
                  colorScheme="red"
                  size="sm"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
              </Box>
            </Box>

            {/* Order Summary */}
            <Box w={{ base: 'full', lg: '350px' }}>
              <Box
                bg={cardBg}
                borderRadius="xl"
                p={6}
                border="1px"
                borderColor={borderColor}
                boxShadow="sm"
                position="sticky"
                top={4}
              >
                <VStack spacing={6} align="stretch">
                  <Heading size="md" color={headingColor}>
                    Order Summary
                  </Heading>

                  <VStack spacing={3} align="stretch">
                    <HStack justify="space-between">
                      <Text color={textColor}>Subtotal ({itemCount} items)</Text>
                      <Text fontWeight="bold">{formatPrice(total)}</Text>
                    </HStack>
                    
                    <HStack justify="space-between">
                      <Text color={textColor}>Shipping</Text>
                      <Text fontWeight="bold">
                        {total > 100 ? 'Free' : formatPrice(10)}
                      </Text>
                    </HStack>
                    
                    <HStack justify="space-between">
                      <Text color={textColor}>Tax</Text>
                      <Text fontWeight="bold">{formatPrice(total * 0.08)}</Text>
                    </HStack>

                    <Divider />

                    <HStack justify="space-between">
                      <Text fontSize="lg" fontWeight="bold">
                        Total
                      </Text>
                      <Text fontSize="lg" fontWeight="bold" color="anime.primary">
                        {formatPrice(total + (total > 100 ? 0 : 10) + (total * 0.08))}
                      </Text>
                    </HStack>
                  </VStack>

                  <VStack spacing={3}>
                    <Button
                      colorScheme="brand"
                      size="lg"
                      w="full"
                      onClick={handleCheckout}
                      leftIcon={<FiShoppingCart />}
                    >
                      {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
                    </Button>

                    <Button
                      variant="outline"
                      size="md"
                      w="full"
                      onClick={handleContinueShopping}
                      leftIcon={<FiArrowLeft />}
                    >
                      Continue Shopping
                    </Button>
                  </VStack>

                  {/* Free Shipping Notice */}
                  {total < 100 && (
                    <Alert status="info" size="sm" borderRadius="md">
                      <AlertIcon />
                      Add {formatPrice(100 - total)} more for free shipping!
                    </Alert>
                  )}
                </VStack>
              </Box>
            </Box>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};

export default Cart; 