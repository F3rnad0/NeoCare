import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Importar las pantallas
import LoginScreen from './screens/LoginScreen';
import ConfirmarDatos from './screens/ConfirmarDatos';
import RevisarBebe from './screens/RevisarBebe';

import HomeScreen from './screens/HomeScreen';
import SeguimientoBebeScreen from './screens/SeguimientoBebe';
import ToolScreen from './screens/Tools';
import CalendarioScreen from './screens/Calendario';
import ConfigScreen from './screens/Configs';

import MsgScreen from './screens/MsgScreen';
import SolicitarConsulta from './screens/SolicitarConsulta';
import VerConsulta from './screens/VerConsulta';
import IngresoManual from './screens/IngresoManual';
import HistorialConsultas from './screens/HistorialConsultas';
import FormularioRara from './screens/FormularioRara';
import HistorialSignos from './screens/HistorialSignos';
import HistorialBebe from './screens/HistorialBebe';

// Crear los navegadores
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Configurar el Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4C956C',
        tabBarInactiveTintColor: '#000',
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Bebé"
        component={SeguimientoBebeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="leaf" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Herramientas"
        component={ToolScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="toolbox" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendario"
        component={CalendarioScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Config"
        component={ConfigScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Configurar el Stack Navigator principal
export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);

  // Verificar si es la primera vez que se inicia la app
  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const isFirstTime = await AsyncStorage.getItem('isFirstTime');
        if (isFirstTime === null) {
          await AsyncStorage.setItem('isFirstTime', 'false');
          setInitialRoute('LoginScreen');
        } else {
          console.log(isFirstTime);
          setInitialRoute('MainTabs');
        }
      } catch (error) {
        console.error("Error al verificar 'Primer Acceso':", error);
      }
    };

    checkFirstTime();
  }, []);

  if (initialRoute === null) return null; // Muestra una pantalla de carga si está en proceso

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false, // Ocultar encabezado globalmente
        }}>
        {/* Pantallas de autenticación */}
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="ConfirmarDatos" component={ConfirmarDatos} />
        <Stack.Screen name="RevisarBebe" component={RevisarBebe} />

        {/* Pantalla que contiene el Tab Navigator */}
        <Stack.Screen name="MainTabs" component={MainTabs} />

        <Stack.Screen name="MsgScreen" component={MsgScreen} />
        <Stack.Screen name="SolicitarConsulta" component={SolicitarConsulta} />
        <Stack.Screen name="VerConsulta" component={VerConsulta} />
        <Stack.Screen name="IngresoManual" component={IngresoManual} />
        <Stack.Screen
          name="HistorialConsultas"
          component={HistorialConsultas}
        />
        <Stack.Screen name="FormularioRara" component={FormularioRara} />
        <Stack.Screen name="HistorialSignos" component={HistorialSignos} />
        <Stack.Screen name="HistorialBebe" component={HistorialBebe} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
