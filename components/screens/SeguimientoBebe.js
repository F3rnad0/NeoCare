import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Imágenes de comparación
const IMAGES = {
  semana0: require('../../assets/weeks/0.webp'),
  semana4: require('../../assets/weeks/4.webp'),
  semana6: require('../../assets/weeks/6.webp'),
  semana8: require('../../assets/weeks/8.webp'),
  semana10: require('../../assets/weeks/10.webp'),
  semana12: require('../../assets/weeks/12.webp'),
  semana14: require('../../assets/weeks/14.webp'),
  semana16: require('../../assets/weeks/16.webp'),
  semana20: require('../../assets/weeks/20.webp'),
  semana24: require('../../assets/weeks/24.webp'),
  semana28: require('../../assets/weeks/28.webp'),
  semana32: require('../../assets/weeks/32.webp'),
  semana36: require('../../assets/weeks/36.webp'),
  semana40: require('../../assets/weeks/40.webp'),
};

// Diccionario de descripciones basadas en las semanas gestacionales
const DESCRIPCIONES = {
  0: {
    imagen: IMAGES.semana0,
    descripcion: 'Una pequeña célula',
  },
  4: {
    imagen: IMAGES.semana4,
    descripcion: 'Un granito de azúcar (≈ 1 mm)',
  },
  6: {
    imagen: IMAGES.semana6,
    descripcion: 'Un guisantito :3 (≈ 5 mm)',
  },
  8: {
    imagen: IMAGES.semana8,
    descripcion: 'Una frambuesa (≈ 1.6 cm)',
  },
  10: {
    imagen: IMAGES.semana10,
    descripcion: 'Un durazno miniatura (≈ 3 cm)',
  },
  12: {
    imagen: IMAGES.semana12,
    descripcion: 'Una ciruela (≈ 5 cm)',
  },
  14: {
    imagen: IMAGES.semana14,
    descripcion: 'Un adorable peluche miniatura (≈ 8.5 cm)',
  },
  16: {
    imagen: IMAGES.semana16,
    descripcion: 'Un globo inflado de fiesta (≈ 11.5 cm)',
  },
  20: {
    imagen: IMAGES.semana20,
    descripcion: 'Una pluma suave (≈ 16 cm)',
  },
  24: {
    imagen: IMAGES.semana24,
    descripcion: 'Un conejito de peluche (≈ 30 cm)',
  },
  28: {
    imagen: IMAGES.semana28,
    descripcion: 'Un libro infantil de cuentos (≈ 37 cm)',
  },
  32: {
    imagen: IMAGES.semana32,
    descripcion: 'Un ramo de flores silvestres (≈ 42 cm)',
  },
  36: {
    imagen: IMAGES.semana36,
    descripcion: 'Un osito de peluche grande (≈ 47 cm)',
  },
  40: {
    imagen: IMAGES.semana40,
    descripcion: 'Un regalo envuelto con lazo (≈ 50 cm)',
  },
};

export default function SeguimientoBebe({ navigation }) {
  const [dias, setDias] = useState('');
  const [imagenBebe, setImagenBebe] = useState();
  const [descripcion, setDescripcion] = useState('');
  const [semanas, setSemanas] = useState('');
  const [id_paciente, setid_paciente] = useState('');
  const [id_medico, setid_medico] = useState('');
  const [progress, setProgress] = useState(0); // Estado para la barra de progreso

  const TOTAL_EMBARAZO_DIAS = 280; // Total de días típicos de embarazo

  const getData = async () => {
    try {
      const idp = await AsyncStorage.getItem('id_paciente');
      const idm = await AsyncStorage.getItem('id_medico');
      const fp = await AsyncStorage.getItem('fecha_parto');
      const eb = await AsyncStorage.getItem('edad_bebe');

      if (eb) {
        // Establecer la imagen y la descripción basada en las semanas
        if (eb >= 40) {
          setImagenBebe(DESCRIPCIONES[40].imagen);
          setDescripcion(DESCRIPCIONES[40].descripcion);
        } else if (eb >= 36) {
          setImagenBebe(DESCRIPCIONES[36].imagen);
          setDescripcion(DESCRIPCIONES[36].descripcion);
        } else if (eb >= 32) {
          setImagenBebe(DESCRIPCIONES[32].imagen);
          setDescripcion(DESCRIPCIONES[32].descripcion);
        } else if (eb >= 28) {
          setImagenBebe(DESCRIPCIONES[28].imagen);
          setDescripcion(DESCRIPCIONES[28].descripcion);
        } else if (eb >= 24) {
          setImagenBebe(DESCRIPCIONES[24].imagen);
          setDescripcion(DESCRIPCIONES[24].descripcion);
        } else if (eb >= 20) {
          setImagenBebe(DESCRIPCIONES[20].imagen);
          setDescripcion(DESCRIPCIONES[20].descripcion);
        } else if (eb >= 16) {
          setImagenBebe(DESCRIPCIONES[16].imagen);
          setDescripcion(DESCRIPCIONES[16].descripcion);
          setDetalle(DESCRIPCIONES[16].detalle);
        } else if (eb >= 14) {
          setImagenBebe(DESCRIPCIONES[14].imagen);
          setDescripcion(DESCRIPCIONES[14].descripcion);
        } else if (eb >= 12) {
          setImagenBebe(DESCRIPCIONES[12].imagen);
          setDescripcion(DESCRIPCIONES[12].descripcion);
        } else if (eb >= 10) {
          setImagenBebe(DESCRIPCIONES[10].imagen);
          setDescripcion(DESCRIPCIONES[10].descripcion);
        } else if (eb >= 8) {
          setImagenBebe(DESCRIPCIONES[8].imagen);
          setDescripcion(DESCRIPCIONES[8].descripcion);
        } else if (eb >= 6) {
          setImagenBebe(DESCRIPCIONES[6].imagen);
          setDescripcion(DESCRIPCIONES[6].descripcion);
        } else if (eb >= 4) {
          setImagenBebe(DESCRIPCIONES[4].imagen);
          setDescripcion(DESCRIPCIONES[4].descripcion);
        } else if (eb >= 0) {
          setImagenBebe(DESCRIPCIONES[0].imagen);
          setDescripcion(DESCRIPCIONES[0].descripcion);
        } else if (eb < 0) {
          Alert.alert(
            'Error en la edad de tu bebé',
            'Parece ser que hay un error para calcular la edad de tu bebé, Porfavor verifica el registro con tu Médico cabecera'
          );
          navigation.navigate('Login');
        }
      }

      if (fp) {
        const fechaActual = new Date(); // Obtener la fecha actual
        const diferenciaTiempo = new Date(fp) - fechaActual; // Diferencia en milisegundos
        const diasFaltantes = Math.floor(
          diferenciaTiempo / (1000 * 60 * 60 * 24)
        ); // Convertir de milisegundos a días

        console.log('Días Calculados Seguimiento: ' + diasFaltantes);
        setDias(diasFaltantes);

        // Calcular el progreso de la barra
        const diasPasados = TOTAL_EMBARAZO_DIAS - diasFaltantes;
        const progreso = Math.min(
          (diasPasados / TOTAL_EMBARAZO_DIAS) * 100,
          100
        );
        setProgress(progreso); // Actualizar el estado de la barra de progreso
      }

      setid_paciente(idp);
      setid_medico(idm);
      setSemanas(eb);
    } catch (error) {
      console.error('Error al guardar o recuperar datos de paciente:', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Título de la pantalla */}
      <View style={styles.header}>
        <Text style={styles.title}>SEGUIMIENTO BEBÉ</Text>
        <Icon
          name="account-circle"
          size={50}
          color="#000"
          style={styles.profileIcon}
        />
      </View>

      {/* Sección Pulso del bebé */}
      <View style={styles.pulseContainer}>
        <Icon name="heart-pulse" size={50} color="#ffff" />
        <Text style={styles.pulseText}>Pulso de tu Bebé</Text>
      </View>

      {/* Sección Falta poco */}
      <View style={styles.countdownContainer}>
        <Text style={styles.countdownTitle}>Ya falta poco...</Text>
        <Text style={styles.countdownText}>
          Quedan {dias} días para tu parto
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${progress}%` }]}></View>
        </View>
      </View>

      {/* Sección del bebé luce como */}
      <View style={styles.babySizeContainer}>
        <Text style={styles.babySizeTitle}>
          Tu <Text style={styles.highlight}>BEBÉ</Text> luce como
        </Text>
        <View style={styles.babySizeRow}>
          <Text style={styles.babySizeText}>{descripcion}</Text>
        </View>
        <Image source={imagenBebe} style={styles.babyImage} />
      </View>

      {/* Botón Últimas mediciones */}
      <TouchableOpacity style={styles.infoButton}>
        <Icon name="stethoscope" size={24} color="#7D5BA6" />
        <View>
          <Text style={styles.infoTitle}>Últimas mediciones del bebé</Text>
          <Text style={styles.infoSubtitle}>Revisa historial bebé</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0', // Fondo blanco hueso
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
  pulseContainer: {
    backgroundColor: '#A8D5BA', // Verde menta
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 25,
  },
  pulseText: {
    fontSize: 20,
    color: '#4C956C', // Verde oscuro
    marginTop: 10,
    fontWeight: 'bold',
  },
  countdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    borderColor: '#7D5BA6', // Lavanda oscuro
    borderWidth: 1,
  },
  countdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7D5BA6',
    marginBottom: 5,
  },
  countdownText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progress: {
    height: '100%',
    backgroundColor: '#4C956C', // Verde oscuro
  },
  babySizeContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    borderColor: '#7D5BA6', // Lavanda oscuro
    borderWidth: 1,
  },
  babySizeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  babySizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  highlight: {
    color: '#7D5BA6', // Lavanda oscuro para resaltar palabras
  },
  babySizeText: {
    fontSize: 16,
    color: '#7D5BA6',
  },
  babyImage: {
    width: 60,
    height: 60,
    marginTop: 10,
    borderRadius: 25, // Hace que sea completamente redonda
    borderWidth: 2, // Ancho del contorno
    borderColor: '#7D5BA6', // Color del contorno
    alignSelf: 'center', // Centra la imagen dentro de su contenedor
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
    borderColor: '#7D5BA6', // Lavanda oscuro
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10,
  },
  infoSubtitle: {
    fontSize: 14,
    color: '#7D5BA6',
    marginLeft: 10,
  },
});
