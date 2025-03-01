import * as React from "react"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command"
import { useState, useRef, useCallback, type KeyboardEvent, forwardRef, useEffect, useLayoutEffect } from "react"
import { createPortal } from "react-dom"

export type Option = Record<"value" | "label", string> & Record<string, string>

type AutoCompleteProps = {
  options: Option[]
  emptyMessage: string
  value?: Option
  onValueChange?: (value: Option) => void
  isLoading?: boolean
  disabled?: boolean
  placeholder?: string
  isLastStep?: boolean
}

export const AutoComplete = forwardRef<HTMLInputElement, AutoCompleteProps>(({
  options,
  placeholder,
  emptyMessage,
  value,
  onValueChange,
  disabled,
  isLoading = false,
  isLastStep = false,
}, forwardedRef) => {
  // Ensure options is always an array
  const safeOptions = Array.isArray(options) ? options : []
  
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

  const [isOpen, setIsOpen] = useState(false)
  const [isPositioned, setIsPositioned] = useState(false)
  const [selected, setSelected] = useState<Option | undefined>(value)
  const [inputValue, setInputValue] = useState<string>(value?.label || "")
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [isMouseOverDropdown, setIsMouseOverDropdown] = useState(false)

  // Combine the forwarded ref with our internal ref
  const handleRefs = (el: HTMLInputElement | null) => {
    inputRef.current = el
    
    if (typeof forwardedRef === 'function') {
      forwardedRef(el)
    } else if (forwardedRef) {
      forwardedRef.current = el
    }
  }

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
  const handleBlur = useCallback((e: React.FocusEvent) => {
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
  }, [selected, isMouseOverDropdown]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (!input) return

      if (!isOpen) {
        setIsOpen(true)
      }

      if (event.key === "Enter" && input.value !== "") {
        const optionToSelect = safeOptions.find(
          (option) => option.label === input.value,
        )
        if (optionToSelect) {
          setSelected(optionToSelect)
          onValueChange?.(optionToSelect)
        }
      }

      if (event.key === "Escape") {
        input.blur()
      }
    },
    [isOpen, safeOptions, onValueChange],
  )

  const handleSelect = useCallback(
    (selectedOption: Option) => {
      setInputValue(selectedOption.label)
      setSelected(selectedOption)
      onValueChange?.(selectedOption)

      // Close dropdown immediately if this is the last step
      if (isLastStep) {
        setIsOpen(false)
      } else {
        // Original behavior for non-last steps
        setTimeout(() => {
          inputRef?.current?.blur()
        }, 0)
      }
    },
    [onValueChange, isLastStep]
  )

  // Create dropdown portal content
  const dropdownContent = (isOpen && isPositioned) ? (
    <div
      ref={dropdownRef}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${width}px`,
        zIndex: 9999,
        maxWidth: 'calc(100vw - 40px)',
        transform: 'translateZ(0)',
        willChange: 'transform',
        opacity: 1,
      }}
      className="bg-white rounded-md border shadow-md isolate py-2"
      onMouseEnter={() => setIsMouseOverDropdown(true)}
      onMouseLeave={() => setIsMouseOverDropdown(false)}
    >
      <Command shouldFilter={false} className="overflow-hidden">
        <CommandList className="max-h-[300px]">
          {safeOptions.length > 0 ? (
            <CommandGroup>
              {safeOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option)}
                  className="cursor-pointer px-3"
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
    </div>
  ) : null;

  return (
    <div ref={inputWrapperRef} className="relative w-full">
      <Command shouldFilter={false} className="w-full">
        <CommandInput
          ref={handleRefs}
          value={inputValue}
          onValueChange={isLoading ? undefined : setInputValue}
          onBlur={handleBlur}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="text-base w-full"
        />
        <div className="hidden">
          <CommandList>
            <CommandGroup>
              {safeOptions.map((option) => (
                <CommandItem key={option.value} value={option.value}>
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