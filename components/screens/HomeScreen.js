import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from '../AppContext';
import { createClient } from '@supabase/supabase-js';

// Conexión a Supabase
const supabaseUrl = 'https://tebiyjoxxrnlplzaxuco.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlYml5am94eHJubHBsemF4dWNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjI3Mzg5NywiZXhwIjoyMDQxODQ5ODk3fQ.dbzRiTYsMlijrHPqhLZg-GNoCYUmH3EBwNDxvN1hMX4';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function HomeScreen({ navigation }) {
  const { id, set_id } = useAppContext();
  const [id_paciente, setid_paciente] = useState('');
  const [id_medico, setid_medico] = useState('');
  const [fecha_parto, setfecha_parto] = useState('');
  const [semanas, setsemanas] = useState('');
  const [id_consulta, setid_consulta] = useState('');

  const getData = async () => {
    try {
      const idp = await AsyncStorage.getItem('id_paciente');
      const idm = await AsyncStorage.getItem('id_medico');
      const um = await AsyncStorage.getItem('ultima_menstruacion');
      const fp = await AsyncStorage.getItem('fecha_parto');

      if (idp === null) {
        console.log('No hay datos guardados');
        navigation.navigate('LoginScreen');
      }

      if (um) {
        const fechaActual = new Date(); // Obtener la fecha actual
        const diferenciaTiempo = fechaActual - new Date(um); // Diferencia en milisegundos
        const semanasCalculadas = Math.floor(
          diferenciaTiempo / (1000 * 60 * 60 * 24 * 7)
        ); // Convertir de milisegundos a semanas
        console.log('Semanas Calculadas Home: ' + semanasCalculadas);
        AsyncStorage.setItem('edad_bebe', String(semanasCalculadas));
        setsemanas(semanasCalculadas);
      }

      if (idp) {
        const { data, error } = await supabase
          .from('consultas')
          .select('id_consulta')
          .eq('id_paciente', idp)
          .eq('status', 'Completada')
          .order('fecha_consulta', { ascending: false })
          .limit(1)
          .single();
        setid_consulta(data.id_consulta);

        console.log('idc: ', data);
      }

      setid_paciente(idp);
      set_id(idp);
      setid_medico(idm);
      setfecha_parto(fp);
    } catch (error) {
      console.error('Error al guardar o recuperar datos de paciente:', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Sección superior con nombre del bebé y semanas */}
      <View style={styles.header}>
        <Text style={styles.title}>HOY</Text>
        <Icon
          name="account-circle"
          size={50}
          color="#000"
          style={styles.profileIcon}
        />
      </View>

      <View style={styles.babyInfoContainer}>
        <Text style={styles.babyName}>Tú Bebé tiene</Text>
        <Text style={styles.weeks}>{semanas} semanas</Text>
        <Icon name="baby" size={40} color="#fff" style={styles.babyIcon} />
      </View>

      {/* Botón para ver la última consulta */}
      <TouchableOpacity
        style={styles.consultationButton}
        onPress={() => {
          if (id_consulta) {
            navigation.navigate('VerConsulta', { id_consulta });
          }
        }}>
        <Icon name="calendar-check" size={24} color="#fff" />
        <Text style={styles.consultationText}>Tú última consulta</Text>
      </TouchableOpacity>

      {/* Opciones de Mis últimas mediciones */}
      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => {
          if (id_paciente) {
            navigation.navigate('HistorialSignos', id_paciente);
          }
        }}>
        <Icon name="chart-line" size={24} color="#7D5BA6" />
        <View>
          <Text style={styles.infoTitle}>Mis últimas mediciones</Text>
          <Text style={styles.infoSubtitle}>Revisa tus somatometrías</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => {
          if (id_paciente) {
            navigation.navigate('HistorialBebe', id_paciente);
          }
        }}>
        <Icon name="stethoscope" size={24} color="#7D5BA6" />
        <View>
          <Text style={styles.infoTitle}>Últimas mediciones del bebé</Text>
          <Text style={styles.infoSubtitle}>Revisa historial del bebé</Text>
        </View>
      </TouchableOpacity>

      {/* Botón inferior de "Me siento un poco rara" */}
      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => {
          if (id_paciente) {
            console.log(id_paciente);
            navigation.navigate('FormularioRara', { id_paciente, id_medico });
          }
        }}>
        <Text style={styles.footerButtonText}>
          Me siento un poco rara{'    '}
          <Icon name="alert-circle-outline" size={24} color="#fff" />
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFEFE', // Fondo blanco hueso
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 45,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  profileIcon: {
    marginRight: 10,
  },
  babyInfoContainer: {
    backgroundColor: '#C3B1E1', // Lavanda suave
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 25,
  },
  babyName: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  weeks: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7D5BA6', // Lavanda oscuro
  },
  babyIcon: {
    marginTop: 10,
  },
  consultationButton: {
    flexDirection: 'row',
    backgroundColor: '#A8D5BA', // Verde menta
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 25,
  },
  consultationText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  infoButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#7D5BA6', // Lavanda oscuro para los bordes
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10,
  },
  infoSubtitle: {
    fontSize: 14,
    color: '#7D5BA6', // Lavanda oscuro
    marginLeft: 10,
  },
  footerButton: {
    backgroundColor: '#7D5BA6', // Lavanda oscuro
    paddingVertical: 10,
    borderRadius: 100,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: '15%',
    right: '15%',
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
