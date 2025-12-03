import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ placeholder = 'Buscar...', value, onChange }: SearchBarProps) => {
  return (
    <InputGroup size="lg">
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.400" />
      </InputLeftElement>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        variant="filled"
        borderRadius="lg"
      />
    </InputGroup>
  );
};

export default SearchBar;
