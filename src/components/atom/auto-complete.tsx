import {
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
  const inputRef = useRef<HTMLInputElement>(null)
  const inputWrapperRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Combine the forwarded ref with our internal ref
  const handleRefs = (el: HTMLInputElement | null) => {
    inputRef.current = el;
    
    if (typeof forwardedRef === 'function') {
      forwardedRef(el);
    } else if (forwardedRef) {
      forwardedRef.current = el;
    }
  };

  const [isOpen, setOpen] = useState(false)
  const [selected, setSelected] = useState<Option>(value as Option)
  const [inputValue, setInputValue] = useState<string>(value?.label || "")
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, placement: 'bottom' })
  const [isMouseOverDropdown, setIsMouseOverDropdown] = useState(false)

  // Update position when the dropdown is opened - use layout effect for more accurate measurements
  useLayoutEffect(() => {
    if (isOpen && inputWrapperRef.current) {
      const rect = inputWrapperRef.current.getBoundingClientRect()
      const dropdownHeight = 192; // 12rem = 48 * 4px = 192px
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // Determine if dropdown should appear above or below
      const placement = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight 
        ? 'top' 
        : 'bottom';
      
      setPosition({
        top: placement === 'bottom' 
          ? rect.bottom + window.scrollY + 5 // 5px gap below
          : rect.top + window.scrollY - dropdownHeight - 5, // 5px gap above
        left: rect.left + window.scrollX,
        width: rect.width,
        placement
      });
    }
  }, [isOpen])

  // Also update position on resize
  useEffect(() => {
    if (!isOpen) return
    
    const handleResize = () => {
      if (inputWrapperRef.current) {
        const rect = inputWrapperRef.current.getBoundingClientRect()
        const dropdownHeight = 192; // 12rem = 48 * 4px = 192px
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        // Determine if dropdown should appear above or below
        const placement = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight 
          ? 'top' 
          : 'bottom';
        
        setPosition({
          top: placement === 'bottom' 
            ? rect.bottom + window.scrollY + 5 // 5px gap below
            : rect.top + window.scrollY - dropdownHeight - 5, // 5px gap above
          left: rect.left + window.scrollX,
          width: rect.width,
          placement
        });
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  // Handle scroll events on the document
  useEffect(() => {
    if (!isOpen) return
    
    const handleScroll = () => {
      if (inputWrapperRef.current) {
        const rect = inputWrapperRef.current.getBoundingClientRect()
        const dropdownHeight = 192; // 12rem = 48 * 4px = 192px
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        // Determine if dropdown should appear above or below
        const placement = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight 
          ? 'top' 
          : 'bottom';
        
        setPosition({
          top: placement === 'bottom' 
            ? rect.bottom + window.scrollY + 5 // 5px gap below
            : rect.top + window.scrollY - dropdownHeight - 5, // 5px gap above
          left: rect.left + window.scrollX,
          width: rect.width,
          placement
        });
      }
    }
    
    window.addEventListener('scroll', handleScroll, true)
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [isOpen])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (!input) {
        return
      }

      // Keep the options displayed when the user is typing
      if (!isOpen) {
        setOpen(true)
      }

      // This is not a default behaviour of the <input /> field
      if (event.key === "Enter" && input.value !== "") {
        const optionToSelect = options.find(
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
    [isOpen, options, onValueChange],
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
      setOpen(false);
      setInputValue(selected?.label || "");
    }
  }, [selected, isMouseOverDropdown]);

  const handleSelectOption = useCallback(
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
      className="fixed z-50 rounded-xl outline-none shadow-lg animate-in fade-in-0 zoom-in-95"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
      }}
      onMouseEnter={() => setIsMouseOverDropdown(true)}
      onMouseLeave={() => setIsMouseOverDropdown(false)}
    >
      <div className="rounded-lg ring-1 ring-slate-200 bg-background">
        <ScrollArea dir="rtl" className="h-48">
          <CommandList>
            {isLoading ? (
              <CommandPrimitive.Loading>
                <div className="p-1">
                  <Skeleton className="h-8 w-full" />
                </div>
              </CommandPrimitive.Loading>
            ) : null}
            {options.length > 0 && !isLoading ? (
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selected?.value === option.value
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onMouseDown={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                      }}
                      onSelect={() => handleSelectOption(option)}
                      className={cn(
                        "flex w-full items-center gap-2",
                        !isSelected ? "pl-8" : null,
                      )}
                    >
                      {isSelected ? <Check className="w-4" /> : null}
                      {option.label}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ) : null}
            {!isLoading ? (
              <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
                {emptyMessage}
              </CommandPrimitive.Empty>
            ) : null}
          </CommandList>
        </ScrollArea>
      </div>
    </div>
  ) : null;

  return (
    <CommandPrimitive onKeyDown={handleKeyDown}>
      <div ref={inputWrapperRef} className="w-full">
        <CommandInput
          ref={handleRefs}
          value={inputValue}
          onValueChange={isLoading ? undefined : setInputValue}
          onBlur={handleBlur}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="text-base w-full"
        />
      </div>
      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </CommandPrimitive>
  )
})

AutoComplete.displayName = "AutoComplete"