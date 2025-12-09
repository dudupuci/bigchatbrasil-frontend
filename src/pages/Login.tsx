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
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { TipoUsuario } from '../types';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>(TipoUsuario.CLIENTE);
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
    
    try {
      const response = await authService.login({
        email,
        senha: password,
        tipo: tipoUsuario,
      });

      // Criar objeto de usuário com os dados retornados pelo backend
      const user = {
        id: response.id,
        nome: response.nome,
        email: response.email,
        tipo: response.tipo,
      };

      login(user, response.sessionId);
      
      toast({
        title: 'Login realizado!',
        description: 'Bem-vindo de volta.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/home');
    } catch (error) {
      toast({
        title: 'Erro no login',
        description: error instanceof Error ? error.message : 'Credenciais inválidas',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
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
              <FormLabel>Tipo de Usuário</FormLabel>
              <RadioGroup
                value={tipoUsuario}
                onChange={(value) => setTipoUsuario(value as TipoUsuario)}
              >
                <Stack direction="row" spacing={4}>
                  <Radio value={TipoUsuario.CLIENTE} colorScheme="brand">
                    Cliente
                  </Radio>
                  <Radio value={TipoUsuario.EMPRESA} colorScheme="brand">
                    Empresa
                  </Radio>
                </Stack>
              </RadioGroup>
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
