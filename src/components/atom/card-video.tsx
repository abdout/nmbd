'use client'
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { VideoIcon } from "lucide-react";
import OptimizedImage from "@/components/image/optimum-image";

interface CardItem {
    title: string;
    description: string;
    link: string;
    image: string;
    date: string;
    author: string;
}

interface HoverEffectProps {
    items: CardItem[];
    className?: string;
}

export const HoverEffect = ({ items, className }: HoverEffectProps) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // If there are no items, return null
    if (!items || items.length === 0) {
        return null;
    }

    // Extract the first item for the featured section
    const featuredItem = items[0];
    // Remaining items for the grid
    const gridItems = items.slice(1);

    return (
        <div className="space-y-10">
            {/* Featured Video Section */}
            <Link
                href={`/video/${featuredItem?.link}`}
                className="relative group block w-full rounded-lg overflow-hidden hover:bg-neutral-50 dark:hover:bg-slate-800/[0.4] transition-all duration-200"
                onMouseEnter={() => setHoveredIndex(-1)} // Use -1 for featured item
                onMouseLeave={() => setHoveredIndex(null)}
            >
                <AnimatePresence>
                    {hoveredIndex === -1 && (
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
                <div className="flex flex-col md:flex-row gap-6 p-2 relative z-20">
                    <div className="md:w-2/5 aspect-video relative overflow-hidden rounded-lg">
                        <div className="absolute top-2 right-2 z-10">
                            <div className="bg-black/50 p-2.5 rounded-full">
                                <VideoIcon className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <OptimizedImage
                            src={featuredItem.image}
                            alt={featuredItem.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 40vw"
                            transformations={[
                                { quality: 80 },
                                { format: "auto" }
                            ]}
                            objectFit="cover"
                        />
                    </div>
                    <div className="md:w-3/5 flex flex-col justify-center space-y-4">
                        <h2 className="text-2xl md:text-3xl font-bold">{featuredItem.title}</h2>
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{featuredItem.description}</p>
                        <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>{featuredItem.author}</span>
                            <span>·</span>
                            <span>{featuredItem.date}</span>
                        </p>
                    </div>
                </div>
            </Link>

            {/* Grid for remaining videos */}
            <div
                className={cn(
                    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10",
                    className
                )}
            >
                {gridItems.map((item, idx) => (
                    <Link
                        href={`/video/${item?.link}`} key={item?.link}
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
                        <Card>
                            <div className="aspect-video relative w-full overflow-hidden rounded-lg">
                                <div className="absolute top-2 right-2 z-10">
                                    <div className="bg-black/50 p-1.5 rounded-full">
                                        <VideoIcon className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                                <OptimizedImage
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    transformations={[
                                        { quality: 80 },
                                        { format: "auto" }
                                    ]}
                                    objectFit="cover"
                                />
                            </div>
                            <CardTitle>{item.title}</CardTitle>
                            <p className="flex items-center gap-2 text-sm ">
                                <span>{item.author}</span>
                                <span>·</span>
                                <span>{item.date}</span>
                            </p>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export const Card = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "h-full w-full overflow-hidden  dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
                className
            )}
        >
            <div className="relative z-50">
                <div className=" p-[0.1px]">{children}</div>
            </div>
        </div>
    );
};

export const CardTitle = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <h4 className={cn(" font-bold tracking-wide text-xl md:text-lg line-clamp-1 pt-3 pb-1", className)}>
            {children}
        </h4>
    );
};

export const CardDescription = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <p className={cn("text-zinc-400 tracking-wide leading-relaxed text-sm ", className)}>
            {children}
        </p>
    );
};

export default HoverEffect;