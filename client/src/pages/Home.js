import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Grid,
  GridItem,
  Stack,
  VStack,
  HStack,
  Badge,
  Image,
  Flex,
  useColorModeValue,
  SimpleGrid,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorMode,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiStar, FiTruck, FiShield, FiGift, FiZap, FiArrowRight } from 'react-icons/fi';
import { FaDragon, FaFire, FaHeart, FaRocket } from 'react-icons/fa';

import { fetchFeaturedProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionHStack = motion(HStack);

const Home = () => {
  const dispatch = useDispatch();
  const { featuredProducts, loading } = useSelector((state) => state.product);
  const { colorMode } = useColorMode();

  const featuredBg = useColorModeValue('gray.50', 'gray.900');
  const sectionBg = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardText = useColorModeValue('gray.600', 'gray.300');
  const cardTitle = useColorModeValue('gray.800', 'gray.100');

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  const bgGradient = useColorModeValue(
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)'
  );

  const categories = [
    {
      name: 'Figures',
      description: 'Collectible anime figures',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400',
      path: '/products?category=figures',
      color: 'anime.pink',
      icon: FaDragon,
      gradient: 'linear-gradient(135deg, #ff6b9d 0%, #f093fb 100%)',
    },
    {
      name: 'Posters',
      description: 'High-quality anime posters',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      path: '/products?category=posters',
      color: 'anime.blue',
      icon: FiZap,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      name: 'Clothing',
      description: 'Anime-inspired apparel',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      path: '/products?category=clothing',
      color: 'anime.purple',
      icon: FaFire,
      gradient: 'linear-gradient(135deg, #a855f7 0%, #f093fb 100%)',
    },
    {
      name: 'Accessories',
      description: 'Anime merchandise accessories',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      path: '/products?category=accessories',
      color: 'anime.indigo',
      icon: FiStar,
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    },
  ];

  const features = [
    {
      icon: FiStar,
      title: 'Premium Quality',
      description: 'Handpicked anime merchandise from top brands',
      color: 'anime.pink',
      gradient: 'linear-gradient(135deg, #ff6b9d 0%, #f093fb 100%)',
    },
    {
      icon: FiTruck,
      title: 'Fast Shipping',
      description: 'Free shipping on orders over ₹5000',
      color: 'anime.blue',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      icon: FiShield,
      title: 'Secure Payment',
      description: '100% secure payment processing',
      color: 'anime.purple',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #f093fb 100%)',
    },
    {
      icon: FiGift,
      title: 'Gift Cards',
      description: 'Perfect gifts for anime fans',
      color: 'anime.indigo',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bgGradient={bgGradient}
        color="white"
        py={20}
        position="relative"
        overflow="hidden"
        minH="100vh"
        display="flex"
        alignItems="center"
      >
        {/* Animated Background Elements */}
        <Box
          position="absolute"
          top="10%"
          left="10%"
          w="200px"
          h="200px"
          borderRadius="full"
          bg="rgba(255, 255, 255, 0.1)"
          animation="float 6s ease-in-out infinite"
        />
        <Box
          position="absolute"
          top="60%"
          right="15%"
          w="150px"
          h="150px"
          borderRadius="full"
          bg="rgba(255, 255, 255, 0.1)"
          animation="float 8s ease-in-out infinite reverse"
        />
        
        <Container maxW="1200px">
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center">
            <MotionVStack
              align="flex-start"
              spacing={8}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Heading
                as="h2"
                size="lg"
                fontWeight="extrabold"
                letterSpacing="wider"
                fontFamily="Orbitron, Poppins, sans-serif"
                color="white"
                mb={2}
                textTransform="uppercase"
              >
                SAIYANKRAFT
              </Heading>
              
              <VStack align="flex-start" spacing={6}>
                <Heading
                  as="h1"
                  size="2xl"
                  fontWeight="black"
                  lineHeight="1.2"
                  fontFamily="Poppins"
                  letterSpacing="wider"
                >
                  UNLEASH YOUR
                  <Text
                    as="span"
                    display="block"
                    bgGradient="linear(to-r, #ffd700, #ff6b9d)"
                    bgClip="text"
                    color="transparent"
                    fontSize="4xl"
                    fontWeight="900"
                  >
                    ANIME PASSION
                  </Text>
                  WITH PREMIUM MERCHANDISE
                </Heading>
                
                <Text fontSize="xl" opacity={0.9} maxW="500px" lineHeight="1.6">
                  From legendary figures to epic clothing, we bring your favorite anime 
                  characters to life with premium quality merchandise that every fan deserves.
                </Text>
              </VStack>
              
              <MotionHStack spacing={6} whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <Button
                  size="lg"
                  variant="gradient"
                  _hover={{
                    transform: 'translateY(-3px)',
                    boxShadow: 'xl',
                  }}
                  transition="all 0.3s"
                  as={Link}
                  to="/products"
                  leftIcon={<FaRocket />}
                  rightIcon={<FiArrowRight />}
                >
                  Shop Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  borderColor="white"
                  color="white"
                  _hover={{ 
                    bg: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-3px)',
                  }}
                  transition="all 0.3s"
                  as={Link}
                  to="/products"
                >
                  Browse Categories
                </Button>
              </MotionHStack>
            </MotionVStack>
            
            <MotionBox
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              display={{ base: 'none', lg: 'block' }}
            >
              <Box
                position="relative"
                w="full"
                h="500px"
                borderRadius="3xl"
                overflow="hidden"
                boxShadow="2xl"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(255, 107, 157, 0.8), rgba(168, 85, 247, 0.8))',
                  opacity: 0.8,
                  zIndex: 1,
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                  alt="Anime Merchandise"
                  w="full"
                  h="full"
                  objectFit="cover"
                  position="relative"
                  zIndex={0}
                />
              </Box>
            </MotionBox>
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      <Box py={20} bg={sectionBg}>
        <Container maxW="1200px">
          <MotionVStack
            spacing={16}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <MotionVStack
              spacing={4}
              textAlign="center"
              variants={itemVariants}
            >
              <Heading
                size="2xl"
                fontFamily="Poppins"
                bgGradient="linear(to-r, anime.pink, anime.purple)"
                bgClip="text"
                fontWeight="900"
              >
                EXPLORE CATEGORIES
              </Heading>
              <Text color={cardText} maxW="600px" fontSize="lg">
                Discover amazing anime merchandise across different categories
              </Text>
            </MotionVStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
              {categories.map((category, index) => (
                <MotionBox
                  key={category.name}
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to={category.path}>
                    <Box
                      bg={cardBg}
                      borderRadius="2xl"
                      overflow="hidden"
                      boxShadow="xl"
                      transition="all 0.3s"
                      _hover={{
                        transform: 'translateY(-10px)',
                        boxShadow: '2xl',
                      }}
                      position="relative"
                      group
                    >
                      <Box position="relative" h="250px" overflow="hidden">
                        <Image
                          src={category.image}
                          alt={category.name}
                          w="full"
                          h="full"
                          objectFit="cover"
                          transition="transform 0.3s"
                          _groupHover={{ transform: 'scale(1.1)' }}
                        />
                        <Box
                          position="absolute"
                          top={0}
                          left={0}
                          right={0}
                          bottom={0}
                          bgGradient={category.gradient}
                          opacity={0.8}
                        />
                        <Box
                          position="absolute"
                          top="50%"
                          left="50%"
                          transform="translate(-50%, -50%)"
                          color={cardTitle}
                          textAlign="center"
                        >
                          <category.icon size={50} />
                          <Text fontSize="xl" fontWeight="bold" mt={3} fontFamily="Poppins">
                            {category.name}
                          </Text>
                        </Box>
                      </Box>
                      <Box p={6}>
                        <Text color={cardText} fontSize="sm" textAlign="center">
                          {category.description}
                        </Text>
                      </Box>
                    </Box>
                  </Link>
                </MotionBox>
              ))}
            </SimpleGrid>
          </MotionVStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20} bg={sectionBg}>
        <Container maxW="1200px">
          <MotionVStack
            spacing={16}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <MotionVStack
              spacing={4}
              textAlign="center"
              variants={itemVariants}
            >
              <Heading
                size="2xl"
                fontFamily="Poppins"
                bgGradient="linear(to-r, anime.pink, anime.purple)"
                bgClip="text"
                fontWeight="900"
              >
                WHY CHOOSE SAIYANKRAFT?
              </Heading>
              <Text color={cardText} maxW="600px" fontSize="lg">
                We provide the ultimate anime shopping experience
              </Text>
            </MotionVStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
              {features.map((feature, index) => (
                <MotionBox
                  key={feature.title}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <VStack spacing={6} textAlign="center" p={8} bg={cardBg} borderRadius="2xl">
                    <Box
                      w={20}
                      h={20}
                      borderRadius="full"
                      bgGradient={feature.gradient}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color={cardTitle}
                      boxShadow="lg"
                    >
                      <feature.icon size={32} />
                    </Box>
                    <VStack spacing={3}>
                      <Heading size="md" color={cardTitle} fontFamily="Poppins">
                        {feature.title}
                      </Heading>
                      <Text color={cardText} fontSize="sm" lineHeight="1.6">
                        {feature.description}
                      </Text>
                    </VStack>
                  </VStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </MotionVStack>
        </Container>
      </Box>

      {/* Featured Products Section */}
      {!loading && featuredProducts.length > 0 && (
        <Box py={20} bg={featuredBg}>
          <Container maxW="1200px">
            <MotionVStack
              spacing={16}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <MotionVStack
                spacing={4}
                textAlign="center"
                variants={itemVariants}
              >
                <Heading
                  size="2xl"
                  fontFamily="Poppins"
                  bgGradient="linear(to-r, anime.pink, anime.purple)"
                  bgClip="text"
                  fontWeight="900"
                >
                  FEATURED PRODUCTS
                </Heading>
                <Text color={cardText} maxW="600px" fontSize="lg">
                  Handpicked anime merchandise for true fans
                </Text>
              </MotionVStack>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full" justifyItems="center">
                {(() => {
                  const productsToShow = featuredProducts.slice(0, 8);
                  const items = productsToShow.map((product) => (
                    <MotionBox
                      key={product._id}
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </MotionBox>
                  ));
                  // If fewer than 4, add sample product cards
                  if (productsToShow.length > 0 && productsToShow.length < 4) {
                    const emptyCount = 4 - productsToShow.length;
                    const sampleProducts = [
                      {
                        _id: 'sample-1',
                        name: 'One Piece Luffy Figure',
                        category: 'Figures',
                        anime: 'One Piece',
                        price: 1299,
                        discount: 15,
                        images: ['https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'],
                        ratings: { average: 4.8, count: 120 },
                        isFeatured: true,
                        stock: 10,
                      },
                      {
                        _id: 'sample-2',
                        name: 'Attack on Titan Poster',
                        category: 'Posters',
                        anime: 'Attack on Titan',
                        price: 499,
                        discount: 10,
                        images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80'],
                        ratings: { average: 4.7, count: 80 },
                        isFeatured: true,
                        stock: 20,
                      },
                      {
                        _id: 'sample-3',
                        name: 'My Hero Academia T-shirt',
                        category: 'Clothing',
                        anime: 'My Hero Academia',
                        price: 799,
                        discount: 20,
                        images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80'],
                        ratings: { average: 4.6, count: 60 },
                        isFeatured: true,
                        stock: 15,
                      },
                    ];
                    for (let i = 0; i < emptyCount; i++) {
                      const sample = sampleProducts[i % sampleProducts.length];
                      items.push(
                        <MotionBox
                          key={`sample-${i}`}
                          variants={itemVariants}
                          whileHover={{ y: -5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ProductCard product={sample} />
                        </MotionBox>
                      );
                    }
                  }
                  return items;
                })()}
              </SimpleGrid>

              <MotionBox
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  size="lg"
                  variant="gradient"
                  as={Link}
                  to="/products"
                  leftIcon={<FaDragon />}
                  rightIcon={<FiArrowRight />}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  View All Products
                </Button>
              </MotionBox>
            </MotionVStack>
          </Container>
        </Box>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </Box>
  );
};

export default Home; 