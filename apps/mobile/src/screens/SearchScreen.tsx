import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';

interface Props {
  navigation: any;
}

export default function SearchScreen({ navigation }: Props) {
  const [tail, setTail] = useState('');

  const searchAircraft = async () => {
    if (!tail) {
      Alert.alert('Please enter a tail number');
      return;
    }
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/aircraft/${tail}/summary`);
      if (!response.ok) {
        Alert.alert('Aircraft not found');
        return;
      }
      const data = await response.json();
      navigation.navigate('TailSummary', { summary: data.summary, tail: data.tail });
    } catch (error) {
      console.error(error);
      Alert.alert('Error fetching data');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter tail number (e.g., N123AB)"
        autoCapitalize="characters"
        value={tail}
        onChangeText={setTail}
      />
      <Button title="Search" onPress={searchAircraft} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
});
