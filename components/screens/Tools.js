import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ToolScreen({ navigation }) {
  const { id, set_id } = useAppContext();
  const [modalVisible, setModalVisible] = useState(false);

  const handleOptionPress = (option) => {
    setModalVisible(false); // Cierra el modal
    if (option === 'MedirAhora') {
      navigation.navigate('Signos');
    } else if (option === 'NeoCare') {
      navigation.navigate('NeoCarePlus');
    } else if (option === 'IngresoManual') {
      navigation.navigate('IngresoManual', { id });
    }
  };

  return (
    <View style={styles.container}>
      {/* Título de la pantalla y perfil */}
      <View style={styles.header}>
        <Text style={styles.title}>HERRAMIENTAS</Text>
        <Icon
          name="account-circle"
          size={50}
          color="#000"
          style={styles.profileIcon}
        />
      </View>

      {/* Tarjeta Mis Mediciones */}
      <TouchableOpacity
        style={styles.cardGreen}
        onPress={() => Alert.alert(`ID: ${id}`)}>
        <Icon name="chart-line" size={30} color="#fff" />
        <Text style={styles.cardTextWhite}>Mis Mediciones</Text>
      </TouchableOpacity>

      {/* Tarjeta Medir mis Signos */}
      <TouchableOpacity
        style={styles.cardMint}
        onPress={() => setModalVisible(true)}>
        <View style={styles.cardMintContent}>
          <Image
            source={require('../../assets/heart.png')}
            style={styles.cardImage}
          />
          <Image
            source={require('../../assets/oxigen.png')}
            style={styles.cardImage}
          />
        </View>
        <Text style={styles.cardTextPurple}>Medir mis Signos</Text>
      </TouchableOpacity>

      {/* Tarjeta Revisión de Mensajes */}
      <TouchableOpacity
        style={styles.cardMessage}
        onPress={() => navigation.navigate('MsgScreen')}>
        <Icon name="message" size={24} color="#4C956C" />
        <Text style={styles.cardTextGreen}>Revisar Mensajes (1)</Text>
      </TouchableOpacity>

      {/* Botón Circular de ChatBot */}
      <TouchableOpacity
        style={styles.chatbotButton}
        onPress={() => navigation.navigate('ChatBot')}>
        <Icon name="robot" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Botón inferior de "Me siento un poco rara" */}
      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => {
          if (id) {
            console.log(id);
            const id_paciente = id;
            const id_medico = '4e63bdad-0111-4a53-8d93-c0dbe6aa31d0';
            navigation.navigate('FormularioRara', { id_paciente,  id_medico });
          }
        }}>
        <Text style={styles.footerButtonText}>
          Me siento un poco rara{'    '}
          <Icon name="alert-circle-outline" size={24} color="#fff" />
        </Text>
      </TouchableOpacity>

      {/* Modal para seleccionar opciones */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Elige una opción</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleOptionPress('MedirAhora')}>
              <Text style={styles.modalOptionText}>Medir Ahora</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleOptionPress('NeoCare')}>
              <Text style={styles.modalOptionText}>NeoCare+</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleOptionPress('IngresoManual')}>
              <Text style={styles.modalOptionText}>Ingreso Manual</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>Cancelar</Text>
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
  cardGreen: {
    flexDirection: 'row',
    backgroundColor: '#4C956C',
    borderRadius: 15,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 25,
  },
  cardTextWhite: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  cardMint: {
    backgroundColor: '#A8D5BA',
    borderRadius: 15,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 25,
  },
  cardMintContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginBottom: 15,
  },
  cardImage: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
  },
  cardTextPurple: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7D5BA6',
  },
  cardMessage: {
    backgroundColor: '#fff',
    borderColor: '#7D5BA6',
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 25,
    flexDirection: 'row',
  },
  cardTextGreen: {
    color: '#4C956C',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  chatbotButton: {
    backgroundColor: '#7D5BA6',
    width: 55,
    height: 55,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 150,
    right: 30,
  },
  footerButton: {
    backgroundColor: '#7D5BA6',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4C956C',
  },
  modalOption: {
    padding: 15,
    backgroundColor: '#A8D5BA',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalCloseButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#4C956C',
  },
});
