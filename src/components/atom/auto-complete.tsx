import * as React from "react"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"
import { useState, useRef, useCallback, type KeyboardEvent, forwardRef, useEffect, useLayoutEffect } from "react"
import { createPortal } from "react-dom"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Skeleton } from "@/components/ui/skeleton"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export type Option = Record<"value" | "label", string> & Record<string, string>

type AutoCompleteProps = {
  options: Option[]
  emptyMessage: string
  value?: Option
  onValueChange?: (value: Option) => void
  isLoading?: boolean
  disabled?: boolean
  placeholder?: string
}

export const AutoComplete = forwardRef<HTMLInputElement, AutoCompleteProps>(({
  options,
  placeholder,
  emptyMessage,
  value,
  onValueChange,
  disabled,
  isLoading = false,
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

    // First time calculation - only if we don't have a position stored
    if (!initialPositionRef.current) {
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

      // Store initial measurements - this will now persist until component unmounts
      initialPositionRef.current = {
        top: rect.bottom + 8,
        left: leftPos,
        width: calculatedWidth,
        inputWidth: inputWidth,
        inputRect: rect
      }
    }

    // Always use the stored position, just update the top position based on current input position
    setWidth(initialPositionRef.current?.width || rect.width)
    setPosition({
      top: rect.bottom + 8,
      left: initialPositionRef.current?.left || rect.left
    })
  }, [])

  // Remove the reset of initialPositionRef when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      // Don't reset the position reference anymore
      // initialPositionRef.current = null
    }
  }, [isOpen])

  // Add cleanup when component unmounts
  useEffect(() => {
    return () => {
      initialPositionRef.current = null
    }
  }, [])

  // Update position when dropdown opens or options change
  useEffect(() => {
    if (!isOpen) return

    updatePosition()
    // Increase the delay slightly to ensure stable positioning
    const timer = setTimeout(updatePosition, 100)
    return () => clearTimeout(timer)
  }, [isOpen, safeOptions, updatePosition])

  // Handle resize
  useEffect(() => {
    if (!isOpen) return
    
    const handleResize = () => updatePosition()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen, updatePosition])

  // Handle scroll
  useEffect(() => {
    if (!isOpen) return
    
    const handleScroll = () => updatePosition()
    window.addEventListener('scroll', handleScroll, true)
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [isOpen, updatePosition])

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

  const handleBlur = useCallback((e: React.FocusEvent) => {
    // If the blur event is being triggered but mouse is over dropdown, don't close it
    if (isMouseOverDropdown) {
      // Refocus the input to prevent closing
      setTimeout(() => {
        if (inputRef.current && isMouseOverDropdown) {
          inputRef.current.focus();
        }
      }, 0);
      return;
    }
    
    // Only close if we're not clicking inside the dropdown
    if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
      setInputValue(selected?.label || "");
    }
  }, [selected, isMouseOverDropdown]);

  const handleSelect = useCallback(
    (selectedOption: Option) => {
      setInputValue(selectedOption.label)

      setSelected(selectedOption)
      onValueChange?.(selectedOption)

      // This is a hack to prevent the input from being focused after the user selects an option
      // We can call this hack: "The next tick"
      setTimeout(() => {
        inputRef?.current?.blur()
      }, 0)
    },
    [onValueChange],
  )

  // Create dropdown portal content
  const dropdownContent = isOpen ? (
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
        willChange: 'transform' // Optimize animations
      }}
      className="bg-white rounded-md border shadow-md isolate py-2" // Increased padding
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