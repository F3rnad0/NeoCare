import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createClient } from '@supabase/supabase-js';

// Conexión a Supabase
const supabaseUrl = 'https://tebiyjoxxrnlplzaxuco.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlYml5am94eHJubHBsemF4dWNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjI3Mzg5NywiZXhwIjoyMDQxODQ5ODk3fQ.dbzRiTYsMlijrHPqhLZg-GNoCYUmH3EBwNDxvN1hMX4';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function HistorialSignos({ route, navigation }) {
  const id_paciente = route.params || '';

  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const obtenerDatos = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('signos_vitales')
        .select(
          'frecuencia_cardiaca, saturacion_oxigeno, presion_arterial, temperatura, glicemia, fecha_registro'
        )
        .eq('id_paciente', id_paciente)
        .order('fecha_registro', { ascending: false });

      if (error) throw error;

      setDatos(data); // Actualizamos el estado con los datos obtenidos
    } catch (error) {
      setError(error.message);
      console.error('Error al obtener datos de Supabase:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerDatos(); // Llama a la función para obtener los datos
  }, []);

  return (
    <View style={styles.contenedor}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backIcon}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>{' '}
        <Text style={styles.titulo}>Historial de Signos</Text>
      </View>

      {loading ? (
        <Text>Cargando...</Text>
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            {/* Encabezado */}
            <View style={styles.encabezadoTabla}>
              <Text style={[styles.encabezadoTexto, { width: 150 }]}>FC</Text>
              <Text style={[styles.encabezadoTexto, { width: 150 }]}>S.O2</Text>
              <Text style={[styles.encabezadoTexto, { width: 150 }]}>P.A</Text>
              <Text style={[styles.encabezadoTexto, { width: 150 }]}>Temp</Text>
              <Text style={[styles.encabezadoTexto, { width: 150 }]}>
                Glic.
              </Text>
              <Text style={[styles.encabezadoTexto, { width: 200 }]}>
                Fecha
              </Text>
            </View>

            {/* Filas de datos */}
            <ScrollView style={styles.tabla}>
              {datos.map((item, index) => (
                <View key={index} style={styles.fila}>
                  <Text style={[styles.texto, { width: 150 }]}>
                    {item.frecuencia_cardiaca}
                  </Text>
                  <Text style={[styles.texto, { width: 150 }]}>
                    {item.saturacion_oxigeno}
                  </Text>
                  <Text style={[styles.texto, { width: 150 }]}>
                    {item.presion_arterial}
                  </Text>
                  <Text style={[styles.texto, { width: 150 }]}>
                    {item.temperatura}
                  </Text>
                  <Text style={[styles.texto, { width: 150 }]}>
                    {item.glicemia}
                  </Text>
                  <Text style={[styles.texto, { width: 200 }]}>
                    {item.fecha_registro}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 35,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  tabla: {
    flex: 1,
    paddingBottom: 20,
  },
  encabezadoTabla: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#4C956C',
    padding: 15, // Aumentamos el padding para mayor altura
    borderRadius: 5,
    marginBottom: 10,
  },
  encabezadoTexto: {
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    fontSize: 18,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 20, // Aumentamos el padding para mayor altura
    marginVertical: 8, // Separación entre las filas
    borderWidth: 1, // Agregamos un borde para definir mejor cada fila
    borderRadius: 5,
    borderColor: '#C3B1E1',
  },
  texto: {
    textAlign: 'center',
    color: '#333',
    fontSize: 16, // Aumentamos el tamaño de la fuente
  },
});
