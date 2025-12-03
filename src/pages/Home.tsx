import { useState, useEffect } from 'react';
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

interface Contact {
  id: string;
  nome: string;
  email: string;
  ultimaMensagem?: string;
  timestamp?: string;
  naoLidas?: number;
  isOnline?: boolean;
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

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Simular dados de contatos baseado no tipo de usuário
    if (user?.tipo === 'cliente') {
      setContacts([
        {
          id: '1',
          nome: 'Tech Solutions LTDA',
          email: 'contato@techsolutions.com',
          ultimaMensagem: 'Olá! Como podemos ajudar?',
          timestamp: '10:30',
          naoLidas: 2,
          isOnline: true,
        },
        {
          id: '2',
          nome: 'Mega Store',
          email: 'atendimento@megastore.com',
          ultimaMensagem: 'Produto disponível em estoque',
          timestamp: 'Ontem',
          naoLidas: 0,
          isOnline: false,
        },
        {
          id: '3',
          nome: 'Fast Delivery',
          email: 'suporte@fastdelivery.com',
          ultimaMensagem: 'Seu pedido foi enviado',
          timestamp: '2d atrás',
          naoLidas: 1,
          isOnline: true,
        },
      ]);
    } else {
      setContacts([
        {
          id: '1',
          nome: 'João Silva',
          email: 'joao@email.com',
          ultimaMensagem: 'Qual o prazo de entrega?',
          timestamp: '11:45',
          naoLidas: 1,
          isOnline: true,
        },
        {
          id: '2',
          nome: 'Maria Santos',
          email: 'maria@email.com',
          ultimaMensagem: 'Obrigada pelo atendimento!',
          timestamp: 'Ontem',
          naoLidas: 0,
          isOnline: false,
        },
        {
          id: '3',
          nome: 'Pedro Costa',
          email: 'pedro@email.com',
          ultimaMensagem: 'Gostaria de um orçamento',
          timestamp: '2d atrás',
          naoLidas: 3,
          isOnline: true,
        },
      ]);
    }
  }, [isAuthenticated, navigate, user]);

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

  const handleAddContact = () => {
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

    // Simular adição de contato
    const newContact: Contact = {
      id: Date.now().toString(),
      nome: newContactEmail.split('@')[0],
      email: newContactEmail,
      isOnline: false,
    };

    setContacts([...contacts, newContact]);
    setNewContactEmail('');
    onClose();

    toast({
      title: 'Contato adicionado!',
      description: `${newContact.nome} foi adicionado à sua lista.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
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
                {user?.tipo === 'cliente' ? 'Empresas' : 'Clientes'}
              </Heading>
              <SearchBar
                placeholder={user?.tipo === 'cliente' ? 'Buscar empresas...' : 'Buscar clientes...'}
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
                      : user?.tipo === 'cliente'
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
                {user?.tipo === 'cliente' ? 'Adicionar Empresa' : 'Adicionar Cliente'}
              </Button>
            </Box>
          </VStack>
        </GridItem>

        {/* Área de Chat */}
        <GridItem display={{ base: showChatOnMobile ? 'block' : 'none', md: 'block' }}>
          {selectedContact ? (
            <ChatWindow
              contactName={selectedContact.nome}
              onBack={handleBackToList}
              showBackButton={true}
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
                  Selecione {user?.tipo === 'cliente' ? 'uma empresa' : 'um cliente'} para começar a conversar
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
            {user?.tipo === 'cliente' ? 'Adicionar Nova Empresa' : 'Adicionar Novo Cliente'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Input
                placeholder={user?.tipo === 'cliente' ? 'Email da empresa' : 'Email do cliente'}
                value={newContactEmail}
                onChange={(e) => setNewContactEmail(e.target.value)}
                type="email"
              />
              <Button colorScheme="blue" w="100%" onClick={handleAddContact}>
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
