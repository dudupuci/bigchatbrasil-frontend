import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Flex,
  Circle,
  IconButton,
  useColorMode,
  useToast,
  Heading,
  Spinner,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';
import {
  listarMensagensDaConversa,
  enviarMensagem,
  Mensagem as MensagemAPI,
  EnviarMensagemRequest,
} from '../services/mensagemService';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
}

interface ChatWindowProps {
  contactName: string;
  contactId: number;
  contactType: 'CLIENTE' | 'EMPRESA';
  conversaId?: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

const ChatWindow = ({
  contactName,
  contactId,
  contactType,
  conversaId,
  onBack,
  showBackButton = false,
}: ChatWindowProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { colorMode } = useColorMode();
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Carrega mensagens da conversa
  const carregarMensagens = useCallback(async () => {
    if (!conversaId) {
      console.log('⚠️ Sem conversaId, limpando mensagens');
      setMessages([]);
      return;
    }

    try {
      if (isInitialLoad) {
        setIsLoading(true);
      }

      console.log('📥 Carregando mensagens da conversa:', conversaId);
      const response = await listarMensagensDaConversa(conversaId);
      console.log('✅ Mensagens recebidas:', response.mensagens.length);

      const mensagensFormatadas: Message[] = response.mensagens.map((msg: MensagemAPI) => ({
        id: msg.id,
        text: msg.conteudo,
        sender: msg.remetenteId === user?.id ? 'me' : 'other',
        timestamp: new Date(msg.momentoEnvio),
      }));

      console.log('📝 Mensagens formatadas:', mensagensFormatadas);
      setMessages(mensagensFormatadas);
      setIsInitialLoad(false);

    } catch (error: any) {
      console.error('❌ Erro ao carregar mensagens:', error);
      setIsInitialLoad(false);
    } finally {
      setIsLoading(false);
    }
  }, [conversaId, user?.id, isInitialLoad]);

  // Reset apenas quando troca de conversa
  useEffect(() => {
    setIsInitialLoad(true);
    setMessages([]);
  }, [conversaId]);

  // Polling separado
  useEffect(() => {
    if (!conversaId) return;

    // Carrega mensagens inicialmente
    carregarMensagens();

    // Polling mais lento (15s) e só se não estiver digitando/enviando
    const interval = setInterval(() => {
      if (!isTyping && !isSending) {
        carregarMensagens();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [conversaId, carregarMensagens, isTyping, isSending]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') {
      toast({
        title: 'Mensagem vazia',
        description: 'Por favor, digite uma mensagem.',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsSending(true);

      const dados: EnviarMensagemRequest = {
        conversaId: conversaId || undefined,
        destinatarioId: contactId,
        tipoDestinatario: contactType,
        conteudo: inputValue,
        tipo: 'CHAT_ONLINE',
        prioridade: 'NENHUMA',
      };

      await enviarMensagem(dados);

      setInputValue('');
      setIsTyping(false);

      toast({
        title: 'Mensagem enviada!',
        status: 'success',
        duration: 1000,
        isClosable: true,
      });

      // Recarrega mensagens imediatamente
      console.log('🔄 Recarregando mensagens após envio...');
      setIsInitialLoad(false); // Não mostra loading
      await carregarMensagens();

    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: 'Erro ao enviar mensagem',
        description: error.message || 'Não foi possível enviar a mensagem.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSending) {
      handleSendMessage();
    }
  };

  return (
    <Flex direction="column" h="100%" bg={colorMode === 'dark' ? 'gray.800' : 'white'} borderRadius="lg">
      {/* Header */}
      <HStack p={4} borderBottom="1px" borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'} spacing={3}>
        {showBackButton && (
          <IconButton
            aria-label="Voltar"
            icon={<ArrowBackIcon />}
            variant="ghost"
            onClick={onBack}
            display={{ base: 'flex', md: 'none' }}
          />
        )}
        <Circle size="40px" bg="blue.500" color="white" fontWeight="bold">
          {contactName[0].toUpperCase()}
        </Circle>
        <Box flex={1}>
          <Heading size="sm">{contactName}</Heading>
          <Text fontSize="xs" color="gray.500">
            {conversaId ? 'Conversa ativa' : 'Nova conversa'}
          </Text>
        </Box>
      </HStack>

      {/* Messages Area */}
      <Box flex={1} overflowY="auto" p={4}>
        {isLoading ? (
          <Flex justify="center" align="center" h="100%">
            <Spinner size="xl" color="blue.500" />
          </Flex>
        ) : (
          <VStack spacing={4} align="stretch">
            {messages.length === 0 ? (
              <Text textAlign="center" color="gray.500" mt={8}>
                {conversaId
                  ? 'Nenhuma mensagem ainda. Comece a conversar!'
                  : 'Envie a primeira mensagem para iniciar a conversa!'}
              </Text>
            ) : (
              messages.map((message) => (
                <Flex key={message.id} justify={message.sender === 'me' ? 'flex-end' : 'flex-start'}>
                  <HStack maxW="70%" spacing={2} flexDirection={message.sender === 'me' ? 'row-reverse' : 'row'}>
                    <Circle size="32px" bg={message.sender === 'me' ? 'blue.500' : 'gray.500'} color="white" fontWeight="bold" fontSize="sm">
                      {message.sender === 'me' ? user?.nome[0].toUpperCase() : contactName[0].toUpperCase()}
                    </Circle>
                    <Box>
                      <Box
                        bg={message.sender === 'me' ? 'blue.500' : colorMode === 'dark' ? 'gray.700' : 'gray.200'}
                        color={message.sender === 'me' ? 'white' : 'inherit'}
                        px={4}
                        py={2}
                        borderRadius="lg"
                      >
                        <Text>{message.text}</Text>
                      </Box>
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        {message.timestamp.toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </Box>
                  </HStack>
                </Flex>
              ))
            )}
            <div ref={messagesEndRef} />
          </VStack>
        )}
      </Box>

      {/* Input Area */}
      <HStack p={4} borderTop="1px" borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'} spacing={3}>
        <Input
          placeholder="Digite sua mensagem..."
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsTyping(true);
          }}
          onBlur={() => setIsTyping(false)}
          onKeyDown={handleKeyPress}
          size="lg"
          variant="filled"
          isDisabled={isSending}
        />
        <Button
          colorScheme="blue"
          onClick={handleSendMessage}
          size="lg"
          px={8}
          isLoading={isSending}
          loadingText="Enviando"
        >
          Enviar
        </Button>
      </HStack>
    </Flex>
  );
};

export default ChatWindow;
