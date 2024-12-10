import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Conexión a Supabase
const supabaseUrl = 'https://tebiyjoxxrnlplzaxuco.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlYml5am94eHJubHBsemF4dWNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjI3Mzg5NywiZXhwIjoyMDQxODQ5ODk3fQ.dbzRiTYsMlijrHPqhLZg-GNoCYUmH3EBwNDxvN1hMX4';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function IngresoManual({ navigation, route }) {
  const id_paciente = route.params.id || '';
  const [frecuencia, setFrecuencia] = useState('');
  const [saturacion, setSaturacion] = useState('');
  const [presion, setPresion] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [glicemia, setGlicemia] = useState('');

  const sendData = async () => {
    try {
      console.log(id_paciente);
      const { data, error: insertError } = await supabase
        .from('signos_vitales')
        .insert([
          {
            id_paciente: id_paciente,
            frecuencia_cardiaca: frecuencia,
            saturacion_oxigeno: saturacion,
            presion_arterial: presion,
            temperatura: temperatura,
            glicemia: glicemia,
          },
        ])
        .select();

      if (insertError) {
        console.error('No se insertaron los signos en la tabla: ', insertError);
        return;
      }

      console.log('Signos registrados, exitosamente:', data);
    } catch (e) {
      console.error('Error al insertar el registro de signos: ', e);
    }
  };

  const generarNotificacion = async () => {
    try {
      const idm = await AsyncStorage.getItem('id_medico');
      const { data, error: insertError } = await supabase
        .from('notificaciones')
        .insert([
          {
            id_paciente: id_paciente,
            id_medico: idm,
            titulo_notificacion: '¡Signos Anormales Registrados!',
            contenido_notificacion:
              'Parece que: Claudia, Ha registrado valores anormales en sus signos vitales \nRevísalo, por favor!',
          },
        ])
        .select();

      if (insertError) {
        console.error('No se guardó la notificación: ', insertError);
        return;
      }

      console.log('Notificación Signo Anormal creada:', data);
    } catch (e) {
      console.error('Error en generarNotificacion(): ', e);
    }
  };

  const handleSave = () => {
    if (!frecuencia || !saturacion) {
      Alert.alert('Error', 'Por favor ingresa los valores obligatorios.');
      return;
    }
    sendData();
    if (
      parseFloat(frecuencia) > 100 ||
      parseFloat(frecuencia) < 60 ||
      parseFloat(saturacion) < 89
    ) {
      Alert.alert(
        'Vaya...',
        'Un valor nos llamó la atención, Cuéntanos cómo te sientes...'
      );
      generarNotificacion();
      navigation.navigate('FormularioRara');
      return;
    }
    Alert.alert(
      'Medición guardada',
      'Se han guardado los valores ingresados correctamente.'
    );
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingreso Manual de Signos</Text>

      {/* Campo Frecuencia Cardiaca */}
      <Text style={styles.label}>Frecuencia Cardiaca (ppm) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ejemplo: 80"
        keyboardType="numeric"
        value={frecuencia}
        onChangeText={setFrecuencia}
      />

      {/* Campo Saturación de Oxígeno */}
      <Text style={styles.label}>Saturación de Oxígeno (%) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ejemplo: 95"
        keyboardType="numeric"
        value={saturacion}
        onChangeText={setSaturacion}
      />

      {/* Campo Presión Arterial */}
      <Text style={styles.label}>Presión Arterial (mmHg)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ejemplo: 120/80"
        value={presion}
        onChangeText={setPresion}
      />

      {/* Campo Temperatura */}
      <Text style={styles.label}>Temperatura (°C)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ejemplo: 36.5"
        keyboardType="numeric"
        value={temperatura}
        onChangeText={setTemperatura}
      />

      {/* Campo Glicemia */}
      <Text style={styles.label}>Glicemia (mg/dL)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ejemplo: 100"
        keyboardType="numeric"
        value={glicemia}
        onChangeText={setGlicemia}
      />

      {/* Botón Guardar */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0', // Blanco hueso
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#7D5BA6', // Lavanda oscuro
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#4C956C', // Verde oscuro
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A8D5BA', // Verde menta
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#A8D5BA', // Verde menta
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
});
