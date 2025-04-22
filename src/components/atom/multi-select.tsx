"use client";

import * as React from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

export type Option = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: Option[];
  onChange: (selected: Option[]) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  onFocus,
  onBlur
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0, width: 0 });

  // Update position when container changes or when open state changes
  React.useEffect(() => {
    if (containerRef.current && open) {
      // Use a series of measurements to catch the expansion at different points
      const updatePosition = () => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setDropdownPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width + 2 // Add 2px to ensure it's not smaller
          });
        }
      };
      
      // Immediate measurement
      updatePosition();
      
      // Measurement after longer delays to ensure we catch the fully expanded width
      const timer1 = setTimeout(updatePosition, 200);
      const timer2 = setTimeout(updatePosition, 400);
      const timer3 = setTimeout(updatePosition, 600);
      const timer4 = setTimeout(updatePosition, 800);
      const timer5 = setTimeout(updatePosition, 1000);

      // Update position on scroll and resize
      const handlePositionChange = () => {
        if (containerRef.current) {
          const newRect = containerRef.current.getBoundingClientRect();
          setDropdownPosition({
            top: newRect.bottom + window.scrollY,
            left: newRect.left + window.scrollX,
            width: newRect.width + 2 // Add 2px to ensure it's not smaller
          });
        }
      };

      window.addEventListener("scroll", handlePositionChange);
      window.addEventListener("resize", handlePositionChange);

      return () => {
        window.removeEventListener("scroll", handlePositionChange);
        window.removeEventListener("resize", handlePositionChange);
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
      };
    }
  }, [open, containerRef.current]);

  const handleUnselect = React.useCallback((option: Option) => {
    onChange(selected.filter((s) => s.value !== option.value));
  }, [onChange, selected]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            onChange(selected.slice(0, -1));
          }
        }
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [onChange, selected]
  );

  const selectables = options.filter(
    (option) => !selected.includes(option)
  );

  const handleInputFocus = () => {
    setOpen(true);
    
    // Delay to capture the expanded width after focus animation completes
    setTimeout(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width
        });
      }
    }, 300); // Longer delay to ensure we capture the fully expanded width
    
    if (onFocus) onFocus();
  };

  const handleInputBlur = () => {
    // Small delay to allow clicking on menu items
    setTimeout(() => {
      setOpen(false);
      if (onBlur) onBlur();
    }, 100);
  };

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div 
        ref={containerRef}
        className="group rounded-md border border-input px-3 py-2 text-sm transition-colors focus-within:outline-none focus-within:ring-1 focus-within:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        <div className="flex overflow-x-auto whitespace-nowrap no-scrollbar w-44 h-5 gap-1">
          {selected.length > 2 && (
            <Badge 
              variant="secondary"
              className="px-1.5 py-0 text-xs flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
            >
              +{selected.length - 2}
            </Badge>
          )}
          {selected.slice(Math.max(0, selected.length - 2)).map((option) => {
            return (
              <Badge 
                key={option.value} 
                variant="secondary"
                className="px-1.5 py-0 text-xs flex-shrink-0 max-w-[80px]"
              >
                <span className="truncate max-w-[50px] inline-block">
                  {option.label}
                </span>
                <button
                  className="ml-0.5 rounded-full outline-none focus:ring-1 focus:ring-ring focus-visible:outline-none focus-visible:ring-1 flex-shrink-0"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(option);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(option)}
                >
                  <X className="h-2.5 w-2.5 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            placeholder={selected.length > 0 ? "" : placeholder}
            className="ml-1 flex-1 bg-transparent outline-none placeholder:text-muted-foreground text-xs min-w-[30px]"
          />
        </div>
      </div>
      
      {open && selectables.length > 0 && createPortal(
        <div 
          className="fixed z-[9999]"
          style={{
            top: `${dropdownPosition.top + 8}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
          }}
        >
          <div className="rounded-md border bg-popover text-popover-foreground shadow-md">
            <CommandList className="max-h-[200px] overflow-auto">
              <CommandGroup>
                {selectables.map((option) => (
                  <CommandItem
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue("");
                      onChange([...selected, option]);
                    }}
                    className="cursor-pointer text-sm"
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </div>
        </div>,
        document.body
      )}
    </Command>
  );
}