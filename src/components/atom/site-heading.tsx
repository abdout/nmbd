"use client";
import React from 'react';

type Props = {
    title: string;
    description: string;
    align?: 'center' | 'start' | 'end'; // Added 'end' as an alignment option
    size?: 'sm' | 'md' | 'lg'; // Added 'lg' as a size option
    className?: string; // Added optional className for custom styling
};

const SiteHeading = ({ 
    title, 
    description, 
    align = 'center', 
    size = 'lg', 
    className = '' 
}: Props) => {
    // Determine alignment classes
    const alignClasses = {
        'center': 'items-center text-center',
        'start': 'items-start text-start',
        'end': 'items-end text-end'
    };

    // Determine size classes
    const titleSizeClasses = {
        'sm': 'text-xl sm:text-2xl font-medium',
        'md': 'text-3xl sm:text-4xl md:text-4xl font-semibold',
        'lg': 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold'
    };

    const descriptionSizeClasses = {
        'sm': 'text-sm sm:text-base',
        'md': 'text-base sm:text-lg',
        'lg': 'text-base sm:text-lg md:text-xl'
    };

    const spacingClasses = {
        'sm': 'gap-1 pb-2',
        'md': 'gap-2 py-2 md:py-4',
        'lg': 'gap-2 sm:gap-3 py-4 md:py-6 lg:py-8'
    };

    return (
        <div className={`flex flex-col ${alignClasses[align]} ${spacingClasses[size]} ${className}`}>
            <h2 className={`font-heading leading-tight ${titleSizeClasses[size]}`}>
                {title}
            </h2>

            <p className={`max-w-prose leading-normal text-muted-foreground ${descriptionSizeClasses[size]}`}>
                {description}
            </p>
        </div>
    );
};

export default SiteHeading;
