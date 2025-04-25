"use client"
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Image } from '@imagekit/next';

interface ArticleItem {
    title: string;
    description: string;
    link: string;
    image: string;
    date: string;
    author: string;
}

interface HoverEffectProps {
    items: ArticleItem[];
    className?: string;
}

export const ArticleHoverEffect = ({ items, className }: HoverEffectProps) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div
            className={cn(
                "grid grid-cols-1 lg:grid-cols-2 gap-6 py-10",
                className
            )}
        >
            {items.map((item, idx) => (
                <Link
                    href={item?.link}
                    key={item?.link}
                    className="relative group block p-2 h-full w-full"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <AnimatePresence>
                        {hoveredIndex === idx && (
                            <motion.span
                                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-lg"
                                layoutId="hoverBackground"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    transition: { duration: 0.15 },
                                }}
                                exit={{
                                    opacity: 0,
                                    transition: { duration: 0.15, delay: 0.2 },
                                }}
                            />
                        )}
                    </AnimatePresence>
                    <ArticleCard>
                        <div className="flex gap-6">
                            <div className="md:w-1/3 w-[30%] relative md:h-[140px] h-[80px] overflow-hidden rounded-lg">
                                {/* Replace Next.js Image with ImageKit Image */}
                                <Image
                                    src={convertToImageKitPath(item.image)}
                                    alt={item.title}
                                    width={0}
                                    height={0}
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: "cover" 
                                    }}
                                    loading="lazy"
                                    urlEndpoint="https://ik.imagekit.io/your_imagekit_id"
                                />
                            </div>
                            <div className="w-2/3 flex flex-col justify-between md:py-2 py-0">
                                <div className="md:space-y-3 space-y-1">
                                    <ArticleTitle>{item.title}</ArticleTitle>
                                    <ArticleDescription>{item.description}</ArticleDescription>
                                </div>
                                <p className="flex md:items-center items-start md:gap-2 gap-1 md:text-sm text-xs pt-2 md:pt-0">
                                    <span>{item.author}</span>
                                    <span className="">·</span>
                                    <span>{item.date}</span>
                                </p>
                            </div>
                        </div>
                    </ArticleCard>
                </Link>
            ))}
        </div>
    );
};

// Helper function to convert public paths to ImageKit paths
// Replace numeric characters with letters (1=a, 2=b, etc.)
export function convertToImageKitPath(imagePath: string): string {
    // If the path already starts with 'http', it's an external URL, use web proxy format
    if (imagePath.startsWith('http')) {
        return `${imagePath}`;
    }
    
    // For local paths, we need to transform them according to the mapping rule
    // Assuming the same directory structure is maintained in ImageKit
    const transformedPath = imagePath.replace(/\/(\d+)\.jpg/g, (match, number) => {
        // Convert each digit to corresponding letter (1 -> a, 2 -> b, etc.)
        const letters = number.split('').map((digit: string) => {
            const charCode = 'a'.charCodeAt(0) + parseInt(digit, 10) - 1;
            return String.fromCharCode(charCode);
        }).join('');
        
        return `/${letters}.jpg`;
    });
    
    return transformedPath;
}

const ArticleCard = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "h-full w-full overflow-hidden dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
                className
            )}
        >
            <div className="relative z-50">
                <div className="p-[0.1px]">{children}</div>
            </div>
        </div>
    );
};

const ArticleTitle = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <h4 className={cn("font-bold tracking-wide text-lg line-clamp-2 md:line-clamp-1 pl-8 md:pl-0", className)}>
            {children}
        </h4>
    );
};

const ArticleDescription = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <p className={cn("tracking-wide leading-relaxed text-sm line-clamp-2", className)}>
            {children}
        </p>
    );
};

export default ArticleHoverEffect; 