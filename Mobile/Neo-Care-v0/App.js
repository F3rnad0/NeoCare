import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default function App() {
  const [KEY, setKEY] = useState('');

  const handleLogin = async () => {
    if (KEY === '') {
      Alert.alert(
        'Error',
        'Por favor ingresa la clave que te otorgó tu médico'
      );
      return;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenida</Text>
      <Text style={styles.info}>
        Ingresa la Clave que te proporcionó tu Médico
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Clave Paciente"
        value={KEY}
        onChangeText={setKEY}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Vamos a Iniciar!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'start',
    padding: 20,
    backgroundColor: '#FEFEFE',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
    color: '#7D5BA6',
  },
  info: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'start',
  },
  input: {
    height: 45,
    borderColor: '#4C956C',
    borderWidth: 1.5,
    marginBottom: 50,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 15,
  },
  logo: {
    height: 175,
    width: 150,
    alignSelf: 'center',
    marginBottom: 25,
  },
  button: {
    backgroundColor: '#A8D5BA',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 100,
  },
  buttonText: {
    color: '#7D5BA6',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
