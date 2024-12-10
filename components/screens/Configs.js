import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';

export default function Configs({ navigation }) {
  const [profileImage, setProfileImage] = useState(null);

  // Función para abrir la galería y seleccionar una imagen
  const selectProfileImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        Alert.alert('Selección cancelada');
      } else if (response.errorCode) {
        Alert.alert('Error:', response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        setProfileImage(uri); // Guardar la imagen seleccionada
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Título y Imagen de Perfil */}
      <Text style={styles.title}>CONFIGURACIONES</Text>
      <TouchableOpacity
        style={styles.profileImageContainer}
        onPress={selectProfileImage}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Icon name="account-circle" size={100} color="#7D5BA6" />
        )}
      </TouchableOpacity>

      {/* Opciones de Configuraciones */}
      <TouchableOpacity
        style={styles.cardOption}
        onPress={() => navigation.navigate('ProfilePhoto')}>
        <Icon name="camera" size={24} color="#7D5BA6" />
        <View>
          <Text style={styles.cardTitle}>Foto de Perfil</Text>
          <Text style={styles.cardSubtitle}>
            Selecciona una imagen para ver como perfil
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cardOption}
        onPress={() => navigation.navigate('DatosBebe')}>
        <Icon name="baby" size={24} color="#7D5BA6" />
        <View>
          <Text style={styles.cardTitle}>Datos Bebé</Text>
          <Text style={styles.cardSubtitle}>
            Nombre, Fecha Probable de Parto...
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cardOption}
        onPress={() => navigation.navigate('DatosPersonales')}>
        <Icon name="account" size={24} color="#7D5BA6" />
        <View>
          <Text style={styles.cardTitle}>Datos Personales</Text>
          <Text style={styles.cardSubtitle}>
            Nombre, Apellidos, Dirección...
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cardOption}
        onPress={() => navigation.navigate('InfoCuenta')}>
        <Icon name="information" size={24} color="#7D5BA6" />
        <View>
          <Text style={styles.cardTitle}>Info Cuenta</Text>
          <Text style={styles.cardSubtitle}>
            Datos de creación, Apellidos, Dirección...
          </Text>
        </View>
      </TouchableOpacity>

      {/* Botón inferior de "Me siento un poco rara" */}
      <TouchableOpacity style={styles.footerButton}>
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
    backgroundColor: '#F0F0F0', // Fondo blanco hueso
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: 45,
    marginBottom: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#7D5BA6',
  },
  cardOption: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#7D5BA6', // Lavanda oscuro para los bordes
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#7D5BA6',
    marginLeft: 10,
  },
  footerButton: {
    backgroundColor: '#7D5BA6', // Lavanda oscuro
    paddingVertical: 10,
    borderRadius: 100,
    alignItems: 'center',
    position: 'absolute',
    bottom: 70,
    left: '15%',
    right: '15%',
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
