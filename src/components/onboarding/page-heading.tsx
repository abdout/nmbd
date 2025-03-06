"use client";
import React from 'react';

type Props = {
    title: string;
    description: string;
};

const SiteHeading = ({ title, description }: Props) => {

    return (
        <div className="flex flex-col gap-1 items-center sm:gap-2 ">
            <h2 className="font-heading text-2xl leading-[1.1] sm:text-2xl md:text-4xl">
                {title}
            </h2>

            <p className="max-w-full md:max-w-[85%] leading-normal text-muted-foreground text-[13px]  md:text-[16px] md:leading-7">
                {description}
            </p>
            
        </div>
    );
};

export default SiteHeading;
