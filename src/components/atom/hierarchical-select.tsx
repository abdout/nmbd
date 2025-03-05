'use client'
import { useState, useRef, useEffect } from "react"
import { AutoComplete, Option, AnimationTiming } from "./auto-complete"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronRight } from "lucide-react"

// Type to define a selection step
export type SelectionStep = {
  // Unique identifier for this step
  id: string;
  // Display name for this step
  title: string;
  // Placeholder text for the input
  placeholder: string;
  // Empty message when no results
  emptyMessage: string;
  // Function to get options based on previous selections
  getOptions: (prevSelections: Record<string, Option>) => Option[];
}

// Type for the component props
export type AnimatedHierarchicalSelectProps = {
  // Array of selection steps configuration
  steps: SelectionStep[];
  // Optional animation timing overrides
  timing?: Partial<AnimationTiming>;
  // Optional callback when all selections are complete
  onComplete?: (selections: Record<string, Option>) => void;
  // Optional class name for the container
  className?: string;
  // Whether this is the last step in the form
  isLastStep?: boolean;
  // Optional max height for dropdown menus (defaults to 200px)
  maxDropdownHeight?: number;
}

// Default animation timings
const DEFAULT_TIMING: AnimationTiming = {
  transitionDelay: 300,
  animationDuration: 0.4,
  dropdownDelay: 800,
  focusDelay: 50
}

export function AnimatedHierarchicalSelect({
  steps,
  timing = {},
  onComplete,
  className = "",
  isLastStep = false,
  maxDropdownHeight = 200
}: AnimatedHierarchicalSelectProps) {
  // Combine default timing with any overrides
  const animationTiming: AnimationTiming = {
    ...DEFAULT_TIMING,
    ...timing
  };

  // Current active step index
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  // Store all selections by step id
  const [selections, setSelections] = useState<Record<string, Option>>({});
  // Track when to trigger the dropdown for the current step
  const [shouldTriggerDropdown, setShouldTriggerDropdown] = useState(false);
  // Ref for the current input to focus it
  const inputRef = useRef<HTMLInputElement>(null);
  // Options for the current step
  const [currentOptions, setCurrentOptions] = useState<Option[]>([]);
  // Flag to track if a selection has been made (to start animations)
  const [hasInitialSelection, setHasInitialSelection] = useState(false);
  // Flag to track if we are in the initial step (first step, no selections yet)
  const isInitialStep = currentStepIndex === 0 && Object.keys(selections).length === 0;
  // State to track if this is the first render (to disable initial animation)
  const [isFirstRender, setIsFirstRender] = useState(true);
  // Keep track of the previous step index to prevent unnecessary triggers
  const prevStepIndexRef = useRef(currentStepIndex);

  // Get the current step configuration
  const currentStep = steps[currentStepIndex];

  // Set isFirstRender to false after component mounts
  useEffect(() => {
    // Use requestAnimationFrame to ensure we're past the first render
    // before updating the state to avoid any flash of content
    const animationFrame = requestAnimationFrame(() => {
      setIsFirstRender(false);
    });
    
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Update options when step changes or previous selections change
  useEffect(() => {
    if (currentStep) {
      const options = currentStep.getOptions(selections);
      setCurrentOptions(options);
    }
  }, [currentStep, selections]);

  // Improved animation and dropdown trigger management
  useEffect(() => {
    // Get previous step index
    const prevStepIndex = prevStepIndexRef.current;
    prevStepIndexRef.current = currentStepIndex;
    
    // Only proceed if the step actually changed and we're not in initial step
    if (prevStepIndex !== currentStepIndex && !isInitialStep) {
      // First, ensure dropdown is OFF
      setShouldTriggerDropdown(false);
      
      // After the step transition animation, trigger the dropdown
      const dropdownTimer = setTimeout(() => {
        // Toggle the dropdown trigger ON
        setShouldTriggerDropdown(true);
        
        // Then schedule turning it OFF again after a delay
        const resetTimer = setTimeout(() => {
          setShouldTriggerDropdown(false);
        }, 500); // Short delay is enough, just to ensure the toggle is detected
        
        return () => clearTimeout(resetTimer);
      }, animationTiming.dropdownDelay);
      
      return () => clearTimeout(dropdownTimer);
    }
  }, [currentStepIndex, animationTiming.dropdownDelay, isInitialStep]);

  // Focus the input when dropdown should be triggered
  useEffect(() => {
    if (shouldTriggerDropdown && !isInitialStep) {
      const focusTimer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, animationTiming.focusDelay);
      
      return () => clearTimeout(focusTimer);
    }
  }, [shouldTriggerDropdown, animationTiming.focusDelay, isInitialStep]);

  // Handle selection for the current step
  const handleSelection = (value: Option) => {
    if (!currentStep) return;
    
    // Update selections with new value
    const newSelections = {
      ...selections,
      [currentStep.id]: value
    };
    
    setSelections(newSelections);
    
    // Set flag that initial selection was made (for animations)
    if (!hasInitialSelection) {
      setHasInitialSelection(true);
    }
    
    // Move to next step if available
    if (currentStepIndex < steps.length - 1) {
      // Add delay before transitioning
      setTimeout(() => {
        setCurrentStepIndex(currentStepIndex + 1);
      }, animationTiming.transitionDelay);
    } else {
      // We've reached the final step
      onComplete?.(newSelections);
      // Clear the dropdown trigger to ensure it's off
      setShouldTriggerDropdown(false);
      
      // Ensure input is blurred to prevent keyboard from staying open on mobile
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  // Go back to previous step
  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className="relative w-full h-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={`step-${currentStepIndex}`}
            // Disable animation for first render, enable for subsequent renders
            initial={isFirstRender ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ 
              duration: animationTiming.animationDuration, 
              ease: "easeInOut"
            }}
            className="absolute inset-0 w-full"
          >
            <div className="relative">
              {currentStep && (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      {currentStepIndex > 0 && (
                        <button 
                          type="button"
                          onClick={handleBack}
                          className="p-0.5 rounded-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                          aria-label="العودة للخطوة السابقة"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <div className="text-sm font-medium text-gray-700">
                        {currentStep.title}
                      </div>
                    </div>
                  </div>

                  <AutoComplete
                    options={currentOptions}
                    emptyMessage={currentStep.emptyMessage}
                    placeholder={currentStep.placeholder}
                    onValueChange={handleSelection}
                    value={selections[currentStep.id]}
                    ref={inputRef}
                    isLastStep={isLastStep && currentStepIndex === steps.length - 1}
                    animationTiming={animationTiming}
                    shouldTriggerDropdown={shouldTriggerDropdown}
                    maxDropdownHeight={maxDropdownHeight}
                  />
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 