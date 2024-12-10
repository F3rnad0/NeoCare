import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
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
    detalle: 'Tú bebé está en camino y sabes que eso brinda esperanza.',
  },
  4: {
    imagen: IMAGES.semana4,
    descripcion: 'Un granito de azúcar (≈ 1 mm)',
    detalle:
      'Tu bebé es pequeño pero ya está presente, comenzando su increíble viaje.',
  },
  6: {
    imagen: IMAGES.semana6,
    descripcion: 'Un guisantito :3 (≈ 5 mm)',
    detalle:
      'Aunque pequeñito, su corazón ya late con fuerza, como una promesa de amor.',
  },
  8: {
    imagen: IMAGES.semana8,
    descripcion: 'Una frambuesa (≈ 1.6 cm)',
    detalle:
      'Tu bebé ya tiene brazos y piernas en formación; es pequeño, pero se está preparando para abrazarte algún día.',
  },
  10: {
    imagen: IMAGES.semana10,
    descripcion: 'Un durazno miniatura (≈ 3 cm)',
    detalle:
      'Todos sus órganos ya están allí, y aunque faltan por crecer, cada día se hace más fuerte para conocerte.',
  },
  12: {
    imagen: IMAGES.semana12,
    descripcion: 'Una ciruela (≈ 5 cm)',
    detalle:
      'Ya puedes imaginar cómo será ese dulce encuentro; su carita comienza a tomar forma.',
  },
  14: {
    imagen: IMAGES.semana14,
    descripcion: 'Un adorable peluche miniatura (≈ 8.5 cm)',
    detalle:
      'Aunque aún es pequeño, ya empieza a moverse y tal vez pronto sientas sus primeros "saltitos" dentro de ti.',
  },
  16: {
    imagen: IMAGES.semana16,
    descripcion: 'Un globo inflado de fiesta (≈ 11.5 cm)',
    detalle:
      'Ya se estira y patea un poco, celebrando cada momento junto a ti.',
  },
  20: {
    imagen: IMAGES.semana20,
    descripcion: 'Una pluma suave (≈ 16 cm)',
    detalle:
      'Sus movimientos ahora son claros, como si te susurrara que está allí contigo.',
  },
  24: {
    imagen: IMAGES.semana24,
    descripcion: 'Un conejito de peluche (≈ 30 cm)',
    detalle:
      'El bebé se va llenando de vida, y aunque aún necesita tiempo, ya sueña con conocerte.',
  },
  28: {
    imagen: IMAGES.semana28,
    descripcion: 'Un libro infantil de cuentos (≈ 37 cm)',
    detalle:
      'Puede escucharte cantar y hablar, memorizando tu voz como su favorita.',
  },
  32: {
    imagen: IMAGES.semana32,
    descripcion: 'Un ramo de flores silvestres (≈ 42 cm)',
    detalle:
      'Está casi listo, perfumando cada momento con ilusión por la vida que le espera junto a ti.',
  },
  36: {
    imagen: IMAGES.semana36,
    descripcion: 'Un osito de peluche grande (≈ 47 cm)',
    detalle:
      'Tu bebé se prepara para el gran día, acurrucado en el mejor lugar del mundo: tu vientre.',
  },
  40: {
    imagen: IMAGES.semana40,
    descripcion: 'Un regalo envuelto con lazo (≈ 50 cm)',
    detalle:
      'El más hermoso regalo de amor, listo para abrirse y llenar tu vida de alegría.',
  },
};

export default function RevisarBebe({ route, navigation }) {
  const { paciente } = route.params;

  const ultima_menstruacion = new Date(paciente.ultima_menstruacion);
  const [semanas, setSemanas] = useState('XX');
  const [fechaParto, setFechaParto] = useState('XX de MES de AÑO');
  const [imagenBebe, setImagenBebe] = useState();
  const [descripcion, setDescripcion] = useState('');
  const [detalle, setDetalle] = useState('');

  useEffect(() => {
    // Calcular las semanas de gestación
    calcularEdadGestacional();
    // Calcular la fecha probable de parto
    calcularFechaParto();
  }, []);

  const saveEdad = async (fpp) => {
    try {
      // Guarda el dato
      await AsyncStorage.setItem('ultima_menstruacion', paciente.ultima_menstruacion);
      await AsyncStorage.setItem('fecha_parto', fpp.toString());

      // Recupera el dato usando await
      const ultima_menstruacion = await AsyncStorage.getItem('ultima_menstruacion');
      const fecha_parto = await AsyncStorage.getItem('fecha_parto');

      // Muestra el dato recuperado en la consola
      console.log('Async ultima_menstruacion: ', ultima_menstruacion);
      console.log('Async  fecha_parto: ', fecha_parto);
    } catch (error) {
      console.error('Error al guardar o recuperar ultima_mentruacion:', error);
    }
  };

  const calcularEdadGestacional = () => {
    const fechaActual = new Date(); // Obtener la fecha actual
    const diferenciaTiempo = fechaActual - ultima_menstruacion; // Diferencia en milisegundos
    const semanasCalculadas = Math.floor(
      diferenciaTiempo / (1000 * 60 * 60 * 24 * 7)
    ); // Convertir de milisegundos a semanas
    console.log('Semanas Calculadas: ' + semanasCalculadas);

    setSemanas(semanasCalculadas);

    // Establecer la imagen y la descripción basada en las semanas
    if (semanasCalculadas >= 40) {
      setImagenBebe(DESCRIPCIONES[40].imagen);
      setDescripcion(DESCRIPCIONES[40].descripcion);
      setDetalle(DESCRIPCIONES[40].detalle);
    } else if (semanasCalculadas >= 36) {
      setImagenBebe(DESCRIPCIONES[36].imagen);
      setDescripcion(DESCRIPCIONES[36].descripcion);
      setDetalle(DESCRIPCIONES[36].detalle);
    } else if (semanasCalculadas >= 32) {
      setImagenBebe(DESCRIPCIONES[32].imagen);
      setDescripcion(DESCRIPCIONES[32].descripcion);
      setDetalle(DESCRIPCIONES[32].detalle);
    } else if (semanasCalculadas >= 28) {
      setImagenBebe(DESCRIPCIONES[28].imagen);
      setDescripcion(DESCRIPCIONES[28].descripcion);
      setDetalle(DESCRIPCIONES[28].detalle);
    } else if (semanasCalculadas >= 24) {
      setImagenBebe(DESCRIPCIONES[24].imagen);
      setDescripcion(DESCRIPCIONES[24].descripcion);
      setDetalle(DESCRIPCIONES[24].detalle);
    } else if (semanasCalculadas >= 20) {
      setImagenBebe(DESCRIPCIONES[20].imagen);
      setDescripcion(DESCRIPCIONES[20].descripcion);
      setDetalle(DESCRIPCIONES[20].detalle);
    } else if (semanasCalculadas >= 16) {
      setImagenBebe(DESCRIPCIONES[16].imagen);
      setDescripcion(DESCRIPCIONES[16].descripcion);
      setDetalle(DESCRIPCIONES[16].detalle);
    } else if (semanasCalculadas >= 14) {
      setImagenBebe(DESCRIPCIONES[14].imagen);
      setDescripcion(DESCRIPCIONES[14].descripcion);
      setDetalle(DESCRIPCIONES[14].detalle);
    } else if (semanasCalculadas >= 12) {
      setImagenBebe(DESCRIPCIONES[12].imagen);
      setDescripcion(DESCRIPCIONES[12].descripcion);
      setDetalle(DESCRIPCIONES[12].detalle);
    } else if (semanasCalculadas >= 10) {
      setImagenBebe(DESCRIPCIONES[10].imagen);
      setDescripcion(DESCRIPCIONES[10].descripcion);
      setDetalle(DESCRIPCIONES[10].detalle);
    } else if (semanasCalculadas >= 8) {
      setImagenBebe(DESCRIPCIONES[8].imagen);
      setDescripcion(DESCRIPCIONES[8].descripcion);
      setDetalle(DESCRIPCIONES[8].detalle);
    } else if (semanasCalculadas >= 6) {
      setImagenBebe(DESCRIPCIONES[6].imagen);
      setDescripcion(DESCRIPCIONES[6].descripcion);
      setDetalle(DESCRIPCIONES[6].detalle);
    } else if (semanasCalculadas >= 4) {
      setImagenBebe(DESCRIPCIONES[4].imagen);
      setDescripcion(DESCRIPCIONES[4].descripcion);
      setDetalle(DESCRIPCIONES[4].detalle);
    } else if (semanasCalculadas >= 0) {
      setImagenBebe(DESCRIPCIONES[0].imagen);
      setDescripcion(DESCRIPCIONES[0].descripcion);
      setDetalle(DESCRIPCIONES[0].detalle);
    } else if (semanasCalculadas < 0) {
      Alert.alert('Error en la edad de tu bebé', 'Parece ser que hay un error para calcular la edad de tu bebé, Porfavor verifica el registro con tu Médico cabecera');
      navigation.navigate('Login');
    }
  };

  const calcularFechaParto = () => {
    let fechaPartoCalculada = new Date(ultima_menstruacion);
    fechaPartoCalculada.setDate(fechaPartoCalculada.getDate() + 7);
    fechaPartoCalculada.setMonth(fechaPartoCalculada.getMonth() - 3);
    fechaPartoCalculada.setFullYear(fechaPartoCalculada.getFullYear() + 1);
  
    console.log(fechaPartoCalculada);

    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    const dia = fechaPartoCalculada.getDate();
    const mes = meses[fechaPartoCalculada.getMonth()];
    const año = fechaPartoCalculada.getFullYear();

    setFechaParto(`${dia} de ${mes} de ${año}`);

    saveEdad(fechaPartoCalculada);
  };

  const handleVerMas = () => {
    navigation.navigate('MainTabs');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Revisemos a tu bebé!</Text>

      <Text style={styles.subtitle}>
        En este momento tu <Text style={styles.highlight}>BEBÉ</Text> se ve
        como...
      </Text>

      <View style={styles.imageContainer}>
        <Image style={styles.image} source={imagenBebe} />
      </View>

      <Text style={styles.description}>{descripcion}</Text>
      <Text style={styles.subtitle}>{detalle}</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          🍼 Tu <Text style={styles.highlight}>BEBÉ</Text> tiene{' '}
          <Text style={styles.highlight}>{semanas}</Text> Semanas de edad
        </Text>

        <Text style={styles.infoText}>
          📅 Tu <Text style={styles.highlight}>Fecha Probable de Parto</Text> es
          el <Text style={styles.highlight}>{fechaParto}</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleVerMas}>
        <Text style={styles.buttonText}>Veamos más!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0', // Fondo primario
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7D5BA6', // Lavanda oscuro para títulos
    marginTop: 25,
    marginBottom: 25,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  highlight: {
    color: '#7D5BA6', // Lavanda oscuro para destacar palabras importantes
    fontWeight: 'bold',
  },
  imageContainer: {
    width: 275, // Ancho fijo para el contenedor de la imagen
    height: 275, // Altura fija para el contenedor de la imagen
    borderWidth: 2,
    borderColor: '#C3B1E1', // Lavanda suave para el borde del contenedor
    borderRadius: 10,
    padding: 10,
    alignSelf: 'center', // Centra el contenedor de la imagen
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%', // La imagen ocupa el 100% del ancho del contenedor
    height: '100%', // La imagen ocupa el 100% de la altura del contenedor
    borderRadius: 10, // Borde redondeado
    resizeMode: 'cover', // Ajusta la imagen para que cubra todo el contenedor manteniendo la proporción
    alignSelf: 'center', // Centra la imagen dentro del contenedor
  },
  description: {
    textAlign: 'center',
    color: '#7D5BA6', // Lavanda suave
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoContainer: {
    marginBottom: 40,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4C956C', // Verde menta para el botón
    paddingVertical: 15,
    borderRadius: 100,
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
