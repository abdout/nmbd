import { useEffect, useState } from 'react';
import { member } from './type';

interface FilterOption {
    label: string;
    value: string;
}

const getUniqueValues = (members: member[], property: keyof member) => {
    // Validate input data
    if (!members || !Array.isArray(members) || members.length === 0 || property === 'contact') {
      return [];
    }
  
    // Handle special cases for arrays like skills and interests
    const uniqueValues = new Set<string>();
    
    members.forEach(member => {
      if (!member) return; // Skip if member is null or undefined
      
      const value = member[property];
      
      if (Array.isArray(value)) {
        // If it's an array (like skills), add each item
        value.forEach(item => {
          if (item) uniqueValues.add(String(item));
        });
      } else if (value) {
        // If it's a string, add it directly
        uniqueValues.add(String(value));
      }
    });
    
    // Convert to array of objects with label and value properties
    return Array.from(uniqueValues)
      .map(value => ({ 
        label: String(value), 
        value: String(value) 
      }));
  };

export const useFilter = (data: any, property: keyof member): FilterOption[] => {
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  
  useEffect(() => {
    // Ensure data is an array
    const validData = Array.isArray(data) ? data : [];
    const uniqueValues = getUniqueValues(validData, property);
    setFilterOptions(uniqueValues);
  }, [data, property]);

  return filterOptions;
};