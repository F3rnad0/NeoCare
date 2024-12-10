import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createClient } from '@supabase/supabase-js';

// Conexión a Supabase
const supabaseUrl = 'https://tebiyjoxxrnlplzaxuco.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlYml5am94eHJubHBsemF4dWNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjI3Mzg5NywiZXhwIjoyMDQxODQ5ODk3fQ.dbzRiTYsMlijrHPqhLZg-GNoCYUmH3EBwNDxvN1hMX4';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function HistorialConsultas({ navigation, route }) {
  const id_paciente = (route.params).id_paciente || {};
  console.log('Id Historial:', id_paciente);
  const [citasCompletadas, setCitasCompletadas] = useState([]);

  // Función para obtener las citas completadas de la base de datos
  const fetchCitasCompletadas = async () => {
    const { data, error } = await supabase
      .from('consultas')
      .select('id_consulta, fecha_consulta, motivo, status')
      .eq('id_paciente', id_paciente)
      .eq('status', 'Completada')
      .order('fecha_consulta', { ascending: false }); // Ordenar por fecha descendente

    if (error) {
      console.error('Error al obtener las citas:', error);
    } else {
      setCitasCompletadas(data); // Guardar las citas completadas en el estado
    }
  };

  useEffect(() => {
    fetchCitasCompletadas(); // Obtener las citas cuando se carga la pantalla
  }, []);

  // Función para formatear la fecha
  const formatDate = (date) => {
    const newDate = new Date(date);
    return `${newDate.getDate()}/${
      newDate.getMonth() + 1
    }/${newDate.getFullYear()}`;
  };

  // Renderizado de cada cita en la lista
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('VerConsulta', { id_consulta: item.id_consulta })
      } // Navega a VerConsulta pasando el id
    >
      <View style={styles.iconContainer}>
        <Icon name="calendar" size={24} color="#4C956C" />{' '}
        {/* Cambio aquí para usar Icon */}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.dateText}>{formatDate(item.fecha_consulta)}</Text>
        <Text style={styles.motivoText}>{item.motivo}</Text>
        <Text style={[styles.statusText, { color: '#4C956C' }]}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backIcon}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Historial de Consultas</Text>
      </View>

      <FlatList
        data={citasCompletadas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_consulta.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F0F0',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  backIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C3B1E1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    color: '#7D5BA6',
  },
  motivoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusText: {
    fontSize: 14,
    marginTop: 5,
    color: '#4C956C',
  },
});
