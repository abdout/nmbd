import * as React from "react"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command"
import { useState, useRef, useCallback, forwardRef, useEffect, useLayoutEffect, useMemo } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"

export type Option = Record<"value" | "label", string> & Record<string, string>

// Animation timing properties from parent component
export type AnimationTiming = {
  transitionDelay: number;
  animationDuration: number;
  dropdownDelay: number;
  focusDelay: number;
}

// Export the props type so it can be referenced in other components
export type AutoCompleteProps = {
  options: Option[]
  emptyMessage: string
  value?: Option
  onValueChange?: (value: Option) => void
  isLoading?: boolean
  disabled?: boolean
  placeholder?: string
  isLastStep?: boolean
  // Optional animation timing for dropdown
  animationTiming?: AnimationTiming
  // Optional flag to trigger dropdown programmatically
  shouldTriggerDropdown?: boolean
  // Optional max height for dropdown menu - defaults to 200px
  maxDropdownHeight?: number
}

// Dropdown animation variants
const dropdownVariants = {
  hidden: { 
    opacity: 0,
    y: -5,
    scale: 0.98,
    transformOrigin: "top center",
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: [0.4, 0.0, 0.2, 1], // Custom easing for smooth animation
    }
  },
  exit: { 
    opacity: 0,
    y: -5,
    scale: 0.98,
    transition: {
      duration: 0.15,
      ease: "easeOut"
    }
  }
};

export const AutoComplete = forwardRef<HTMLInputElement, AutoCompleteProps>(({
  options,
  placeholder,
  emptyMessage,
  value,
  onValueChange,
  disabled,
  isLoading = false,
  isLastStep = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  animationTiming,
  shouldTriggerDropdown = false,
  maxDropdownHeight = 200, // Default max height of 200px
}, forwardedRef) => {
  // Ensure options is always an array, wrapped in useMemo to avoid dependency changes
  const safeOptions = useMemo(() => Array.isArray(options) ? options : [], [options]);
  
  const inputRef = useRef<HTMLInputElement>(null)
  const inputWrapperRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const initialPositionRef = useRef<{
    top: number;
    left: number;
    width: number;
    inputWidth: number;
    inputRect: DOMRect | null;
  } | null>(null)
  const [width, setWidth] = useState(0)

  // State to control dropdown visibility
  const [isOpen, setIsOpen] = useState(false)
  const [isPositioned, setIsPositioned] = useState(false)
  const [selected, setSelected] = useState<Option | undefined>(value)
  const [inputValue, setInputValue] = useState<string>(value?.label || "")
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [isMouseOverDropdown, setIsMouseOverDropdown] = useState(false)
  // Store previous shouldTriggerDropdown value to detect changes
  const prevTriggerRef = useRef(shouldTriggerDropdown)
  // Flag to disable focus-based opening entirely
  const disableFocusOpenRef = useRef(false)
  
  // Combine the forwarded ref with our internal ref
  const handleRefs = (el: HTMLInputElement | null) => {
    inputRef.current = el
    
    if (typeof forwardedRef === 'function') {
      forwardedRef(el)
    } else if (forwardedRef) {
      forwardedRef.current = el
    }
  }

  // Critical dropdown control - completely rewritten to be simpler and more reliable
  useEffect(() => {
    // Only act on true->false or false->true transitions to avoid repeat triggers
    const prevTrigger = prevTriggerRef.current;
    prevTriggerRef.current = shouldTriggerDropdown;
    
    // If should trigger changed from false to true
    if (shouldTriggerDropdown && !prevTrigger && !disabled && !isLastStep) {
      // Temporarily disable focus-based opening to prevent double-trigger
      disableFocusOpenRef.current = true;
      
      // Open the dropdown
      setIsOpen(true);
      
      // After a delay, re-enable focus-based opening
      const timer = setTimeout(() => {
        disableFocusOpenRef.current = false;
      }, 1000); // Longer timeout to ensure no overlap
      
      return () => clearTimeout(timer);
    }
  }, [shouldTriggerDropdown, disabled, isLastStep]);

  // Function to calculate position
  const updatePosition = useCallback(() => {
    if (!inputWrapperRef.current) return

    const rect = inputWrapperRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const inputWidth = rect.width
    
    // Add 2px buffer to the width calculation for perfect matching
    const calculatedWidth = Math.max(inputWidth, 220) + 2
    
    // Center the dropdown under the input
    const inputCenterX = rect.left + (inputWidth / 2)
    let leftPos = inputCenterX - (calculatedWidth / 2)
    
    // Viewport boundary checks
    if (leftPos + calculatedWidth > viewportWidth - 20) {
      leftPos = viewportWidth - calculatedWidth - 20
    }
    if (leftPos < 20) {
      leftPos = 20
    }

    const DROPDOWN_OFFSET = 8 // Fixed offset for all steps

    setWidth(calculatedWidth)
    setPosition({
      top: Math.round(rect.bottom + DROPDOWN_OFFSET),
      left: Math.round(leftPos)
    })
  }, [])

  // Update position when dropdown opens or options change
  useLayoutEffect(() => {
    if (!isOpen) {
      setIsPositioned(false)
      return
    }

    // Initial position calculation
    updatePosition()

    // Wait for DOM to settle and calculate again
    const timer = setTimeout(() => {
      updatePosition()
      setIsPositioned(true)
    }, 100) // Increased from 50ms to 100ms for better stability

    return () => {
      clearTimeout(timer)
      setIsPositioned(false)
    }
  }, [isOpen, safeOptions, updatePosition])

  // Handle resize
  useLayoutEffect(() => {
    if (!isOpen) return
    
    const handleResize = () => {
      setIsPositioned(false)
      updatePosition()
      requestAnimationFrame(() => {
        setIsPositioned(true)
      })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen, updatePosition])

  // Handle scroll
  useLayoutEffect(() => {
    if (!isOpen) return
    
    const handleScroll = () => {
      setIsPositioned(false)
      updatePosition()
      requestAnimationFrame(() => {
        setIsPositioned(true)
      })
    }
    window.addEventListener('scroll', handleScroll, true)
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [isOpen, updatePosition])

  // Reset position reference when component unmounts
  useEffect(() => {
    return () => {
      initialPositionRef.current = null
    }
  }, [])

  // Remove position reference completely as we're not using it anymore
  const handleBlur = useCallback(() => {
    // If this is the last step and we have a selection, close immediately
    if (isLastStep && selected) {
      setIsOpen(false);
      setInputValue(selected.label || "");
      return;
    }
    
    setTimeout(() => {
      if (isMouseOverDropdown && !document.activeElement?.matches('input')) {
        if (inputRef.current) {
          inputRef.current.focus();
        }
        return;
      }
      
      setIsOpen(false);
      setInputValue(selected?.label || "");
    }, 50);
  }, [selected, isMouseOverDropdown, setInputValue, isLastStep]);

  const handleSelect = useCallback(
    (selectedOption: Option) => {
      setInputValue(selectedOption.label)
      setSelected(selectedOption)
      onValueChange?.(selectedOption)

      // Always close dropdown immediately - force closing the dropdown
      setIsOpen(false);
      setIsMouseOverDropdown(false);
      
      // Blur input immediately to ensure the dropdown doesn't reopen
      inputRef.current?.blur();
      
      // Set a flag to prevent focus event from reopening dropdown
      disableFocusOpenRef.current = true;
      
      // Reset the flag after a short delay to allow for future interactions
      setTimeout(() => {
        disableFocusOpenRef.current = false;
      }, 300);
    },
    [onValueChange]
  )

  // Simplified focus handler that respects the disable flag
  const handleFocus = useCallback(() => {
    // Skip opening if the programmatic disable is active
    if (disableFocusOpenRef.current) {
      return;
    }
    
    // Only open on focus for manual interaction (not completed steps)
    if ((!isLastStep || !selected) && !disabled) {
      setIsOpen(true);
    }
  }, [isLastStep, selected, disabled]);

  // Use a key for AnimatePresence to force a fresh animation
  const animationKey = useMemo(() => 
    `dropdown-${isOpen ? 'open' : 'closed'}-${Date.now()}`, 
    [isOpen]
  );

  // Create dropdown portal content
  const dropdownContent = (isOpen && isPositioned) ? (
    <AnimatePresence>
      <motion.div
        key={animationKey}
        ref={dropdownRef}
        style={{
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: `${width}px`,
          zIndex: 9999,
          maxWidth: 'calc(100vw - 40px)',
          willChange: 'transform',
        }}
        className="bg-white rounded-md border shadow-md isolate py-2"
        onMouseEnter={() => setIsMouseOverDropdown(true)}
        onMouseLeave={() => setIsMouseOverDropdown(false)}
        variants={dropdownVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Command shouldFilter={false} className="overflow-hidden">
          <CommandList style={{ maxHeight: `${maxDropdownHeight}px` }} className="overflow-y-auto">
            {safeOptions.length > 0 ? (
              <CommandGroup>
                {safeOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option)}
                    className="cursor-pointer px-3 text-sm"
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <div className="py-6 text-center text-sm text-gray-500">
                {emptyMessage}
              </div>
            )}
          </CommandList>
        </Command>
      </motion.div>
    </AnimatePresence>
  ) : null;

  return (
    <div ref={inputWrapperRef} className="relative w-full">
      <Command shouldFilter={false} className="w-full">
        <CommandInput
          ref={handleRefs}
          value={inputValue}
          onValueChange={isLoading ? undefined : setInputValue}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          className="text-base w-full"
        />
        <div className="hidden">
          <CommandList>
            <CommandGroup>
              {safeOptions.map((option) => (
                <CommandItem key={option.value} value={option.value} className="text-sm">
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </div>
      </Command>
      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  )
})

AutoComplete.displayName = "AutoComplete"

