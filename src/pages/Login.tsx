import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useColorMode,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { colorMode } = useColorMode();
  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha email e senha.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    // Simulação de login - aqui você conectaria com sua API
    setTimeout(() => {
      setIsLoading(false);
      
      // Simular usuário baseado no email
      const userType = email.includes('empresa') ? 'empresa' : 'cliente';
      
      login({
        id: '1',
        nome: email.split('@')[0],
        email: email,
        tipo: userType,
      });
      
      toast({
        title: 'Login realizado!',
        description: 'Bem-vindo de volta.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/home');
    }, 1500);
  };

  const handleMockLogin = (tipo: 'cliente' | 'empresa') => {
    const mockUser = tipo === 'cliente' 
      ? {
          id: '1',
          nome: 'João Cliente',
          email: 'cliente@teste.com',
          tipo: 'cliente' as const,
        }
      : {
          id: '2',
          nome: 'Tech Solutions',
          email: 'empresa@teste.com',
          tipo: 'empresa' as const,
        };

    login(mockUser);
    
    toast({
      title: 'Login realizado!',
      description: `Bem-vindo como ${tipo}!`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate('/home');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'}
      px={4}
    >
      <AuthCard>
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading size="xl" mb={2} color="brand.500">
              BigChatBrasil
            </Heading>
            <Text color="gray.500">
                Conecte-se e comece a conversar!
            </Text>
          </Box>

          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                size="lg"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Senha</FormLabel>
              <InputGroup size="lg">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    size="sm"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
              colorScheme="brand"
              size="lg"
              width="full"
              onClick={handleLogin}
              isLoading={isLoading}
            >
              Entrar
            </Button>

            <Box pt={2} w="full">
              <Text fontSize="sm" color="gray.500" textAlign="center" mb={2}>
                Acesso rápido para testes:
              </Text>
              <VStack spacing={2}>
                <Button
                  size="sm"
                  width="full"
                  variant="outline"
                  colorScheme="blue"
                  onClick={() => handleMockLogin('cliente')}
                >
                  Entrar como Cliente
                </Button>
                <Button
                  size="sm"
                  width="full"
                  variant="outline"
                  colorScheme="green"
                  onClick={() => handleMockLogin('empresa')}
                >
                  Entrar como Empresa
                </Button>
              </VStack>
            </Box>
          </VStack>

          <Box textAlign="center">
            <Text color="gray.500">
              Não tem uma conta?{' '}
              <Link color="brand.500" fontWeight="bold" onClick={() => navigate('/cadastro')}>
                Cadastre-se
              </Link>
            </Text>
          </Box>
        </VStack>
      </AuthCard>
    </Box>
  );
};

export default Login;
