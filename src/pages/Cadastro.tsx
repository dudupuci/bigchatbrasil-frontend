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
    Select,
    Textarea,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import UserTypeCard from '../components/UserTypeCard';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

type UserType = 'cliente' | 'empresa';

const Cadastro = () => {
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [sexo, setSexo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [cpfCnpj, setCpfCnpj] = useState('');
    const [telefone, setTelefone] = useState('');
    const [sobre, setSobre] = useState('');
    const [razaoSocial, setRazaoSocial] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userType, setUserType] = useState<UserType>('cliente');
    const { colorMode } = useColorMode();
    const toast = useToast();
    const navigate = useNavigate();

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
        // Validações básicas
        if (userType === 'cliente') {
            if (!nome || !sobrenome || !email || !password || !confirmPassword || !cpfCnpj || !telefone) {
                toast({
                    title: 'Campos obrigatórios',
                    description: 'Por favor, preencha todos os campos obrigatórios.',
                    status: 'warning',
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }
        } else {
            if (!razaoSocial || !cnpj || !email || !password || !confirmPassword || !telefone) {
                toast({
                    title: 'Campos obrigatórios',
                    description: 'Por favor, preencha todos os campos obrigatórios.',
                    status: 'warning',
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }
        }

        if (password !== confirmPassword) {
            toast({
                title: 'Senhas não conferem',
                description: 'A senha e a confirmação devem ser iguais.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);

        try {
            if (userType === 'cliente') {
                await authService.registrarCliente({
                    nome,
                    sobrenome,
                    sexo,
                    email,
                    cpf_cnpj: cpfCnpj,
                    senha: password,
                    confirmacao_senha: confirmPassword,
                    telefone,
                    sobre,
                });
            } else {
                await authService.registrarEmpresa({
                    razao_social: razaoSocial,
                    cnpj,
                    telefone,
                    email,
                    senha: password,
                    confirmacao_senha: confirmPassword,
                });
            }

            toast({
                title: 'Cadastro realizado!',
                description: `Bem-vindo(a)! Agora você pode fazer login.`,
                status: 'success',
                duration: 4000,
                isClosable: true,
            });
            navigate('/auth/login');
        } catch (error) {
            toast({
                title: 'Erro no cadastro',
                description: error instanceof Error ? error.message : 'Erro ao realizar cadastro',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
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
                        {userType === 'cliente' ? (
                            <>
                                <FormControl isRequired>
                                    <FormLabel>Nome</FormLabel>
                                    <Input
                                        type="text"
                                        placeholder="Seu nome"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        size="lg"
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Sobrenome</FormLabel>
                                    <Input
                                        type="text"
                                        placeholder="Seu sobrenome"
                                        value={sobrenome}
                                        onChange={(e) => setSobrenome(e.target.value)}
                                        size="lg"
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Sexo</FormLabel>
                                    <Select
                                        placeholder="Selecione"
                                        value={sexo}
                                        onChange={(e) => setSexo(e.target.value)}
                                        size="lg"
                                    >
                                        <option value="MASCULINO">Masculino</option>
                                        <option value="FEMININO">Feminino</option>
                                        <option value="OUTRO">Outro</option>
                                    </Select>
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>CPF/CNPJ</FormLabel>
                                    <Input
                                        type="text"
                                        placeholder="000.000.000-00"
                                        value={cpfCnpj}
                                        onChange={(e) => setCpfCnpj(e.target.value)}
                                        size="lg"
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        type="email"
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        size="lg"
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Telefone</FormLabel>
                                    <Input
                                        type="tel"
                                        placeholder="(00) 00000-0000"
                                        value={telefone}
                                        onChange={(e) => setTelefone(e.target.value)}
                                        size="lg"
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Sobre você</FormLabel>
                                    <Textarea
                                        placeholder="Conte um pouco sobre você..."
                                        value={sobre}
                                        onChange={(e) => setSobre(e.target.value)}
                                        size="lg"
                                        rows={3}
                                    />
                                </FormControl>
                            </>
                        ) : (
                            <>
                                <FormControl isRequired>
                                    <FormLabel>Razão Social</FormLabel>
                                    <Input
                                        type="text"
                                        placeholder="Nome da sua empresa"
                                        value={razaoSocial}
                                        onChange={(e) => setRazaoSocial(e.target.value)}
                                        size="lg"
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>CNPJ</FormLabel>
                                    <Input
                                        type="text"
                                        placeholder="00.000.000/0000-00"
                                        value={cnpj}
                                        onChange={(e) => setCnpj(e.target.value)}
                                        size="lg"
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        type="email"
                                        placeholder="contato@empresa.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        size="lg"
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Telefone</FormLabel>
                                    <Input
                                        type="tel"
                                        placeholder="(00) 0000-0000"
                                        value={telefone}
                                        onChange={(e) => setTelefone(e.target.value)}
                                        size="lg"
                                    />
                                </FormControl>
                            </>
                        )}

                        <FormControl isRequired>
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

                        <FormControl isRequired>
                            <FormLabel>Confirme sua Senha</FormLabel>
                            <InputGroup size="lg">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                            <Link color="brand.500" fontWeight="bold" onClick={() => navigate('/auth/login')}>
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
