import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createClient } from '@supabase/supabase-js';

// Conexión a Supabase
const supabaseUrl = 'https://tebiyjoxxrnlplzaxuco.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlYml5am94eHJubHBsemF4dWNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjI3Mzg5NywiZXhwIjoyMDQxODQ5ODk3fQ.dbzRiTYsMlijrHPqhLZg-GNoCYUmH3EBwNDxvN1hMX4';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function VerConsulta({ route, navigation }) {
  const { id_consulta } = route.params || {};

  const [consulta, setConsulta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [motivo, setMotivo] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [hora, setHora] = useState('');
  const [peso, setPeso] = useState('');
  const [presionArterial, setPresionArterial] = useState('');
  const [alturaUterina, setAlturaUterina] = useState('');
  const [estadoFetal, setEstadoFetal] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchConsulta = async () => {
      if (!id_consulta) {
        setLoading(false);
        setModalMessage('No se proporcionó un ID válido para cargar la consulta.');
        setIsError(true);
        setShowModal(true);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('consultas')
          .select('*')
          .eq('id_consulta', id_consulta)
          .single(); // Garantiza que solo devuelve una fila

        if (error || !data) {
          setModalMessage('No se encontró la consulta para el ID proporcionado.');
          setIsError(true);
          setShowModal(true);
          return;
        }

        setConsulta(data);
        setMotivo(data.motivo || '');
        setComentarios(data.observaciones || '');
        setHora(data.hora_consulta || '');
        setPeso(data.peso || '');
        setPresionArterial(data.presion_arterial || '');
        setAlturaUterina(data.altura_uterina || '');
        setEstadoFetal(data.estado_fetal || {});
      } catch (err) {
        setModalMessage('Error al cargar los datos de la consulta.');
        setIsError(true);
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchConsulta();

    // Limpieza del estado al desmontar
    return () => {
      setConsulta(null);
      setMotivo('');
      setComentarios('');
      setHora('');
      setPeso('');
      setPresionArterial('');
      setAlturaUterina('');
      setEstadoFetal({});
    };
  }, [id_consulta]);

  const handleSave = async () => {
    if (!consulta?.id_consulta) {
      setModalMessage('No se pudo identificar la consulta para guardar los cambios.');
      setIsError(true);
      setShowModal(true);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('consultas')
        .update({
          motivo,
          observaciones: comentarios,
          peso: peso || null,
          presion_arterial: presionArterial || null,
          altura_uterina: alturaUterina || null,
          estado_fetal: estadoFetal,
        })
        .eq('id_consulta', consulta.id_consulta);

      if (error) {
        setModalMessage('Error al actualizar los datos. Por favor, intente de nuevo.');
        setIsError(true);
      } else {
        setModalMessage('Datos actualizados correctamente.');
        setIsError(false);
      }
    } catch (err) {
      setModalMessage('Ocurrió un error inesperado al guardar los datos.');
      setIsError(true);
    } finally {
      setLoading(false);
      setShowModal(true);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente':
        return '#D8C3A5';
      case 'Negada':
        return '#000000';
      case 'Completada':
        return '#4C956C';
      case 'Urgente':
        return '#FF0000';
      default:
        return '#C3B1E1';
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4C956C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Icon name="arrow-left" size={24} color="#000" style={{ marginTop: 45 }} />
          </TouchableOpacity>
          <Text style={styles.title}>Revisar Consulta</Text>
        </View>

        {consulta ? (
          <View style={styles.section}>
            <Text style={styles.label}>Fecha</Text>
            <Text style={styles.value}>{consulta.fecha_consulta}</Text>

            <Text style={styles.label}>Hora</Text>
            <Text style={styles.value}>{hora || '---'}</Text>

            <Text style={styles.label}>Motivo</Text>
            <TextInput
              style={styles.input}
              value={motivo}
              onChangeText={setMotivo}
              placeholder="Ingrese el motivo de la consulta"
              editable={consulta.status === 'Pendiente'}
            />

            <Text style={styles.sectionLabel}>Mediciones</Text>
            <Text style={styles.label}>Peso (kg)</Text>
            <Text style={styles.value}>{peso || '---'}</Text>

            <Text style={styles.label}>Presión Arterial</Text>
            <Text style={styles.value}>{presionArterial || '---'}</Text>

            <Text style={styles.label}>Altura Uterina</Text>
            <Text style={styles.value}>{alturaUterina || '---'}</Text>

            <Text style={styles.sectionLabel}>Estado Fetal</Text>
            <Text style={styles.label}>Movimiento</Text>
            <Text style={styles.value}>{estadoFetal.Movimiento || '---'}</Text>

            <Text style={styles.label}>Posición</Text>
            <Text style={styles.value}>{estadoFetal.Posición || '---'}</Text>

            <Text style={styles.label}>Frecuencia Cardíaca</Text>
            <Text style={styles.value}>{estadoFetal['Frecuencia Cardiáca'] || '---'}</Text>

            <Text style={styles.label}>Comentarios</Text>
            <TextInput
              style={styles.input}
              value={comentarios}
              onChangeText={setComentarios}
              placeholder="Agregar comentarios adicionales"
              multiline
              editable={consulta.status === 'Pendiente'}
            />

            <View style={[styles.statusContainer, { backgroundColor: getStatusColor(consulta.status) }]}>
              <Text style={styles.statusText}>{consulta.status}</Text>
            </View>

            {consulta.status === 'Pendiente' && (
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text style={styles.noData}>No se encontró la consulta para este ID.</Text>
        )}
      </ScrollView>

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
              onPress={() => setShowModal(false)}
            >
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
    backgroundColor: '#F0F0F0',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10,
    marginTop: 45,
  },
  section: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7D5BA6',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 15,
    color: '#333333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#F7F7F7',
  },
  statusContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4C956C',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noData: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
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
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
