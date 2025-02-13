import React from 'react';
import { club } from './constant';
import { FeatureCard } from './card';

const AllFeatures = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-2xl md:text-3xl">
          الامانات
        </h2>
        <p className="  pb-7">
        سلطان العشق في الله ارضيك وين
        </p>

        <div className="w-full">
          <div className="items-center justify-center grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-5 gap-6">
            {club.map((feature) => (
              <FeatureCard key={feature.id} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllFeatures;