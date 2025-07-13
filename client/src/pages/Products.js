import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Badge,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  IconButton,
  Divider,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { FiFilter } from 'react-icons/fi';
import { motion } from 'framer-motion';

import { fetchProducts, fetchCategories, fetchAnimeList } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';

const MotionBox = motion(Box);

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const { products, categories, animeList, pagination, loading, error } = useSelector((state) => state.product);
  
  const [localFilters, setLocalFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    anime: searchParams.get('anime') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '-createdAt',
  });

  const pageBg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardText = useColorModeValue('gray.600', 'gray.300');
  const cardTitle = useColorModeValue('gray.800', 'gray.100');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const inputBg = useColorModeValue('white', 'gray.700');
  const inputBorder = useColorModeValue('gray.300', 'gray.600');
  const inputPlaceholder = useColorModeValue('gray.400', 'gray.500');

  const bgGradient = useColorModeValue(
    'linear(to-r, saiyan.500, dragon.500)',
    'linear(to-br, saiyan.700, dragon.700)'
  );

  // Load initial data
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAnimeList());
  }, [dispatch]);

  // Fetch products when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    setSearchParams(params);
    
    dispatch(fetchProducts(localFilters));
  }, [localFilters, dispatch, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setLocalFilters({
      search: '',
      category: '',
      anime: '',
      minPrice: '',
      maxPrice: '',
      sort: '-createdAt',
    });
  };

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A to Z' },
    { value: '-name', label: 'Name: Z to A' },
    { value: '-rating', label: 'Highest Rated' },
  ];

  const categoryLabels = {
    figures: 'Figures',
    posters: 'Posters',
    clothing: 'Clothing',
    accessories: 'Accessories',
    collectibles: 'Collectibles',
    books: 'Books',
    electronics: 'Electronics',
    'home-decor': 'Home Decor',
  };

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
              <Heading
                size="xl"
                bgGradient={bgGradient}
                bgClip="text"
                color="transparent"
                fontFamily="Orbitron"
                letterSpacing="wider"
              >
                ANIME PRODUCTS
              </Heading>
              <Text color={cardText} maxW="600px" fontSize="lg">
                Discover amazing anime merchandise from your favorite series. 
                Filter by category, anime, or search for specific items.
              </Text>
            </VStack>
          </MotionBox>

          {/* Filters and Search */}
          <Box
            bg={cardBg}
            borderRadius="xl"
            p={6}
            boxShadow="lg"
            border="1px"
            borderColor={borderColor}
          >
            <VStack spacing={6}>
              {/* Search Bar */}
              <HStack w="full" spacing={4}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search anime products..."
                    value={localFilters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    size="lg"
                    borderRadius="full"
                    borderColor={inputBorder}
                    bg={inputBg}
                    color={cardTitle}
                    _placeholder={{ color: inputPlaceholder }}
                    _focus={{
                      borderColor: 'saiyan.500',
                      boxShadow: '0 0 0 1px var(--chakra-colors-saiyan-500)',
                      bg: inputBg,
                    }}
                    _hover={{
                      borderColor: 'saiyan.400',
                    }}
                  />
                </InputGroup>
                
                {/* Mobile Filter Button */}
                <IconButton
                  display={{ base: 'flex', lg: 'none' }}
                  icon={<FiFilter />}
                  onClick={onOpen}
                  aria-label="Open filters"
                  colorScheme="saiyan"
                  borderRadius="full"
                />
              </HStack>

              {/* Desktop Filters */}
              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} w="full" display={{ base: 'none', lg: 'grid' }}>
                {/* Category Filter */}
                <Select
                  value={localFilters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  placeholder="All Categories"
                  size="md"
                  borderRadius="md"
                  borderColor="gray.300"
                  _focus={{
                    borderColor: 'saiyan.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-saiyan-500)',
                  }}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {categoryLabels[category] || category}
                    </option>
                  ))}
                </Select>

                {/* Anime Filter */}
                <Select
                  value={localFilters.anime}
                  onChange={(e) => handleFilterChange('anime', e.target.value)}
                  placeholder="All Anime"
                  size="md"
                  borderRadius="md"
                  borderColor="gray.300"
                  _focus={{
                    borderColor: 'saiyan.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-saiyan-500)',
                  }}
                >
                  {animeList.map((anime) => (
                    <option key={anime} value={anime}>
                      {anime}
                    </option>
                  ))}
                </Select>

                {/* Price Range */}
                <HStack spacing={2}>
                  <Input
                    placeholder="Min Price"
                    value={localFilters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    size="md"
                    type="number"
                    borderRadius="md"
                    borderColor="gray.300"
                    _focus={{
                      borderColor: 'saiyan.500',
                      boxShadow: '0 0 0 1px var(--chakra-colors-saiyan-500)',
                    }}
                  />
                  <Text>-</Text>
                  <Input
                    placeholder="Max Price"
                    value={localFilters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    size="md"
                    type="number"
                    borderRadius="md"
                    borderColor="gray.300"
                    _focus={{
                      borderColor: 'saiyan.500',
                      boxShadow: '0 0 0 1px var(--chakra-colors-saiyan-500)',
                    }}
                  />
                </HStack>

                {/* Sort */}
                <Select
                  value={localFilters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  size="md"
                  borderRadius="md"
                  borderColor="gray.300"
                  _focus={{
                    borderColor: 'saiyan.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-saiyan-500)',
                  }}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </SimpleGrid>

              {/* Clear Filters */}
              {(localFilters.category || localFilters.anime || localFilters.minPrice || localFilters.maxPrice || localFilters.search) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  colorScheme="saiyan"
                  _hover={{
                    bg: 'saiyan.50',
                  }}
                >
                  Clear All Filters
                </Button>
              )}
            </VStack>
          </Box>

          {/* Results Info */}
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Text color="gray.600" fontWeight="medium">
              {loading ? 'Loading...' : `${pagination.totalProducts} products found`}
            </Text>
            
            {/* Active Filters */}
            <HStack spacing={2} wrap="wrap">
              {localFilters.category && (
                <Badge colorScheme="ki" variant="subtle" fontWeight="semibold">
                  Category: {categoryLabels[localFilters.category]}
                </Badge>
              )}
              {localFilters.anime && (
                <Badge colorScheme="saiyan" variant="subtle" fontWeight="semibold">
                  Anime: {localFilters.anime}
                </Badge>
              )}
              {localFilters.search && (
                <Badge colorScheme="dragon" variant="subtle" fontWeight="semibold">
                  Search: {localFilters.search}
                </Badge>
              )}
            </HStack>
          </Flex>

          {/* Products Grid */}
          {loading ? (
            <Box textAlign="center" py={20}>
              <Spinner size="xl" color="saiyan.500" thickness="4px" />
              <Text mt={4} color="gray.600" fontSize="lg">Loading anime products...</Text>
            </Box>
          ) : error ? (
            <Alert status="error" borderRadius="xl" bg="dragon.50" borderColor="dragon.200">
              <AlertIcon />
              {error}
            </Alert>
          ) : products.length === 0 ? (
            <Box textAlign="center" py={20}>
              <Text fontSize="lg" color="gray.600" mb={4}>
                No anime products found
              </Text>
              <Text color="gray.500">
                Try adjusting your filters or search terms
              </Text>
            </Box>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
              {products.map((product, index) => (
                <MotionBox
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </MotionBox>
              ))}
            </SimpleGrid>
          )}

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <Flex justify="center" mt={8}>
              <HStack spacing={2}>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="saiyan"
                  isDisabled={!pagination.hasPrev}
                  _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: 'md',
                  }}
                  transition="all 0.2s"
                >
                  Previous
                </Button>
                <Text color="gray.600" fontWeight="medium">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </Text>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="saiyan"
                  isDisabled={!pagination.hasNext}
                  _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: 'md',
                  }}
                  transition="all 0.2s"
                >
                  Next
                </Button>
              </HStack>
            </Flex>
          )}
        </VStack>
      </Container>

      {/* Mobile Filter Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <Text
              fontSize="lg"
              fontWeight="bold"
              bgGradient="linear(to-r, saiyan.600, dragon.600)"
              bgClip="text"
            >
              Filters
            </Text>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={6} align="stretch">
              {/* Category Filter */}
              <Box>
                <Text fontWeight="semibold" mb={2}>Category</Text>
                <Select
                  value={localFilters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  placeholder="All Categories"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {categoryLabels[category] || category}
                    </option>
                  ))}
                </Select>
              </Box>

              {/* Anime Filter */}
              <Box>
                <Text fontWeight="semibold" mb={2}>Anime</Text>
                <Select
                  value={localFilters.anime}
                  onChange={(e) => handleFilterChange('anime', e.target.value)}
                  placeholder="All Anime"
                >
                  {animeList.map((anime) => (
                    <option key={anime} value={anime}>
                      {anime}
                    </option>
                  ))}
                </Select>
              </Box>

              {/* Price Range */}
              <Box>
                <Text fontWeight="semibold" mb={2}>Price Range</Text>
                <HStack spacing={2}>
                  <Input
                    placeholder="Min Price"
                    value={localFilters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    type="number"
                  />
                  <Text>-</Text>
                  <Input
                    placeholder="Max Price"
                    value={localFilters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    type="number"
                  />
                </HStack>
              </Box>

              {/* Sort */}
              <Box>
                <Text fontWeight="semibold" mb={2}>Sort By</Text>
                <Select
                  value={localFilters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Box>

              <Divider />

              {/* Clear Filters */}
              {(localFilters.category || localFilters.anime || localFilters.minPrice || localFilters.maxPrice || localFilters.search) && (
                <Button
                  variant="outline"
                  colorScheme="saiyan"
                  onClick={handleClearFilters}
                  w="full"
                >
                  Clear All Filters
                </Button>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Products; 