"use client";
import React from 'react';

type HeadProps = {
    title: string;
    description: string;
};

const Head = ({ title, description }: HeadProps) => {

    return (
        <div className="flex flex-col gap-1 sm:gap-2 items-center py-10">
            <h2 className="font-heading text-xl leading-[1.1] sm:text-2xl md:text-5xl">
                {title}
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                {description}
            </p>
        </div>
    );
};

export default Head;
