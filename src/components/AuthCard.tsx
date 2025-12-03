import { Box, BoxProps, useColorMode } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface AuthCardProps extends BoxProps {
  children: ReactNode;
}

const AuthCard = ({ children, ...props }: AuthCardProps) => {
  const { colorMode } = useColorMode();

  return (
    <Box
      bg={colorMode === 'dark' ? 'gray.800' : 'white'}
      p={8}
      borderRadius="xl"
      boxShadow="xl"
      w="full"
      maxW="md"
      {...props}
    >
      {children}
    </Box>
  );
};

export default AuthCard;