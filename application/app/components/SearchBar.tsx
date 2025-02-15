import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';

interface SearchBarProps {
  data: string[];
  onSelect: (item: string) => void;
  placeholder?: string;
  style?: object;
}

const SearchBar: React.FC<SearchBarProps> = ({
  data,
  onSelect,
  placeholder = 'Search...',
  style = {},
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredData([]);
      setShowDropdown(false);
      return;
    }

    const filtered = data.filter(item =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
    setShowDropdown(filtered.length > 0);
  }, [searchQuery, data]);

  const handleSelect = (item: string) => {
    setSearchQuery(item);
    setShowDropdown(false);
    onSelect(item);
    Keyboard.dismiss();
    // Clear the search after selection
    setTimeout(() => {
      setSearchQuery('');
    }, 100);
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={placeholder}
        placeholderTextColor="#666"
      />
      {showDropdown && (
        <View style={styles.dropdown}>
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.dropdownText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    fontSize: 16,
    marginTop: 20,

  },
  dropdown: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 200,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SearchBar;
