import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import Image from 'next/image';
import { Icon } from '@iconify/react';

const MapSection = () => {
  const coordinates = {
    lat: 15.5721983,
    lng: 32.5455813
  };

  return (
    <>
      <div className='flex gap-2 items-center pr-3'>
        <Icon icon='fluent:location-48-regular' width={20} />
        <h5 className='text-xl font-semibold'>دار الحركة</h5>
      </div>
      <div className="w-full  mx-auto">



        <Card className="w-full">
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Map Image Container */}

              <div className=" bg-muted rounded-lg overflow-hidden relative">
                {/* Placeholder Map Image */}
                <Image src="/map.avif" alt="Map" width={500} height={2200} className="" />
                <Button
                  className="w-full h-20 text-[16px] font-semibold rounded-tl-none rounded-tr-none"
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`)}
                >
                  <Navigation className="mr-2 h-6 w-6" />

                  احصل على الاتجاهات
                </Button>


              </div>

              {/* Info Section */}
              <div className="space-y-6 bg-neutral-100 p-6 rounded-lg">
                <div className="flex items-start space-x-4">
                  {/* <MapPin className="h-6 w-6 mt-1 flex-shrink-0" /> */}
                  <div>
                    <h3 className="font-semibold text-lg dark:text-black">العنوان</h3>
                    <p className="text-muted-foreground">
                      العمارات, شارع 35 جمب السفارة السعودية
                      <br />
                      الخرطوم - السودان

                    </p>

                    {/* <Button 
                    variant="link" 
                    className="px-0 mt-2 h-auto font-normal"
                    onClick={() => {
                      navigator.clipboard.writeText('National Movement for Construction and Development, Khartoum, Sudan');
                    }}
                  >
                    Copy Address
                  </Button> */}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  {/* <Phone className="h-6 w-6 mt-1 flex-shrink-0" /> */}
                  <div>
                    <h3 className="font-semibold text-lg dark:text-black">الاتصال</h3>
                    <p dir='ltr' className="text-muted-foreground">+249 (91) 715-0001</p>
                    <Button
                      variant="link"
                      className="px-0 mt-2 h-auto font-normal text-black"
                      onClick={() => {
                        window.location.href = 'tel:+1234567890';
                      }}
                    >
                      اتصل الان
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  {/* <Clock className="h-6 w-6 mt-1 flex-shrink-0" /> */}
                  <div>
                    <h3 className="font-semibold text-lg dark:text-black">الوقت</h3>
                    <p className="text-muted-foreground">
                      كل الاسبوع من الساعة 4:00 الى 10:00
                      <br />
                      الذروة بعد المغرب
                    </p>
                  </div>
                </div>


              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};


export default MapSection;