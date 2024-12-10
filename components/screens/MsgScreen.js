import React, { useState, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Conexión a Supabase
const supabaseUrl = 'https://tebiyjoxxrnlplzaxuco.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlYml5am94eHJubHBsemF4dWNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjI3Mzg5NywiZXhwIjoyMDQxODQ5ODk3fQ.dbzRiTYsMlijrHPqhLZg-GNoCYUmH3EBwNDxvN1hMX4';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function MsgScreen({ navigation }) {
  const [id_paciente, setid_paciente] = useState('');
  const [id_medico, setid_medico] = useState('');
  const [messages, setMessages] = useState([]); // Lista de mensajes
  const [inputText, setInputText] = useState(''); // Texto del mensaje de entrada

  useEffect(() => {
    cargarMensajes(); // Cargar mensajes al montar el componente

    // Intervalo para actualizar mensajes cada 3 segundos
    const interval = setInterval(cargarMensajes, 3000);
    return () => clearInterval(interval); // Limpiar intervalo al desmontar el componente
  }, []);

  // Función para cargar los mensajes desde Supabase
  const cargarMensajes = async () => {
    try {
      const idp = await AsyncStorage.getItem('id_paciente');
      const idm = await AsyncStorage.getItem('id_medico');
      setid_medico(idm);
      setid_paciente(idp);
      const { data: mensajes, error } = await supabase
        .from('mensajes')
        .select('*')
        .eq('id_medico', idm)
        .eq('id_paciente', idp)
        .order('fecha_envio', { ascending: true });

      if (error) throw error;

      // Formatear los mensajes para renderizar en el chat
      const mensajesFormateados = mensajes.map((mensaje) => ({
        emisor: mensaje.emisor,
        mensaje: mensaje.mensaje,
        fecha_envio: mensaje.fecha_envio,
        animation: new Animated.Value(1),
      }));
      setMessages(mensajesFormateados);
    } catch (error) {
      console.log('Error cargando los mensajes:', error);
    }
  };

    const generarNotificacion = async () => {
    try {
      const { data, error: insertError } = await supabase
        .from('notificaciones')
        .insert([
          {
            id_paciente: id_paciente,
            id_medico: id_medico,
            titulo_notificacion: 'Te enviaron un nuevo mensaje',
            contenido_notificacion:
              'Claudia quiere comunicarse contigo. Te envió un nuevo mensaje',
          },
        ])
        .select();

      if (insertError) {
        console.error('No se guardó la notificación: ', insertError);
        return;
      }

      console.log('Notificación Mensaje creada:', data);
    } catch (e) {
      console.error('Error en generarNotificacion(): ', e);
    }
  };

  // Función para enviar un mensaje a Supabase
  const enviarMensaje = async () => {
    if (inputText.trim() === '') return; // Evitar enviar mensajes vacíos

    try {
      const { error } = await supabase.from('mensajes').insert([
        {
          id_medico: id_medico,
          id_paciente: id_paciente,
          emisor: 'paciente',
          mensaje: inputText.trim(),
        },
      ]);

      if (error) throw error;

      setInputText(''); // Limpiar el campo de entrada
      cargarMensajes(); // Recargar los mensajes para incluir el nuevo mensaje
      generarNotificacion();
    } catch (error) {
      console.log('Error enviando el mensaje:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Flecha de retroceso */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Mensajes con Obstetra</Text>
      </View>

      {/* Área de mensajes */}
      <ScrollView
        style={styles.messageContainer}
        contentContainerStyle={styles.messages}>
        {messages.map((message, index) => (
          <Animated.View
            key={index}
            style={[
              message.emisor === 'paciente'
                ? styles.sentMessage
                : styles.receivedMessage,
              {
                opacity: message.animation,
                transform: [
                  {
                    translateY: message.animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    }),
                  },
                ],
              },
            ]}>
            <Text style={styles.messageText}>{message.mensaje}</Text>
            <Text style={styles.messageTime}>{message.fecha_envio}</Text>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Área de entrada de mensaje */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          placeholderTextColor="#777"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={enviarMensaje}>
          <Icon name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 45,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#000',
  },
  messageContainer: {
    flex: 1,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  messages: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#C3B1E1',
    alignSelf: 'flex-start',
    padding: 15,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '75%',
    borderTopLeftRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sentMessage: {
    backgroundColor: '#A8D5BA',
    alignSelf: 'flex-end',
    padding: 15,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '75%',
    borderTopRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  messageText: {
    color: '#333',
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: '#777',
    textAlign: 'right',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 30,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#4C956C',
    padding: 10,
    borderRadius: 50,
    marginLeft: 10,
  },
});
