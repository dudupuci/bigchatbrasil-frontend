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
    useRadioGroup,
    Stack,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import UserTypeCard from '../components/UserTypeCard';
import { useAuth } from '../contexts/AuthContext';

type UserType = 'cliente' | 'empresa';

const Cadastro = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userType, setUserType] = useState<UserType>('cliente');
    const { colorMode } = useColorMode();
    const toast = useToast();
    const navigate = useNavigate();
    const { login } = useAuth();

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'userType',
        defaultValue: 'cliente',
        onChange: (value) => setUserType(value as UserType),
    });

    const group = getRootProps();

    const userTypes = [
        {
            value: 'cliente',
            title: 'Cadastrar como Cliente',
            description:
                'Você poderá conversar e tirar dúvidas sobre produtos com as empresas que quiser em chat online',
        },
        {
            value: 'empresa',
            title: 'Cadastrar como Empresa',
            description:
                'Você poderá gerenciar seus clientes e tirar dúvidas deles sobre produtos, preços e prazos de entrega',
        },
    ];

    const handleCadastro = async () => {
        if (!nome || !email || !password) {
            toast({
                title: 'Campos obrigatórios',
                description: 'Por favor, preencha todos os campos.',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);
        // Simulação de cadastro - aqui você conectaria com sua API
        setTimeout(() => {
            setIsLoading(false);
            
            login({
                id: Date.now().toString(),
                nome: nome,
                email: email,
                tipo: userType,
            });
            
            toast({
                title: 'Cadastro realizado!',
                description: `Bem-vindo(a), ${nome}! Você se cadastrou como ${userType === 'cliente' ? 'Cliente' : 'Empresa'
                    }.`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            navigate('/home');
        }, 1000);
    };

    return (
        <Box
            minH="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'}
            px={4}
            py={8}
        >
            <AuthCard maxW="2xl">
                <VStack spacing={6} align="stretch">
                    <Box textAlign="center">
                        <Heading size="xl" mb={2} color="brand.500">
                            Criar Conta
                        </Heading>
                        <Text color="gray.500">
                            Escolha o tipo de conta e comece a usar
                        </Text>
                    </Box>

                    <Box>
                        <Text fontWeight="bold" mb={3}>
                            Tipo de Conta
                        </Text>
                        <Stack {...group} spacing={3}>
                            {userTypes.map((type) => {
                                const radio = getRadioProps({ value: type.value });
                                return (
                                    <UserTypeCard
                                        key={type.value}
                                        title={type.title}
                                        description={type.description}
                                        {...radio}
                                    />
                                );
                            })}
                        </Stack>
                    </Box>

                    <VStack spacing={4}>
                        <FormControl>
                            <FormLabel>Nome {userType === 'empresa' ? 'da Empresa' : 'Completo'}</FormLabel>
                            <Input
                                type="text"
                                placeholder={
                                    userType === 'empresa' ? 'Nome da sua empresa' : 'Seu nome completo'
                                }
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                size="lg"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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

                        <FormControl>
                            <FormLabel>Confirme sua Senha</FormLabel>
                            <InputGroup size="lg">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                            onClick={handleCadastro}
                            isLoading={isLoading}
                        >
                            Criar Conta
                        </Button>
                    </VStack>

                    <Box textAlign="center">
                        <Text color="gray.500">
                            Já tem uma conta?{' '}
                            <Link color="brand.500" fontWeight="bold" onClick={() => navigate('/login')}>
                                Faça login
                            </Link>
                        </Text>
                    </Box>
                </VStack>
            </AuthCard>
        </Box>
    );
};

export default Cadastro;
