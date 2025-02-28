'use client'
import { useState, useRef, useEffect } from "react"
import { AutoComplete, Option } from "./auto-complete"
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

// Type for animation timing configuration
export type AnimationTiming = {
  // Delay before starting transition after selection
  transitionDelay: number;
  // Duration of the animation
  animationDuration: number;
  // Delay before triggering dropdown after animation
  dropdownDelay: number;
  // Delay before focusing the input
  focusDelay: number;
}

// Default animation timings
const DEFAULT_TIMING: AnimationTiming = {
  transitionDelay: 300,
  animationDuration: 0.4,
  dropdownDelay: 800,
  focusDelay: 50
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
}

export function AnimatedHierarchicalSelect({
  steps,
  timing = {},
  onComplete,
  className = ""
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

  // Get the current step configuration
  const currentStep = steps[currentStepIndex];

  // Update options when step changes or previous selections change
  useEffect(() => {
    if (currentStep) {
      const options = currentStep.getOptions(selections);
      setCurrentOptions(options);
    }
  }, [currentStep, selections]);

  // Handle animation and transition when step changes
  useEffect(() => {
    // Reset dropdown trigger state
    setShouldTriggerDropdown(false);
    
    // Only set timer to trigger dropdown if not in initial step
    if (!isInitialStep) {
      // Set a timer to trigger the dropdown after animation
      const dropdownTimer = setTimeout(() => {
        setShouldTriggerDropdown(true);
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
    
    // Check if this is the last step
    const isLastStep = currentStepIndex === steps.length - 1;
    
    if (isLastStep) {
      // For last step, delay completion to ensure value is visible
      setTimeout(() => {
        onComplete?.(newSelections);
        setShouldTriggerDropdown(false);
      }, 150); // Slightly longer than auto-complete's delay
    } else {
      // For non-last steps, transition after delay
      setTimeout(() => {
        setCurrentStepIndex(currentStepIndex + 1);
      }, animationTiming.transitionDelay);
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
      <div className="relative w-full h-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={`step-${currentStepIndex}`}
            initial={hasInitialSelection ? { 
              opacity: 0,
              scale: 0.01,
              transformOrigin: "center center"
            } : { opacity: 1, scale: 1 }}
            animate={{ 
              opacity: 1,
              scale: 1
            }}
            exit={hasInitialSelection ? { 
              opacity: 0,
              scale: 0.01,
              transformOrigin: "center center"
            } : { opacity: 0 }}
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
                    isLastStep={currentStepIndex === steps.length - 1}
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