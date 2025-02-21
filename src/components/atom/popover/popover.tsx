"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

interface Item {
  label: string;
  value: string;
}

interface SelectPopoverProps {
  items: Item[];
  selectedItem: Item | null;
  setSelectedItem: (item: Item | null) => void;
  label: string;
}

const SelectPopover: React.FC<SelectPopoverProps> = ({ items, selectedItem, setSelectedItem, label }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] h-10 justify-between">
            {selectedItem ? <>{selectedItem.label}</> : <>{label}</>}
            <ChevronDown className=" h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 z-50 relative" side="bottom" align="start">
          <Command>
            <CommandInput placeholder={`أبحث عن ${label} ...`} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(value) => {
                      setSelectedItem(
                        items.find((item) => item.value === value) || null
                      );
                      setOpen(false);
                    }}
                  >
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

    </div>
  )
}

export default SelectPopover;