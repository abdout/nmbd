"use client";
import { FC, useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface Item {
  label: string;
  value: string;
}

interface SelectPopoverProps {
  items: Item[];
  selectedItem: Item | null;
  setSelectedItem: (item: Item | null) => void;
  label: string;
  className?: string;
}

const SelectPopover: FC<SelectPopoverProps> = ({
  items,
  selectedItem,
  setSelectedItem,
  label,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate dynamic height based on number of items
  const dropdownHeight = useMemo(() => {
    const itemHeight = 36; // height of each item in pixels
    const maxHeight = 192; // h-48 = 12rem = 192px
    const minHeight = 80; // minimum height for the dropdown
    const searchInputHeight = 40; // height of search input
    const padding = 8; // padding for the container

    const contentHeight = (filteredItems.length * itemHeight) + searchInputHeight + padding;
    
    if (contentHeight < minHeight) return minHeight;
    if (contentHeight > maxHeight) return maxHeight;
    return contentHeight;
  }, [filteredItems.length]);

  return (
    <div className={cn("relative w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => setOpen(!open)}
          >
            <span>{selectedItem ? selectedItem.label : label}</span>
            <ChevronDown className="h-5 w-5 text-gray-400 transition-transform" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="p-0 z-50 w-[--radix-popover-trigger-width] min-w-[200px]" 
          side="bottom" 
          align="start"
          sideOffset={5}
        >
          <Command className="overflow-visible">
            <div className="border-b border-gray-200 [&>div]:border-0 [&>div>input]:border-0 [&>div>input]:outline-0 [&>div>input]:ring-0 [&>div>input:focus]:ring-0 [&>div>input:focus]:outline-0 [&>div>input:focus]:border-0">
              <CommandInput 
                placeholder="بحث..." 
                value={searchTerm}
                onValueChange={setSearchTerm}
                dir="rtl"
              />
            </div>
            <div className="relative">
              <ScrollArea 
                className={cn("transition-height duration-200")} 
                style={{ height: `${dropdownHeight}px` }}
                dir="rtl"
              >
                <CommandList>
                  <CommandEmpty className="p-2 text-center text-sm text-gray-500">لا توجد نتائج</CommandEmpty>
                  <CommandGroup>
                    {filteredItems.map((item) => (
                      <CommandItem
                        key={item.value}
                        value={item.value}
                        onSelect={(value) => {
                          const selectedOption = items.find((item) => item.value === value);
                          if (selectedOption) {
                            setSelectedItem(selectedOption);
                            setOpen(false);
                          }
                        }}
                        className="flex w-full items-center justify-between py-2 px-4 cursor-pointer"
                      >
                        <span className="text-right">{item.label}</span>
                        {selectedItem?.value === item.value && (
                          <Check className="h-4 w-4 text-blue-500" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </ScrollArea>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SelectPopover; 