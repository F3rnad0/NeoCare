import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Conexión a Supabase
const supabaseUrl = 'https://tebiyjoxxrnlplzaxuco.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlYml5am94eHJubHBsemF4dWNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjI3Mzg5NywiZXhwIjoyMDQxODQ5ODk3fQ.dbzRiTYsMlijrHPqhLZg-GNoCYUmH3EBwNDxvN1hMX4';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function LoginScreen({ navigation }) {
  const [KEY, setKEY] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const saveIDs = async (idP, idM) => {
    try {
      await AsyncStorage.setItem('id_paciente', idP);
      await AsyncStorage.setItem('id_medico', idM);
    } catch (error) {
      console.error('Error al guardar id_paciente:', error);
    }
  };

  const handleLogin = async () => {
    if (!KEY.trim()) {
      alert('Campo vacío', 'Por favor ingresa la clave proporcionada por tu médico.');
      return;
    }

    try {
      const { data: paciente, error } = await supabase
        .from('pacientes')
        .select()
        .eq('clave_paciente', KEY)
        .single();

      if (error || !paciente) {
        alert('Error', 'Clave incorrecta. Verifica e intenta de nuevo.');
        return;
      }

      // Mostrar modal de éxito
      setModalVisible(true);
      saveIDs(paciente.id_paciente, paciente.id_medico);

      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate('ConfirmarDatos', { paciente });
      }, 2000); // Espera 2 segundos antes de redirigir
    } catch (error) {
      alert('Error', `Ocurrió un problema al verificar la clave.\n${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenida a NeoCare!</Text>
      <Image style={styles.logo} source={require('../../assets/NeoCare.png')} />
      <Text style={styles.info}>
        Ingresa la clave proporcionada por tu médico para acceder a tu
        información.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Clave del Paciente"
        placeholderTextColor="#A7D7C5"
        value={KEY}
        onChangeText={setKEY}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate('Ayuda')}>
        <Text style={styles.linkText}>¿Necesitas ayuda?</Text>
      </TouchableOpacity>

      {/* Modal personalizado */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Image
              style={styles.modalIcon}
              source={require('../../assets/success.webp')} // Icono personalizado
            />
            <Text style={styles.modalText}>¡Bienvenida!</Text>
            <Text style={styles.modalSubtext}>
              Gracias por confiar en NeoCare. Revisaremos tu información.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FEFEFE',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7D5BA6',
    marginBottom: 15,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    color: '#4C956C',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  input: {
    width: '90%',
    height: 50,
    backgroundColor: '#FFF',
    borderColor: '#A7D7C5',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 75,
    backgroundColor: '#51946f',
  },
  button: {
    backgroundColor: '#4C956C',
    width: '90%',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
  },
  linkText: {
    color: '#7D5BA6',
    fontSize: 14,
    fontWeight: '600',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalIcon: {
    width: 60,
    height: 60,
    marginBottom: 15,
  },
  modalText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4C956C',
    textAlign: 'center',
  },
  modalSubtext: {
    fontSize: 16,
    color: '#7D5BA6',
    textAlign: 'center',
    marginTop: 10,
  },
});
