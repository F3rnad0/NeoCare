import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createClient } from '@supabase/supabase-js';

// Conexión a Supabase
const supabaseUrl = 'https://tebiyjoxxrnlplzaxuco.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlYml5am94eHJubHBsemF4dWNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjI3Mzg5NywiZXhwIjoyMDQxODQ5ODk3fQ.dbzRiTYsMlijrHPqhLZg-GNoCYUmH3EBwNDxvN1hMX4';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function SolicitarConsulta({ navigation, route }) {
  const data = route.params || {};
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [motivo, setMotivo] = useState('Chequeo General');
  const [observaciones, setObservaciones] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [navigateToConsulta, setNavigateToConsulta] = useState(null); // Estado para controlar la navegación

  const id_paciente = data.id_paciente;
  const id_medico = data.id_medico;

  const formatDateToLocalString = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchAvailableTimes = async (date) => {
    const formattedDate = formatDateToLocalString(date);
    const allTimes = [];
    for (let hour = 8; hour < 17; hour++) {
      allTimes.push(`${hour.toString().padStart(2, '0')}:00`);
    }

    try {
      const { data: consultas, error } = await supabase
        .from('consultas')
        .select('hora_consulta')
        .eq('fecha_consulta', formattedDate)
        .eq('id_medico', id_medico);

      if (error) {
        console.error('Error fetching consultas:', error);
        setModalMessage('Error al obtener horarios disponibles.');
        setIsError(true);
        setShowModal(true);
        return;
      }

      const occupiedTimes = consultas.map((consulta) =>
        consulta.hora_consulta.trim()
      );
      const available = allTimes.filter(
        (time) => !occupiedTimes.includes(time)
      );
      setAvailableTimes(available);
    } catch (err) {
      console.error('Error fetching available times:', err);
      setModalMessage('Error al obtener horarios. Inténtelo de nuevo.');
      setIsError(true);
      setShowModal(true);
    }
  };

  const handleDateSelection = async (event, selected) => {
    setShowDatePicker(false);

    if (selected) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selected < today) {
        setModalMessage(
          'Fecha no válida. No puedes seleccionar una fecha anterior a la actual.'
        );
        setIsError(true);
        setShowModal(true);
        return;
      }

      setSelectedDate(selected);
      setSelectedTime('');
      await fetchAvailableTimes(selected);
    }
  };

  const handleSolicitar = async () => {
    const formattedDate = formatDateToLocalString(selectedDate);
    const formattedTime = selectedTime;

    if (
      !formattedDate ||
      !formattedTime ||
      !motivo.trim() ||
      !observaciones.trim()
    ) {
      setModalMessage('Complete todos los campos antes de continuar.');
      setIsError(true);
      setShowModal(true);
      return;
    }

    try {
      const { data: existingConsulta, error: consultaError } = await supabase
        .from('consultas')
        .select('*')
        .eq('fecha_consulta', formattedDate)
        .eq('hora_consulta', formattedTime)
        .eq('id_medico', id_medico);

      if (consultaError) {
        console.error('Error al verificar consulta existente:', consultaError);
        setModalMessage('Error al verificar la disponibilidad del horario.');
        setIsError(true);
        setShowModal(true);
        return;
      }

      if (existingConsulta && existingConsulta.length > 0) {
        setModalMessage(
          'Ya hay una consulta en este día y hora. Por favor, elija otro horario.'
        );
        setIsError(true);
        setShowModal(true);
        return;
      }

      const { data: insertedConsulta, error: insertError } = await supabase
        .from('consultas')
        .insert([
          {
            fecha_consulta: formattedDate,
            hora_consulta: formattedTime,
            id_paciente,
            id_medico,
            motivo,
            observaciones,
            status: 'Pendiente',
          },
        ])
        .select();

      if (insertError) {
        console.error('Error al registrar consulta:', insertError);
        setModalMessage(
          `Error al registrar la consulta: ${insertError.message}`
        );
        setIsError(true);
        setShowModal(true);
        return;
      }

      setModalMessage('Consulta registrada correctamente.');
      setNavigateToConsulta(insertedConsulta[0]); // Guarda la consulta para navegar después
      setIsError(false);
      setShowModal(true);
    } catch (err) {
      console.error('Error al solicitar consulta:', err);
      setModalMessage('Ocurrió un error inesperado. Inténtelo de nuevo.');
      setIsError(true);
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (navigateToConsulta) {
      // Navega pasando solo el ID de la consulta
      navigation.navigate('VerConsulta', {
        id_consulta: navigateToConsulta.id_consulta,
      });
      setNavigateToConsulta(null); // Resetea el estado
    }
  };

  const showDatepicker = () => setShowDatePicker(true);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backIcon}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Solicitar Consulta</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Fecha</Text>
        <TouchableOpacity style={styles.input} onPress={showDatepicker}>
          <Text>{formatDateToLocalString(selectedDate)}</Text>
          <Icon name="calendar" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateSelection}
        />
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Hora</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowTimePicker(true)}>
          <Text>{selectedTime || 'Seleccione una hora'}</Text>
          <Icon name="clock-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Modal visible={showTimePicker} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.timePickerContainer}>
              <FlatList
                data={availableTimes}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => {
                      setSelectedTime(item);
                      setShowTimePicker(false);
                    }}>
                    <Text style={styles.timeButtonText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowTimePicker(false)}>
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.section}>
        <Text style={styles.label}>Motivo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese el motivo de la consulta"
          value={motivo}
          onChangeText={setMotivo}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Comentarios</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Agregar texto"
          value={observaciones}
          onChangeText={setObservaciones}
          multiline
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSolicitar}>
        <Text style={styles.buttonText}>Solicitar</Text>
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {isError ? (
              <Icon name="alert-circle" size={50} color="#FF0000" />
            ) : (
              <Icon name="check-circle" size={50} color="#4CAF50" />
            )}
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={[
                styles.modalButton,
                { backgroundColor: isError ? '#FF0000' : '#4CAF50' },
              ]}
              onPress={handleModalClose}>
              <Text style={styles.modalButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginTop: 45,
  },
  backIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#4C956C',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#4C956C',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(195, 177, 225, 0.45)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4C956C',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#4C956C',
    marginTop: 30,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  timePickerContainer: {
    width: '100%', // Ocupar todo el ancho disponible
    alignItems: 'center', // Centra las horas dentro de este contenedor
    justifyContent: 'center', // Asegura que las horas estén centradas verticalmente
  },
  timeButton: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#4C956C',
    alignItems: 'center',
    width: '100%',
  },
  timeButtonText: {
    fontSize: 24,
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center', // Centra el texto dentro del botón
  },
});
