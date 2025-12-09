import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  GridItem,
  VStack,
  Heading,
  Text,
  Button,
  useColorMode,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  useToast,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ChatListItem from '../components/ChatListItem';
import ChatWindow from '../components/ChatWindow';
import SearchBar from '../components/SearchBar';
import {
  buscarUsuarioPorEmail,
  listarConversas,
  Conversa as ConversaAPI,
  Usuario,
} from '../services/mensagemService';

interface Contact {
  id: string;
  idNumerico: number;
  tipo: 'CLIENTE' | 'EMPRESA';
  nome: string;
  email: string;
  ultimaMensagem?: string;
  timestamp?: string;
  naoLidas?: number;
  isOnline?: boolean;
  conversaId?: string;
}

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Carrega as conversas do backend
  const carregarConversas = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await listarConversas();

      const conversasFormatadas: Contact[] = response.conversas.map((conv: ConversaAPI) => ({
        id: conv.conversaId,
        idNumerico: conv.outroUsuarioId,
        tipo: conv.outroUsuarioTipo,
        nome: conv.outroUsuarioNome,
        email: '', // Email não vem na listagem de conversas
        ultimaMensagem: conv.ultimaMensagem,
        timestamp: formatarDataHora(conv.ultimaMensagemDataHora),
        naoLidas: conv.mensagensNaoLidas,
        isOnline: false, // Não temos status de online ainda
        conversaId: conv.conversaId,
      }));

      setContacts(conversasFormatadas);
    } catch (error: any) {
      console.error('Erro ao carregar conversas:', error);
      // Remove toast para evitar re-renders no polling
    } finally {
      setIsLoading(false);
    }
  }, []); // Remove todas as dependências para evitar re-renders

  const formatarDataHora = (dataHora: string): string => {
    const data = new Date(dataHora);
    const agora = new Date();
    const diffMs = agora.getTime() - data.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDias === 0) {
      return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDias === 1) {
      return 'Ontem';
    } else if (diffDias < 7) {
      return `${diffDias}d atrás`;
    } else {
      return data.toLocaleDateString('pt-BR');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Carrega conversas ao montar o componente
    carregarConversas();

    // Atualiza a lista a cada 10 segundos (polling reduzido para evitar travamento)
    const interval = setInterval(carregarConversas, 10000);

    return () => clearInterval(interval);
  }, [isAuthenticated, navigate, carregarConversas]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      setFilteredContacts(
        contacts.filter((contact) =>
          contact.nome.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, contacts]);

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setShowChatOnMobile(true);
  };

  const handleBackToList = () => {
    setShowChatOnMobile(false);
    setSelectedContact(null);
  };

  const handleAddContact = async () => {
    if (!newContactEmail.trim()) {
      toast({
        title: 'Email obrigatório',
        description: 'Por favor, informe o email.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);

      // Busca o usuário pelo email
      const usuario: Usuario = await buscarUsuarioPorEmail(newContactEmail);

      // Verifica se não está tentando adicionar a si mesmo
      if (usuario.id === user?.id && usuario.tipo === user?.tipo) {
        toast({
          title: 'Erro',
          description: 'Você não pode iniciar uma conversa consigo mesmo.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Verifica se já existe uma conversa com esse usuário
      const conversaExistente = contacts.find(c => c.idNumerico === usuario.id);
      if (conversaExistente) {
        toast({
          title: 'Conversa já existe',
          description: `Você já tem uma conversa com ${usuario.nome}.`,
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
        setSelectedContact(conversaExistente);
        onClose();
        return;
      }

      // Cria um novo contato (a conversa será criada ao enviar a primeira mensagem)
      const newContact: Contact = {
        id: `temp-${Date.now()}`, // ID temporário até criar a conversa
        idNumerico: usuario.id,
        tipo: usuario.tipo,
        nome: usuario.nome,
        email: usuario.email,
        isOnline: false,
      };

      setContacts([newContact, ...contacts]);
      setSelectedContact(newContact);
      setNewContactEmail('');
      onClose();

      toast({
        title: 'Contato adicionado!',
        description: `${usuario.nome} foi adicionado. Envie uma mensagem para iniciar a conversa.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

    } catch (error: any) {
      console.error('Erro ao buscar usuário:', error);
      toast({
        title: 'Usuário não encontrado',
        description: error.message || 'Não foi possível encontrar um usuário com este email.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'}>
      <Navbar />

      <Grid
        templateColumns={{ base: '1fr', md: '350px 1fr' }}
        h="calc(100vh - 64px)"
        gap={0}
      >
        {/* Lista de Contatos */}
        <GridItem
          bg={colorMode === 'dark' ? 'gray.800' : 'white'}
          borderRight="1px"
          borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
          display={{ base: showChatOnMobile ? 'none' : 'block', md: 'block' }}
        >
          <VStack h="100%" spacing={0} align="stretch">
            <Box p={4} borderBottom="1px" borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}>
              <Heading size="md" mb={4}>
                {user?.tipo === 'CLIENTE' ? 'Empresas' : 'Clientes'}
              </Heading>
              <SearchBar
                placeholder={user?.tipo === 'CLIENTE' ? 'Buscar empresas...' : 'Buscar clientes...'}
                value={searchTerm}
                onChange={setSearchTerm}
              />
            </Box>

            <VStack flex={1} overflowY="auto" spacing={1} p={2} align="stretch">
              {filteredContacts.length === 0 ? (
                <Box p={8} textAlign="center">
                  <Text color="gray.500">
                    {searchTerm
                      ? 'Nenhum contato encontrado'
                      : user?.tipo === 'CLIENTE'
                      ? 'Nenhuma empresa na sua lista ainda'
                      : 'Nenhum cliente na sua lista ainda'}
                  </Text>
                </Box>
              ) : (
                filteredContacts.map((contact) => (
                  <ChatListItem
                    key={contact.id}
                    {...contact}
                    onClick={() => handleSelectContact(contact)}
                    isActive={selectedContact?.id === contact.id}
                  />
                ))
              )}
            </VStack>

            <Box p={4} borderTop="1px" borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}>
              <Button leftIcon={<AddIcon />} colorScheme="blue" w="100%" onClick={onOpen}>
                {user?.tipo === 'CLIENTE' ? 'Adicionar Empresa' : 'Adicionar Cliente'}
              </Button>
            </Box>
          </VStack>
        </GridItem>

        {/* Área de Chat */}
        <GridItem display={{ base: showChatOnMobile ? 'block' : 'none', md: 'block' }}>
          {selectedContact ? (
            <ChatWindow
              contactName={selectedContact.nome}
              contactId={selectedContact.idNumerico}
              contactType={selectedContact.tipo}
              conversaId={selectedContact.conversaId}
              onBack={handleBackToList}
              showBackButton={true}
              onConversaCreated={(novoConversaId) => {
                // Atualiza o contato com o conversaId criado
                setContacts(contacts.map(c =>
                  c.id === selectedContact.id
                    ? { ...c, id: novoConversaId, conversaId: novoConversaId }
                    : c
                ));
                setSelectedContact({ ...selectedContact, id: novoConversaId, conversaId: novoConversaId });
              }}
            />
          ) : (
            <Box
              h="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={colorMode === 'dark' ? 'gray.800' : 'white'}
            >
              <VStack spacing={4}>
                <Text fontSize="xl" color="gray.500">
                  Selecione {user?.tipo === 'CLIENTE' ? 'uma empresa' : 'um cliente'} para começar a conversar
                </Text>
              </VStack>
            </Box>
          )}
        </GridItem>
      </Grid>

      {/* Modal Adicionar Contato */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {user?.tipo === 'CLIENTE' ? 'Adicionar Nova Empresa' : 'Adicionar Novo Cliente'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Input
                placeholder={user?.tipo === 'CLIENTE' ? 'Email da empresa' : 'Email do cliente'}
                value={newContactEmail}
                onChange={(e) => setNewContactEmail(e.target.value)}
                type="email"
                isDisabled={isLoading}
              />
              <Button
                colorScheme="blue"
                w="100%"
                onClick={handleAddContact}
                isLoading={isLoading}
                loadingText="Buscando..."
              >
                Adicionar
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Home;
