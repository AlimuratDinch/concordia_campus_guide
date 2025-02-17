// utils/useBuildings.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Building } from './coordinateHelpers'; // Import shared interface

export const useBuildings = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);

  useEffect(() => {
    const fetchBuildings = async () => {
      const { data, error } = await supabase.from("buildings").select("*");
      if (error) {
        console.error("Error fetching buildings:", error.message);
        return;
      }
      setBuildings(data as Building[]);
    };
    fetchBuildings();
  }, []);

  return buildings;
};
