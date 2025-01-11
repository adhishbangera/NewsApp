// context/PreferencesContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { Preferences } from '../types/Preferences';

interface PreferencesContextProps {
  preferences: Preferences;
  updatePreferences: (newPreferences: Partial<Preferences>) => void;
}

const PreferencesContext = createContext<PreferencesContextProps | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<Preferences>({
    sources: [],
    categories: [],
    authors: [],
  });

  const updatePreferences = (newPreferences: Partial<Preferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPreferences }));
  };

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = (): PreferencesContextProps => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
