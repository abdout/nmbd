import { FC, useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle popover
  const togglePopover = () => {
    setIsOpen(!isOpen);
    setSearchTerm('');
  };

  // Handle item selection
  const handleSelect = (item: Item) => {
    setSelectedItem(item);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${className}`} ref={popoverRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={togglePopover}
        className="w-full flex items-center justify-between p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span>{selectedItem ? selectedItem.label : label}</span>
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown popover */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-300">
          {/* Search input */}
          <div className="p-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="rtl"
            />
          </div>

          {/* Items list */}
          <ul className="max-h-60 overflow-auto py-1">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <li
                  key={item.value}
                  onClick={() => handleSelect(item)}
                  className="cursor-pointer hover:bg-gray-100 px-4 py-2 flex items-center justify-between"
                >
                  <span className="text-right">{item.label}</span>
                  {selectedItem?.value === item.value && (
                    <Check className="h-4 w-4 text-blue-500" />
                  )}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500 text-center">لا توجد نتائج</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SelectPopover; 