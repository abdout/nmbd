'use client'
import React, { useState, memo } from 'react';
import { Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Icon } from '@iconify/react';

// Office types
type OfficeId = 'riyadh' | 'alkhobar';

interface Office {
  id: OfficeId;
  title: string;
  address: string[];
  phone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  mapImage: string;
}

// Constants for location data
const OFFICES: Record<OfficeId, Office> = {
  riyadh: {
    id: 'riyadh',
    title: "دار الخرطوم",
    address: [
      "العمارات, شارع 35 جمب السفارة السعودية",
      "الخرطوم - السودان"
    ],
    phone: "+249 911 123-4567",
    coordinates: {
      lat: 24.7136,
      lng: 46.6753
    },
    mapImage: "/map.avif"
  },
  alkhobar: {
    id: 'alkhobar',
    title: "دار الخرطوم",
    address: [
      "العمارات, شارع 35 جمب السفارة السعودية",
      "الخرطوم - السودان"
    ],
    phone: "+966 (13) 867-5309",
    coordinates: {
      lat: 26.2172,
      lng: 50.1971
    },
    mapImage: "/map.avif"
  }
};

const MapPage = () => {
  const [selectedOffice, setSelectedOffice] = useState(OFFICES.riyadh);

  const handleGetDirections = () => 
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedOffice.coordinates.lat},${selectedOffice.coordinates.lng}`);
  
  const handleOfficeSelect = (officeId: OfficeId) => {
    setSelectedOffice(OFFICES[officeId]);
  };

  return (
    <>
      <div className='flex gap-2 items-center pr-3'>
        <Icon icon='fluent:location-48-regular' width={20} />
        <h5 className='text-xl font-semibold'>دار الحركة</h5>
      </div>
      
      <div className="w-full overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Map Image Container */}
          <div className="flex flex-col h-full overflow-hidden rounded-lg">
            <div className="relative h-[300px] w-full">
              <Image 
                src={selectedOffice.mapImage}
                alt={`Map of ${selectedOffice.title}`}
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover" 
              />
            </div>
            <Button
              className="w-full h-16 text-base font-semibold rounded-none border-t"
              onClick={handleGetDirections}
            >
              <Navigation className="mr-2 h-5 w-5" />
              Get Directions
            </Button>
          </div>

          {/* Info Section */}
          <div className="space-y-6 px-6 rounded-lg">
            {Object.values(OFFICES).map((office) => (
              <div 
                key={office.id}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedOffice.id === office.id ? 'bg-neutral-50' : 'hover:bg-neutral-50/50'}`}
                onClick={() => handleOfficeSelect(office.id)}
              >
                <h3 className='font-bold'>{office.title}</h3>
                <p className="text-muted-foreground">
                  {office.address.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}<br />
                    </React.Fragment>
                  ))}
                  {office.phone}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(MapPage);