import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Custom hook for handling focus-based motion effects between multiple elements
 * @param defaultClassName Base class to apply to all elements
 */
export function useFocus<T extends string>(
  defaultClassName: string = '',
) {
  // Track which field is focused
  const [focusedItem, setFocusedItem] = useState<T | null>(null);

  // Generate handler for focus event
  const handleFocus = (item: T) => () => setFocusedItem(item);
  
  // Generate handler for blur event
  const handleBlur = () => setFocusedItem(null);

  // Generate class name based on item ID and focus state - using hard-coded values
  const getClassName = (item: T, additionalClasses: string = '') => {
    const baseClasses = cn(
      defaultClassName,
      "transition-all duration-500 ease-in-out relative",
      additionalClasses
    );
    
    // Using direct Tailwind classes instead of string interpolation for more reliable behavior
    if (focusedItem === item) {
      // Focused item - expanded (55%)
      return `${baseClasses} md:w-[60%] z-10`;
    }
    
    if (focusedItem !== null) {
      // Another item is focused - shrunk (45%)
      return `${baseClasses} md:w-[40%]`;
    }
    
    // No focus - equal width (50%)
    return `${baseClasses} md:w-[50%]`;
  };

  return {
    focusedItem,
    handleFocus,
    handleBlur,
    getClassName
  };
} 


/**
 * A custom hook to manage focus state for a group of fields with width adjustment
 * @returns Object with focus state and helper functions
 */
export function useFocusSelect<T extends string>() {
  // Focus state
  const [focusedField, setFocusedField] = useState<T | null>(null);

  // Get the style for a field based on its focus state - hard-coded values
  const getFieldStyle = (field: T) => {
    // Common base classes for all states with increased duration
    const baseClasses = "w-full transition-all duration-500 relative overflow-hidden";
    
    if (focusedField === field) {
      // This field is focused - 50% width
      return `${baseClasses} md:w-[50%] z-10`;
    } else if (focusedField !== null) {
      // Another field is focused - 25% width
      return `${baseClasses} md:w-[25%]`;
    } else {
      // No focus - equal width (33.33%)
      return `${baseClasses} md:w-[33.33%]`;
    }
  };

  // Get container class for the parent flex container
  const getContainerClass = () => {
    return "w-full md:flex md:flex-row md:gap-3 items-stretch";
  };

  return {
    focusedField,
    getFieldStyle,
    getContainerClass,
    setFocusedField,
  };
} 