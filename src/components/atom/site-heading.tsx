"use client";
import React from 'react';

type Props = {
    title: string;
    description: string;
    align?: 'center' | 'start'; // Optional alignment prop
};

const SiteHeading = ({ title, description, align = 'center' }: Props) => {

    return (
        <div className={`flex flex-col gap-1 sm:gap-2 ${align === 'start' ? 'items-start' : 'items-center'} py-4 md:py-10`}>
            <h2 className="font-heading text-4xl leading-[1.1] sm:text-2xl md:text-5xl">
                {title}
            </h2>

            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                {description}
            </p>
        </div>
    );
};

export default SiteHeading;
