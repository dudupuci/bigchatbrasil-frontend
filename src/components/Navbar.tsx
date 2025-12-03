import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useColorMode,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Circle,
  Text,
  VStack,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, HamburgerIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box
      bg={colorMode === 'dark' ? 'gray.800' : 'white'}
      px={4}
      borderBottom="1px"
      borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <HStack spacing={8} alignItems="center">
          <Heading size="md" color="blue.500">
            BCB Chat
          </Heading>
        </HStack>

        <HStack spacing={3}>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
            onClick={toggleColorMode}
            variant="ghost"
          />

          <Menu>
            <MenuButton as={Button} variant="ghost" cursor="pointer" minW={0}>
              <HStack spacing={2}>
                <Circle size="32px" bg="blue.500" color="white" fontWeight="bold" fontSize="sm">
                  {user?.nome[0].toUpperCase()}
                </Circle>
                <VStack display={{ base: 'none', md: 'flex' }} alignItems="flex-start" spacing={0}>
                  <Text fontSize="sm" fontWeight="bold">
                    {user?.nome}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {user?.tipo === 'cliente' ? 'Cliente' : 'Empresa'}
                  </Text>
                </VStack>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem>Meu Perfil</MenuItem>
              <MenuItem>Configurações</MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleLogout} color="red.500">
                Sair
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
