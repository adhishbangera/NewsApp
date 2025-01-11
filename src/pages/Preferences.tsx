// pages/Preferences.tsx
import React from 'react';
import { usePreferences } from '../context/PreferencesContext';

const Preferences: React.FC = () => {
  const { preferences, updatePreferences } = usePreferences();

  const handleUpdate = (type: string, value: string[]) => {
    updatePreferences({ [type]: value });
  };

  return (
    <div className="p-4">
      <h1>Personalize Your News Feed</h1>
      <div>
        <label>Preferred Sources:</label>
        <input
          type="text"
          onBlur={(e) => handleUpdate('sources', e.target.value.split(','))}
          className="border p-2"
        />
      </div>
      <div>
        <label>Preferred Categories:</label>
        <input
          type="text"
          onBlur={(e) => handleUpdate('categories', e.target.value.split(','))}
          className="border p-2"
        />
      </div>
    </div>
  );
};

export default Preferences;
