"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { authors } from "./constant";
import { author } from "./type";

interface AuthorProps {
  selectedAuthor: author | null;
  setSelectedAuthor: (author: author | null) => void;
}

const Author: React.FC<AuthorProps> = ({ selectedAuthor: initialAuthor, setSelectedAuthor: updateAuthor }) => {
  const [open, setOpen] = React.useState(false)
  const [selectedAuthor, setSelectedAuthor] = React.useState<author | null>(initialAuthor)

  const handleSelect = (value: string) => {
    const author = authors.find((author) => author.value === value) || null;
    setSelectedAuthor(author);
    updateAuthor(author);  // Call the parent's update function
    setOpen(false);
  };

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedAuthor ? <>{selectedAuthor.label}</> : <>+ اختر كاتب</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="bottom" align="start">
          <Command>
            <CommandInput placeholder="أبحث عن كاتب ..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {authors.map((author) => (
                  <CommandItem
                    key={author.value}
                    value={author.value}
                    onSelect={handleSelect}
                  >
                    {author.label}
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

export default Author