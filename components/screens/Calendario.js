import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Conexión a Supabase
const supabaseUrl = 'https://tebiyjoxxrnlplzaxuco.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlYml5am94eHJubHBsemF4dWNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjI3Mzg5NywiZXhwIjoyMDQxODQ5ODk3fQ.dbzRiTYsMlijrHPqhLZg-GNoCYUmH3EBwNDxvN1hMX4';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function CalendarioScreen({ navigation }) {
  const [id_paciente, setid_paciente] = useState('');
  const [id_medico, setid_medico] = useState('');
  const [selectedDate, setSelectedDate] = useState(null); // Guarda la fecha seleccionada
  const [citas, setCitas] = useState({});

  // Función para obtener las consultas
  const fetchConsultas = async () => {
    const idp = await AsyncStorage.getItem('id_paciente');
    const idm = await AsyncStorage.getItem('id_medico');
    setid_paciente(idp);
    setid_medico(idm);
    const { data, error } = await supabase
      .from('consultas')
      .select('*')
      .eq('id_paciente', idp);

    if (error) {
      console.error('Error fetching consultas:', error);
    } else {
      const consultasFormatted = {};
      data.forEach((consulta) => {
        const date = consulta.fecha_consulta;
        if (!consultasFormatted[date]) {
          consultasFormatted[date] = [];
        }
        consultasFormatted[date].push({
          id_consulta: consulta.id_consulta, // Agregamos el ID de la consulta
          time: consulta.hora_consulta,
          title: consulta.motivo,
          status: consulta.status,
        });
      });
      setCitas(consultasFormatted);
    }
  };

  // Cargar las consultas cuando el componente se monta o cuando se vuelve a la pantalla
  useEffect(() => {
    fetchConsultas(); // Cargar consultas cuando el componente se monta

    const focusListener = navigation.addListener('focus', () => {
      fetchConsultas(); // Vuelve a cargar las consultas cuando se regresa a la pantalla de Calendario
    });

    // Limpieza del listener al desmontar la pantalla
    return focusListener;
  }, [navigation]);

  // Función para marcar las fechas con citas y la fecha seleccionada
  const getMarkedDates = () => {
    const markedDates = {};

    // Marcamos las fechas con citas
    Object.keys(citas).forEach((date) => {
      markedDates[date] = { marked: true, dotColor: '#4C956C' }; // Solo el punto para las citas
    });

    // Si hay una fecha seleccionada, la resaltamos
    if (selectedDate) {
      markedDates[selectedDate] = {
        selected: true,
        selectedColor: '#4C956C', // Color de selección del día
        selectedTextColor: '#FFF', // Color del texto de la fecha seleccionada
        marked: markedDates[selectedDate]?.marked,
      };
    }

    return markedDates;
  };

  // Maneja el evento de selección de día
  const handleDayPress = (day) => {
    const date = day.dateString;
    if (selectedDate === date) {
      setSelectedDate(null); // Si el día ya está seleccionado, lo desmarcamos
    } else {
      setSelectedDate(date); // Establecer la nueva fecha seleccionada
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pendiente':
        return { color: '#FFA500' };
      case 'Completada':
        return { color: '#4C956C' };
      case 'Urgente':
        return { color: '#FF0000' };
      default:
        return { color: '#000000' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CALENDARIO</Text>
        <TouchableOpacity style={styles.profileIcon}>
          <Icon name="account-circle" size={40} color="gray" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={getMarkedDates()}
          theme={{
            todayTextColor: '#4C956C',
            selectedDayBackgroundColor: '#4C956C',
            arrowColor: '#7D5BA6',
          }}
        />

        <View style={styles.eventContainer}>
          {selectedDate && citas[selectedDate]
            ? citas[selectedDate].map((cita, index) => (
                <View key={index} style={styles.eventCard}>
                  <TouchableOpacity
                    style={styles.eventContent}
                    onPress={() =>
                      navigation.navigate('VerConsulta', {
                        id_consulta: cita.id_consulta,
                      })
                    }>
                    <Text style={styles.eventDate}>Fecha: {selectedDate}</Text>
                    <Text
                      style={[styles.eventTime, getStatusStyle(cita.status)]}>
                      Hora: {cita.time}
                    </Text>
                    <Text style={styles.eventTitle}>Motivo: {cita.title}</Text>
                    <Text
                      style={[styles.eventStatus, getStatusStyle(cita.status)]}>
                      Estado: {cita.status}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.editIcon}
                    onPress={() =>
                      navigation.navigate('VerConsulta', {
                        id_consulta: cita.id_consulta,
                      })
                    }>
                    <Icon
                      name="square-edit-outline"
                      size={24}
                      color="#7D5BA6"
                    />
                  </TouchableOpacity>
                </View>
              ))
            : selectedDate && (
                <View style={styles.eventCard}>
                  <Text style={styles.eventDate}>{selectedDate}</Text>
                  <Text style={styles.noCitas}>
                    No hay citas para esta fecha
                  </Text>
                </View>
              )}
        </View>
      </ScrollView>
      // AQUI VA EL CHAT BUTON
      {/* Botón flotante para navegar a Solicitar Consulta */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('SolicitarConsulta', {id_paciente, id_medico})}>
        <Icon name="plus" size={44} color="white" />
      </TouchableOpacity>
      {/* Botón para navegar al Historial de Citas */}
      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate('HistorialConsultas', {id_paciente})}>
        <Icon name="history" size={24} color="white" />
        <Text style={styles.historyButtonText}>Historial de Consultas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 20,
  },
  profileIcon: {
    padding: 5,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  eventContainer: {
    marginTop: 20,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C3B1E1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    position: 'relative',
  },
  eventContent: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  eventDate: {
    color: '#7D5BA6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventTime: {
    color: '#4C956C',
    fontSize: 14,
    marginBottom: 10,
    marginTop: 10,
  },
  eventTitle: {
    color: '#333333',
    fontSize: 14,
    marginBottom: 10,
  },
  eventStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noCitas: {
    color: '#FF0000',
    fontSize: 16,
    fontStyle: 'italic',
  },
  editIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    backgroundColor: '#C3B1E1',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  historyButton: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    backgroundColor: '#4C956C',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
