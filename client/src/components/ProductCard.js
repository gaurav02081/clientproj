import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  Image,
  Text,
  Badge,
  HStack,
  VStack,
  Button,
  IconButton,
  useColorModeValue,
  Tooltip,
  useColorMode,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiStar, FiHeart } from 'react-icons/fi';
import { FaDragon } from 'react-icons/fa';

import { addToCart } from '../store/slices/cartSlice';

const MotionBox = motion(Box);

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const discountedPrice = product.discount > 0 
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  return (
    <MotionBox
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/products/${product._id}`}>
        <Box
          bg={cardBg}
          borderRadius="2xl"
          overflow="hidden"
          border="1px"
          borderColor={borderColor}
          transition="all 0.3s"
          _hover={{
            boxShadow: '2xl',
            borderColor: 'anime.pink',
          }}
          position="relative"
          h="full"
          display="flex"
          flexDirection="column"
          group
        >
          {/* Product Image */}
          <Box position="relative" h="250px" overflow="hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              w="full"
              h="full"
              objectFit="cover"
              transition="transform 0.3s"
              _groupHover={{ transform: 'scale(1.1)' }}
            />
            
            {/* Gradient Overlay */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bgGradient="linear(to-t, rgba(0,0,0,0.3), transparent)"
              opacity={0}
              _groupHover={{ opacity: 1 }}
              transition="opacity 0.3s"
            />
            
            {/* Discount Badge */}
            {product.discount > 0 && (
              <Badge
                position="absolute"
                top={3}
                left={3}
                variant="gradient"
                borderRadius="full"
                px={3}
                py={1}
                fontWeight="bold"
                animation="pulse 2s infinite"
                zIndex={2}
              >
                -{product.discount}%
              </Badge>
            )}

            {/* Featured Badge */}
            {product.isFeatured && (
              <Badge
                position="absolute"
                top={3}
                right={3}
                colorScheme="anime"
                borderRadius="full"
                px={3}
                py={1}
                fontWeight="bold"
                zIndex={2}
              >
                Featured
              </Badge>
            )}

            {/* Quick Actions */}
            <Box
              position="absolute"
              bottom={3}
              right={3}
              opacity={0}
              transition="opacity 0.3s"
              _groupHover={{ opacity: 1 }}
              zIndex={2}
            >
              <HStack spacing={2}>
                <Tooltip label="Add to Wishlist" placement="top">
                  <IconButton
                    size="sm"
                    colorScheme="anime"
                    borderRadius="full"
                    icon={<FiHeart />}
                    aria-label="Add to wishlist"
                    _hover={{
                      transform: 'scale(1.1)',
                      boxShadow: 'lg',
                    }}
                    transition="all 0.2s"
                  />
                </Tooltip>
                <Tooltip label="Add to Cart" placement="top">
                  <IconButton
                    size="sm"
                    colorScheme="anime"
                    borderRadius="full"
                    icon={<FiShoppingCart />}
                    onClick={handleAddToCart}
                    aria-label="Add to cart"
                    _hover={{
                      transform: 'scale(1.1)',
                      boxShadow: 'lg',
                    }}
                    transition="all 0.2s"
                  />
                </Tooltip>
              </HStack>
            </Box>
          </Box>

          {/* Product Info */}
          <VStack spacing={4} p={6} flex="1" align="stretch">
            {/* Category and Anime */}
            <HStack justify="space-between" align="flex-start">
              <Badge
                colorScheme="anime"
                variant="subtle"
                fontSize="xs"
                textTransform="capitalize"
                fontWeight="semibold"
                borderRadius="full"
                px={3}
                py={1}
              >
                {product.category}
              </Badge>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                {product.anime}
              </Text>
            </HStack>

            {/* Product Name */}
            <Text
              fontWeight="bold"
              fontSize="lg"
              noOfLines={2}
              lineHeight="short"
              color="gray.800"
              _groupHover={{ color: 'anime.pink' }}
              transition="color 0.2s"
              fontFamily="Poppins"
            >
              {product.name}
            </Text>

            {/* Rating */}
            {product.ratings?.average > 0 && (
              <HStack spacing={2}>
                <HStack spacing={1}>
                  <FiStar color="gold" size={16} />
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    {product.ratings.average.toFixed(1)}
                  </Text>
                </HStack>
                <Text fontSize="xs" color="gray.500">
                  ({product.ratings.count} reviews)
                </Text>
              </HStack>
            )}

            {/* Price */}
            <HStack justify="space-between" align="center">
              <VStack align="flex-start" spacing={1}>
                <Text
                  fontWeight="bold"
                  fontSize="xl"
                  color={product.discount > 0 ? 'anime.pink' : 'anime.purple'}
                  fontFamily="Poppins"
                >
                  {formatPrice(discountedPrice)}
                </Text>
                {product.discount > 0 && (
                  <Text
                    fontSize="sm"
                    color="gray.500"
                    textDecoration="line-through"
                  >
                    {formatPrice(product.price)}
                  </Text>
                )}
              </VStack>

              {/* Stock Status */}
              <Text
                fontSize="xs"
                color={product.stock > 0 ? 'green.500' : 'anime.pink'}
                fontWeight="bold"
                bg={product.stock > 0 ? 'green.50' : 'anime.50'}
                px={2}
                py={1}
                borderRadius="full"
              >
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </Text>
            </HStack>

            {/* Add to Cart Button */}
            <Button
              size="md"
              variant="gradient"
              leftIcon={<FiShoppingCart />}
              onClick={handleAddToCart}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              transition="all 0.2s"
              isDisabled={product.stock === 0}
              opacity={product.stock === 0 ? 0.6 : 1}
              borderRadius="xl"
              fontWeight="semibold"
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </VStack>
        </Box>
      </Link>
    </MotionBox>
  );
};

export default ProductCard; 