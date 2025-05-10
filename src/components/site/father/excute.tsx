'use client';
import { Card } from "@/components/ui/card";
import React from "react";

const cardsData = [
  {
    name: "اسم المسؤول",
    rank: "الرتبة",
    image: "/placeholder.png",
    email: "mdi:email",
    phone: "mdi:phone",
    send: "example@example.com",
    dail: "+1234567890",
  },
];

const Excute = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className='flex gap-2 justify-start items-center pr-1'>
        <h6>المكتب التنفيذي للأب</h6>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center justify-center px-8 md:px-0">
        {cardsData.map((card, index) => (
          <Card key={index} className="group w-full md:w-[180px] flex  p-4 gap-6 items-center  relative border border-transparent">
            <img
              src={card.image}
              alt={card.name}
              width={100}
              height={100}
              className="rounded-full object-cover object-center w-24 h-24"
            />
            <div className="flex flex-col">
              <p className="font-light">{card.name}</p>
              <h5>{card.rank}</h5>
              <div className="flex gap-4 pt-2">
                <a href={`mailto:${card.send}`} aria-label={`Email ${card.name}`}>
                  <span role="img" aria-label="email">📧</span>
                </a>
                <a href={`tel:${card.dail}`} aria-label={`Call ${card.name}`}>
                  <span role="img" aria-label="phone">📞</span>
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Excute; 