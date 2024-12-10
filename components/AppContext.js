import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
export const AppContext = createContext();

// Componente proveedor de contexto
export const AppProvider = ({ children }) => {
  const [id, set_id] = useState({});

  return (
    <AppContext.Provider value={{ id, set_id }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook para usar el contexto
export const useAppContext = () => useContext(AppContext);
