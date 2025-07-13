import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Divider,
  Alert,
  AlertIcon,
  useColorModeValue,
  SimpleGrid,
  Image,
  Flex,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

import { createOrder } from '../store/slices/orderSlice';

const MotionBox = motion(Box);

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { cartItems, total } = useSelector((state) => state.cart);
  const { loading, error } = useSelector((state) => state.order);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    paymentMethod: 'credit_card',
  });

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const orderData = {
      ...formData,
      items: cartItems,
      total,
    };
    
    dispatch(createOrder(orderData));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <Box minH="100vh" bg="gray.50" py={20}>
        <Container maxW="lg">
          <VStack spacing={8} textAlign="center">
            <Heading size="lg" color="gray.800">
              Your Cart is Empty
            </Heading>
            <Text color="gray.600">
              Add some items to your cart before checkout.
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
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <VStack spacing={4} textAlign="center">
              <Heading size="xl" color="gray.800">
                Checkout
              </Heading>
              <Text color="gray.600">
                Complete your order and secure your anime merchandise
              </Text>
            </VStack>
          </MotionBox>

          <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
            {/* Checkout Form */}
            <Box flex="2">
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
                    {/* Error Alert */}
                    {error && (
                      <Alert status="error" borderRadius="md">
                        <AlertIcon />
                        {error}
                      </Alert>
                    )}

                    {/* Shipping Information */}
                    <VStack spacing={4} align="flex-start">
                      <Heading size="md" color="gray.800">
                        Shipping Information
                      </Heading>
                      
                      <SimpleGrid columns={2} spacing={4} w="full">
                        <FormControl isRequired>
                          <FormLabel color="gray.700">First Name</FormLabel>
                          <Input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Enter first name"
                            size="md"
                            borderRadius="md"
                          />
                        </FormControl>
                        
                        <FormControl isRequired>
                          <FormLabel color="gray.700">Last Name</FormLabel>
                          <Input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Enter last name"
                            size="md"
                            borderRadius="md"
                          />
                        </FormControl>
                      </SimpleGrid>

                      <SimpleGrid columns={2} spacing={4} w="full">
                        <FormControl isRequired>
                          <FormLabel color="gray.700">Email</FormLabel>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            size="md"
                            borderRadius="md"
                          />
                        </FormControl>
                        
                        <FormControl isRequired>
                          <FormLabel color="gray.700">Phone</FormLabel>
                          <Input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            size="md"
                            borderRadius="md"
                          />
                        </FormControl>
                      </SimpleGrid>

                      <FormControl isRequired>
                        <FormLabel color="gray.700">Address</FormLabel>
                        <Textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Enter full address"
                          size="md"
                          borderRadius="md"
                          rows={3}
                        />
                      </FormControl>

                      <SimpleGrid columns={3} spacing={4} w="full">
                        <FormControl isRequired>
                          <FormLabel color="gray.700">City</FormLabel>
                          <Input
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="City"
                            size="md"
                            borderRadius="md"
                          />
                        </FormControl>
                        
                        <FormControl isRequired>
                          <FormLabel color="gray.700">State</FormLabel>
                          <Input
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="State"
                            size="md"
                            borderRadius="md"
                          />
                        </FormControl>
                        
                        <FormControl isRequired>
                          <FormLabel color="gray.700">ZIP Code</FormLabel>
                          <Input
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            placeholder="ZIP Code"
                            size="md"
                            borderRadius="md"
                          />
                        </FormControl>
                      </SimpleGrid>

                      <FormControl isRequired>
                        <FormLabel color="gray.700">Country</FormLabel>
                        <Select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          size="md"
                          borderRadius="md"
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="UK">United Kingdom</option>
                          <option value="JP">Japan</option>
                        </Select>
                      </FormControl>
                    </VStack>

                    <Divider />

                    {/* Payment Method */}
                    <VStack spacing={4} align="flex-start">
                      <Heading size="md" color="gray.800">
                        Payment Method
                      </Heading>
                      
                      <FormControl>
                        <FormLabel color="gray.700">Payment Method</FormLabel>
                        <Select
                          name="paymentMethod"
                          value={formData.paymentMethod}
                          onChange={handleChange}
                          size="md"
                          borderRadius="md"
                        >
                          <option value="credit_card">Credit Card</option>
                          <option value="paypal">PayPal</option>
                          <option value="stripe">Stripe</option>
                        </Select>
                      </FormControl>
                    </VStack>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      colorScheme="brand"
                      size="lg"
                      w="full"
                      isLoading={loading}
                      loadingText="Processing Order..."
                      _hover={{ transform: 'translateY(-1px)' }}
                      transition="all 0.2s"
                    >
                      Place Order
                    </Button>
                  </VStack>
                </form>
              </Box>
            </Box>

            {/* Order Summary */}
            <Box flex="1">
              <Box
                bg={cardBg}
                borderRadius="xl"
                p={6}
                boxShadow="sm"
                border="1px"
                borderColor={borderColor}
                position="sticky"
                top={4}
              >
                <VStack spacing={4} align="stretch">
                  <Heading size="md" color="gray.800">
                    Order Summary
                  </Heading>
                  
                  <VStack spacing={3} align="stretch">
                    {cartItems.map((item) => (
                      <Flex key={item._id} align="center" gap={3}>
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          w="50px"
                          h="50px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                        <Box flex="1">
                          <Text fontWeight="medium" fontSize="sm">
                            {item.name}
                          </Text>
                          <Text color="gray.600" fontSize="sm">
                            Qty: {item.quantity}
                          </Text>
                        </Box>
                        <Text fontWeight="bold" fontSize="sm">
                          {formatPrice(item.price * item.quantity)}
                        </Text>
                      </Flex>
                    ))}
                  </VStack>
                  
                  <Divider />
                  
                  <VStack spacing={2} align="stretch">
                    <Flex justify="space-between">
                      <Text color="gray.600">Subtotal:</Text>
                      <Text fontWeight="bold">{formatPrice(total)}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text color="gray.600">Shipping:</Text>
                      <Text fontWeight="bold">Free</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text color="gray.600">Tax:</Text>
                      <Text fontWeight="bold">{formatPrice(total * 0.08)}</Text>
                    </Flex>
                    <Divider />
                    <Flex justify="space-between">
                      <Text fontWeight="bold" fontSize="lg">Total:</Text>
                      <Text fontWeight="bold" fontSize="lg" color="anime.primary">
                        {formatPrice(total * 1.08)}
                      </Text>
                    </Flex>
                  </VStack>
                </VStack>
              </Box>
            </Box>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};

export default Checkout; 