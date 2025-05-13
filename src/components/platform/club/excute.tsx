'use client';
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { cardsData } from "./constant";


const MobileExcute = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* <div className='flex gap-2 justify-start items-center pr-1'>
        <Icon icon='codicon:verified' width={16} />
        <h6 className="text-sm">المكتب التنفيذي</h6>
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center justify-center px-8 md:px-0">
        {cardsData.map((card, index) => (
          <Card key={index} className="group w-full md:w-[180px] flex  p-4 gap-6 items-center  relative border border-transparent">
           
              
            <Image
              src={card.image}
              alt={card.name}
              width={100}
              height={100}
              className="rounded-full object-cover object-center w-24 h-24"
            />
            <div className="flex flex-col">
              <p className="font-light">{card.name}</p>
              <h5>{card.rank}</h5>
              
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

const DesktopExcute = () => {
  return (
    <div className="flex flex-col gap-6 ">
      {/* <div className='flex gap-2 justify-start items-center pr-1'>
        <Icon icon='codicon:verified' width={20} />
        <h5>المكتب التنفيذي</h5>
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center justify-center">
        {cardsData.map((card, index) => (
          <Card key={index} className="group w-full md:w-[180px] flex flex-col p-3 gap-2 items-center justify-center relative border border-transparent">
           
            <Image
              src={card.image}
              alt={card.name}
              width={75}
              height={75}
              className="rounded-full object-cover object-center w-20 h-20"
            />
            <div className="flex flex-col items-center justify-center">
              <p className="font-light">{card.name}</p>
              <h6>{card.rank}</h6>
              
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

const Excute = () => {
  return (
    <div>
      <div className="block md:hidden">
        <MobileExcute />
      </div>
      <div className="hidden md:block">
        <DesktopExcute />
      </div>
    </div>
  );
}

export default Excute;
