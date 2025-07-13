import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Box flex="1" as="main">
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout; 