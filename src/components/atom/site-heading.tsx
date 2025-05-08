"use client";
import React from 'react';

type Props = {
    title: string;
    description: string;
    align?: 'center' | 'start'; // Optional alignment prop
    size?: 'sm' | 'md'; // Added 'md' as a size option
};

const SiteHeading = ({ title, description, align = 'center', size }: Props) => {

    return (
        <div className={`flex flex-col gap-1 sm:gap-2 ${align === 'start' ? 'items-start' : 'items-center'}${size === 'sm' || size === 'md' ? '' : ' py-4 md:py-10'}`}>
            <h2 className={`font-heading leading-[1.1] ${
                size === 'sm' 
                    ? 'text-3xl' 
                    : size === 'md'
                        ? 'text-2xl sm:text-3xl md:text-4xl font-bold'
                        : 'text-4xl sm:text-2xl md:text-5xl'
            }`}>
                {title}
            </h2>

            <p className={`max-w-[85%] leading-normal text-muted-foreground ${
                size === 'md' ? 'sm:text-xl sm:leading-8' : 'sm:text-lg sm:leading-7'
            }`}>
                {description}
            </p>
        </div>
    );
};

export default SiteHeading;
