"use client"
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import OptimizedImage from "@/components/image/optimum-image";
import { useState } from "react";
import { 
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger
} from "@/components/ui/context-menu";
import { Edit, Trash, Share, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

interface ArticleItem {
    title: string;
    description: string;
    link: string;
    image: string;
    date: string;
    author: string;
    id?: string; // Optional ID for edit/delete operations
}

interface HoverEffectProps {
    items: ArticleItem[];
    className?: string;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onShare?: (item: ArticleItem) => void;
}

export const ArticleHoverEffect = ({ 
    items, 
    className,
    onEdit = () => {},
    onDelete = () => {},
    onShare = () => {}
}: HoverEffectProps) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const router = useRouter();

    const handleEdit = (item: ArticleItem) => {
        if (item.id) {
            onEdit(item.id);
        }
    };

    const handleDelete = (item: ArticleItem) => {
        if (item.id) {
            onDelete(item.id);
        }
    };

    const handleShare = (item: ArticleItem) => {
        onShare(item);
    };

    const handleOpen = (link: string) => {
        router.push(link);
    };

    return (
        <div
            className={cn(
                "grid grid-cols-1 lg:grid-cols-2 gap-6 py-10",
                className
            )}
        >
            {items.map((item, idx) => (
                <ContextMenu key={item?.link}>
                    <ContextMenuTrigger>
                        <div
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
                            <Link href={item?.link}>
                    <ArticleCard>
                        <div className="flex gap-6">
                            <div className="md:w-1/3 w-[30%] relative md:h-[140px] h-[80px] overflow-hidden rounded-lg">
                                <OptimizedImage
                                    src={item.image}
                                    alt={item.title}
                                    fill={true}
                                    sizes="(max-width: 768px) 33vw, 25vw"
                                    objectFit="cover"
                                    loading="lazy"
                                    convertPath={false}
                                    transformations={[
                                        { quality: 80 },
                                        { format: "auto" }
                                    ]}
                                />
                            </div>
                            <div className="w-2/3 flex flex-col justify-between md:py-2 py-0">
                                <div className="md:space-y-3 space-y-1">
                                    <ArticleTitle>{item.title}</ArticleTitle>
                                    <ArticleDescription>{item.description}</ArticleDescription>
                                </div>
                                <p className="flex md:items-center items-start md:gap-2 gap-1 md:text-sm text-xs pt-2 md:pt-0 ">
                                    <span>{item.author}</span>
                                                <span className="text-lg font-bold mx-1">·</span>
                                    <span>{item.date}</span>
                                </p>
                            </div>
                        </div>
                    </ArticleCard>
                </Link>
                        </div>
                    </ContextMenuTrigger>
                    
                    <ContextMenuContent className="text-right [direction:rtl]">
                        <ContextMenuItem className="flex flex-row-reverse justify-start items-center text-right w-full pr-0" onClick={() => handleOpen(item.link)}>
                            <span className="flex-grow text-right">فتح</span>
                            <ExternalLink className="mr-2 flex-shrink-0" size={16} />
                        </ContextMenuItem>
                        
                        <ContextMenuItem className="flex flex-row-reverse justify-start items-center text-right w-full pr-0" onClick={() => handleEdit(item)}>
                            <span className="flex-grow text-right">تعديل</span>
                            <Edit className="mr-2 flex-shrink-0" size={16} />
                        </ContextMenuItem>
                        
                        <ContextMenuItem className="flex flex-row-reverse justify-start items-center text-right w-full pr-0" onClick={() => handleShare(item)}>
                            <span className="flex-grow text-right">مشاركة</span>
                            <Share className="mr-2 flex-shrink-0" size={16} />
                        </ContextMenuItem>
                        
                        <ContextMenuSeparator />
                        
                        <ContextMenuItem className="flex flex-row-reverse justify-start items-center text-right w-full pr-0" onClick={() => handleDelete(item)} variant="destructive">
                            <span className="flex-grow text-right">حذف</span>
                            <Trash className="mr-2 flex-shrink-0" size={16} />
                        </ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>
            ))}
        </div>
    );
};

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
        <p className={cn(" tracking-wide leading-relaxed text-sm line-clamp-2", className)}>
            {children}
        </p>
    );
};

export default ArticleHoverEffect;