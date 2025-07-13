import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Stack,
  Text,
  Link as ChakraLink,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.400');
  const hoverColor = useColorModeValue('anime.primary', 'anime.accent');
  const footerBg = useColorModeValue('white', 'gray.900');
  const dividerColor = useColorModeValue('gray.200', 'gray.700');
  const bottomTextColor = useColorModeValue('gray.600', 'gray.400');
  const sectionHeadingColor = useColorModeValue('gray.800', 'white');

  return (
    <Box
      bg={footerBg}
      borderTop="1px"
      borderColor={dividerColor}
      mt="auto"
    >
      <Container maxW="1200px" py={8}>
        <Stack spacing={8} direction={{ base: 'column', md: 'row' }} justify="space-between">
          {/* Company Info */}
          <Stack spacing={4} maxW="300px">
            <Box>
              <Text
                fontSize="xl"
                fontWeight="bold"
                bgGradient="linear(to-r, anime.primary, anime.secondary)"
                bgClip="text"
              >
                Anime Store
              </Text>
            </Box>
            <Text fontSize="sm" color="gray.600" lineHeight="tall">
              Your ultimate destination for premium anime merchandise. 
              From figures to clothing, we bring your favorite anime to life.
            </Text>
            <Stack direction="row" spacing={4}>
              <ChakraLink href="#" color={linkColor} _hover={{ color: hoverColor }}>
                <FaTwitter size={20} />
              </ChakraLink>
              <ChakraLink href="#" color={linkColor} _hover={{ color: hoverColor }}>
                <FaFacebook size={20} />
              </ChakraLink>
              <ChakraLink href="#" color={linkColor} _hover={{ color: hoverColor }}>
                <FaInstagram size={20} />
              </ChakraLink>
              <ChakraLink href="#" color={linkColor} _hover={{ color: hoverColor }}>
                <FaYoutube size={20} />
              </ChakraLink>
            </Stack>
          </Stack>

          {/* Quick Links */}
          <Stack spacing={4} minW="200px">
            <Text fontWeight="bold" fontSize="lg" color={sectionHeadingColor}>
              Quick Links
            </Text>
            <Stack spacing={2}>
              <Link to="/">
                <Text color={linkColor} _hover={{ color: hoverColor }} transition="color 0.2s">
                  Home
                </Text>
              </Link>
              <Link to="/products">
                <Text color={linkColor} _hover={{ color: hoverColor }} transition="color 0.2s">
                  Products
                </Text>
              </Link>
              <Link to="/cart">
                <Text color={linkColor} _hover={{ color: hoverColor }} transition="color 0.2s">
                  Cart
                </Text>
              </Link>
              <Link to="/profile">
                <Text color={linkColor} _hover={{ color: hoverColor }} transition="color 0.2s">
                  Profile
                </Text>
              </Link>
            </Stack>
          </Stack>

          {/* Categories */}
          <Stack spacing={4} minW="200px">
            <Text fontWeight="bold" fontSize="lg" color={sectionHeadingColor}>
              Categories
            </Text>
            <Stack spacing={2}>
              <Link to="/products?category=figures">
                <Text color={linkColor} _hover={{ color: hoverColor }} transition="color 0.2s">
                  Figures
                </Text>
              </Link>
              <Link to="/products?category=posters">
                <Text color={linkColor} _hover={{ color: hoverColor }} transition="color 0.2s">
                  Posters
                </Text>
              </Link>
              <Link to="/products?category=clothing">
                <Text color={linkColor} _hover={{ color: hoverColor }} transition="color 0.2s">
                  Clothing
                </Text>
              </Link>
              <Link to="/products?category=accessories">
                <Text color={linkColor} _hover={{ color: hoverColor }} transition="color 0.2s">
                  Accessories
                </Text>
              </Link>
            </Stack>
          </Stack>

          {/* Support */}
          <Stack spacing={4} minW="200px">
            <Text fontWeight="bold" fontSize="lg" color={sectionHeadingColor}>
              Support
            </Text>
            <Stack spacing={2}>
              <ChakraLink href="#" color={linkColor} _hover={{ color: hoverColor }}>
                Contact Us
              </ChakraLink>
              <ChakraLink href="#" color={linkColor} _hover={{ color: hoverColor }}>
                Shipping Info
              </ChakraLink>
              <ChakraLink href="#" color={linkColor} _hover={{ color: hoverColor }}>
                Returns
              </ChakraLink>
              <ChakraLink href="#" color={linkColor} _hover={{ color: hoverColor }}>
                FAQ
              </ChakraLink>
            </Stack>
          </Stack>
        </Stack>

        <Divider my={8} />

        {/* Bottom Section */}
        <Stack
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          spacing={4}
        >
          <Text fontSize="sm" color={bottomTextColor}>
            © 2024 Anime Store. All rights reserved.
          </Text>
          <Stack direction="row" spacing={6} fontSize="sm">
            <ChakraLink href="#" color={linkColor} _hover={{ color: hoverColor }}>
              Privacy Policy
            </ChakraLink>
            <ChakraLink href="#" color={linkColor} _hover={{ color: hoverColor }}>
              Terms of Service
            </ChakraLink>
            <ChakraLink href="#" color={linkColor} _hover={{ color: hoverColor }}>
              Cookie Policy
            </ChakraLink>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer; 