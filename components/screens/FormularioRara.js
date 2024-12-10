import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Para los íconos
import { createClient } from '@supabase/supabase-js';

// Conexión a Supabase
const supabaseUrl = 'https://tebiyjoxxrnlplzaxuco.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlYml5am94eHJubHBsemF4dWNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjI3Mzg5NywiZXhwIjoyMDQxODQ5ODk3fQ.dbzRiTYsMlijrHPqhLZg-GNoCYUmH3EBwNDxvN1hMX4';
const supabase = createClient(supabaseUrl, supabaseKey);

// CustomCheckBox Component
const CustomCheckBox = ({ value, onValueChange, label }) => (
  <TouchableOpacity
    style={styles.checkboxRow}
    onPress={() => onValueChange(!value)}>
    <View style={[styles.checkbox, value && styles.checkboxChecked]} />
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function FormularioRara({ route, navigation }) {
  const ids = route.params;

  const [mareos, setMareos] = useState(false);
  const [nauseas, setNauseas] = useState(false);
  const [brillitos, setBrillitos] = useState(false);
  const [letrasPequenas, setLetrasPequenas] = useState(false);
  const [manosHinchadas, setManosHinchadas] = useState(false);
  const [piesHinchados, setPiesHinchados] = useState(false);
  const [sangradoVaginal, setSangradoVaginal] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const mandarWhatsConfianza = async () => {
    try {
      const { data, error } = await supabase
        .from('pacientes')
        .select('numero_confianza')
        .eq('id_paciente', ids.id_paciente)
        .single();

      if (error) {
        console.error('Error al obtener el número de confianza:', error);
        return;
      }

      const phoneNumber = data?.numero_confianza;

      if (!phoneNumber) {
        Alert.alert('Sin número', 'No hay un número de confianza registrado.');
        return;
      }

      const whatsappURL = `whatsapp://send?text=${encodeURIComponent(
        '¡Hola! Tengo una emergencia.'
      )}&phone=${phoneNumber}`;

      await Linking.openURL(whatsappURL).catch((err) =>
        console.error('Error al abrir WhatsApp:', err)
      );
    } catch (error) {
      console.error('Error al contactar alguien de confianza:', error);
    }
  };

  const generarConsulta = async () => {
    try {
      const currentDate = new Date();
      const formattedDate = currentDate.toDateString();
      currentDate.setMinutes(currentDate.getMinutes() + 5);
      const formattedTime = currentDate.toTimeString().split(' ')[0];

      const { data, error: insertError } = await supabase
        .from('consultas')
        .insert([
          {
            fecha_consulta: formattedDate,
            hora_consulta: formattedTime,
            id_paciente: ids.id_paciente,
            id_medico: ids.id_medico,
            motivo: '¡Emergente: Síntomas Anormales!',
            status: 'Urgente',
          },
        ])
        .select();

      if (insertError) {
        console.error('Error al registrar consulta: ', insertError);
        return;
      }

      console.log('Consulta generada exitosamente:', data);
    } catch (e) {
      console.error('Error al generar consulta emergente: ', e);
    }
  };

  const generarNotificacion = async () => {
    try {
      const { data, error: insertError } = await supabase
        .from('notificaciones')
        .insert([
          {
            id_paciente: ids.id_paciente,
            id_medico: ids.id_medico,
            titulo_notificacion: '¡Paciente con Síntomas Inestables!',
            contenido_notificacion:
              'Tu paciente: Claudia, Ha indicado que tiene síntomas extraños \nRevísalo, por favor.',
          },
        ])
        .select();

      if (insertError) {
        console.error('No se guardó la notificación: ', insertError);
        return;
      }

      console.log('Notificación Urgente creada:', data);
    } catch (e) {
      console.error('Error en generarNotificacion(): ', e);
    }
  };

  const enviarSintomas = () => {
    if (
      mareos ||
      nauseas ||
      brillitos ||
      letrasPequenas ||
      manosHinchadas ||
      piesHinchados ||
      sangradoVaginal
    ) {
      generarConsulta();
      generarNotificacion();
      setShowModal(true);
    } else {
      Alert.alert('Sin Síntomas', 'No se ha detectado ningún síntoma.');
    }
  };

  const cerrarModal = () => {
    mandarWhatsConfianza();
    setShowModal(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backIcon}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Me Siento un Poco Rara</Text>
      </View>

      <Text style={styles.introText}>Hola!</Text>
      <Text style={styles.infoText}>Permítenos conocer más esa sensación</Text>

      <Text style={styles.selectText}>Selecciona todo lo que sientes</Text>

      <View style={styles.checkboxContainer}>
        <CustomCheckBox
          value={mareos}
          onValueChange={setMareos}
          label="Me siento mareada"
        />
        <CustomCheckBox
          value={nauseas}
          onValueChange={setNauseas}
          label="Tengo náuseas"
        />
        <CustomCheckBox
          value={brillitos}
          onValueChange={setBrillitos}
          label="Veo brillitos"
        />
        <CustomCheckBox
          value={letrasPequenas}
          onValueChange={setLetrasPequenas}
          label="Visión borrosa"
        />
        <CustomCheckBox
          value={manosHinchadas}
          onValueChange={setManosHinchadas}
          label="Tengo mis manos hinchadas"
        />
        <CustomCheckBox
          value={piesHinchados}
          onValueChange={setPiesHinchados}
          label="Tengo mis pies hinchados"
        />
        <CustomCheckBox
          value={sangradoVaginal}
          onValueChange={setSangradoVaginal}
          label="Tengo sangrado vaginal"
        />
      </View>

      <TouchableOpacity style={styles.sendButton} onPress={enviarSintomas}>
        <Text style={styles.sendButtonText}>Enviar Síntomas</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={cerrarModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¡Alerta!</Text>
            <Text style={styles.modalText}>
              Se ha detectado algún problema con sus síntomas. Consulte a su
              médico.
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={cerrarModal}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  introText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7D5BA6',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  selectText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7D5BA6',
    marginBottom: 10,
  },
  checkboxContainer: {
    borderWidth: 1,
    borderColor: '#7D5BA6',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#7D5BA6',
    borderRadius: 4,
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#7D5BA6',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#000',
  },
  sendButton: {
    backgroundColor: '#7D5BA6',
    paddingVertical: 15,
    borderRadius: 100,
    alignItems: 'center',
    marginTop: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E63946',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#4C956C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
