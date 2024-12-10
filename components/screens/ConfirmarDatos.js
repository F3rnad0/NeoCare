import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Conexión a Supabase
const supabaseUrl = 'https://tebiyjoxxrnlplzaxuco.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlYml5am94eHJubHBsemF4dWNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjI3Mzg5NywiZXhwIjoyMDQxODQ5ODk3fQ.dbzRiTYsMlijrHPqhLZg-GNoCYUmH3EBwNDxvN1hMX4';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ConfirmarDatos({ route, navigation }) {
  const { paciente } = route.params || {};
  const id_paciente = paciente.id_paciente;

  const [nombre, setNombre] = useState(paciente.nombres);
  const [apellido, setApellido] = useState(paciente.apellidos);
  const [fechaNacimiento, setFechaNacimiento] = useState(
    paciente.fecha_nacimiento
  );
  const [direccion, setDireccion] = useState(paciente.direccion);
  const [telefono, setTelefono] = useState(paciente.telefono);
  const [tel_confianza, setTel_confianza] = useState(paciente.tel_confianza);

  const handleConfirmar = async () => {
    try {
      const { data, error } = await supabase
        .from('pacientes')
        .update({
          nombres: nombre,
          apellidos: apellido,
          fecha_nacimiento: fechaNacimiento,
          direccion: direccion,
          telefono: telefono,
          numero_confianza: tel_confianza,
        })
        .eq('id_paciente', id_paciente);

      if (error) {
        throw error;
      }
      console.log('Datos actualizados ID:', id_paciente);
      navigation.navigate('RevisarBebe', { paciente });
    } catch (error) {
      Alert.alert(
        'Error',
        'Hubo un problema al actualizar los datos: ' + error.message
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Confirma tus datos</Text>

      <Text style={styles.label}>Nombre(s)</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre(s)"
        placeholderTextColor="#A7D7C5"
      />

      <Text style={styles.label}>Apellido(s)</Text>
      <TextInput
        style={styles.input}
        value={apellido}
        onChangeText={setApellido}
        placeholder="Apellido(s)"
        placeholderTextColor="#A7D7C5"
      />

      <Text style={styles.label}>Fecha Nacimiento</Text>
      <TextInput
        style={styles.input}
        value={fechaNacimiento}
        onChangeText={setFechaNacimiento}
        placeholder="MM-DD-YYYY"
        placeholderTextColor="#A7D7C5"
      />

      <Text style={styles.label}>Dirección</Text>
      <TextInput
        style={styles.input}
        value={direccion}
        onChangeText={setDireccion}
        placeholder="Dirección"
        placeholderTextColor="#A7D7C5"
      />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        value={telefono}
        onChangeText={setTelefono}
        placeholder="Teléfono"
        placeholderTextColor="#A7D7C5"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Número de confianza</Text>
      <TextInput
        style={styles.input}
        value={tel_confianza}
        onChangeText={setTel_confianza}
        placeholder="Contacto de Emergencia"
        placeholderTextColor="#A7D7C5"
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.button} onPress={handleConfirmar}>
        <Text style={styles.buttonText}>Confirmar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FEFEFE', // Fondo claro
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#7D5BA6', // Lavanda
    marginTop: 30,
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#4C956C', // Verde oscuro
  },
  input: {
    height: 50,
    borderColor: '#A7D7C5', // Verde suave
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#FFF',
    color: '#4C956C',
  },
  button: {
    backgroundColor: '#4C956C', // Verde oscuro
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
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
});
