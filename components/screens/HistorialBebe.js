import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { createClient } from '@supabase/supabase-js';

// Conexión a Supabase
const supabaseUrl = 'https://tebiyjoxxrnlplzaxuco.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlYml5am94eHJubHBsemF4dWNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjI3Mzg5NywiZXhwIjoyMDQxODQ5ODk3fQ.dbzRiTYsMlijrHPqhLZg-GNoCYUmH3EBwNDxvN1hMX4';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function HistorialBebe({ navigation, route }) {
  const id_paciente = (route.params).id_paciente || {};
  console.log('Id Historial:', id_paciente);
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos desde Supabase
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('frecuencia_cardiaca_fetal')
          .select('frecuencia_fetal, metodo_medicion, zona, fecha_registro'); // Seleccionamos zona también

        if (error) {
          Alert.alert('Error', 'No se pudieron cargar los datos.');
        } else {
          const datosFormateados = data.map((item) => ({
            fecha: item.fecha_registro,
            fhr: item.frecuencia_fetal,
            metodo: item.metodo_medicion,
            zona: item.zona, // Agregamos el campo zona
          }));
          setDatos(datosFormateados);
        }
      } catch (error) {
        Alert.alert(
          'Error inesperado',
          'Hubo un problema al cargar los datos.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, []);

  // Función para asignar color según la zona
  const getZonaColor = (zona) => {
    switch (zona) {
      case 'Baja':
      case 'Alta':
        return '#FFEB3B'; // Amarillo
      case 'Muy alta':
      case 'Muy baja':
        return '#F44336'; // Rojo
      case 'Normal':
        return '#4CAF50'; // Verde
      default:
        return '#000'; // Negro en caso de que no sea ninguno de los anteriores
    }
  };

  return (
    <View style={styles.container}>
    <Text style={styles.header}>{'Historial de tu bebé'}</Text>

      {/* Mostrar indicador de carga mientras se obtienen los datos */}
      {loading ? (
        <ActivityIndicator size="large" color="#4C956C" />
      ) : (
        <>
          {/* Encabezado de la tabla */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Fecha</Text>
            <Text style={styles.tableHeaderText}>FHR</Text>
            <Text style={styles.tableHeaderText}>Zona</Text>{' '}
            <Text style={styles.tableHeaderText}>Método</Text>
          </View>

          {/* Lista de datos */}
          <FlatList
            data={datos}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.fecha || 'Sin datos'}</Text>
                <Text style={styles.tableCell}>{item.fhr || 'Sin datos'}</Text>
                <Text
                  style={[
                    styles.tableCell,
                    { color: getZonaColor(item.zona) }, // Aplicar color según zona
                  ]}
                >
                  {item.zona || 'Sin zona'}
                </Text>
                <Text style={styles.tableCell}>
                  {item.metodo || 'Sin método'}
                </Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#4C956C',
    padding: 8,
    borderRadius: 5,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 8,
    marginVertical: 4,
    borderRadius: 5,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    color: '#4C956C',
  },
});
