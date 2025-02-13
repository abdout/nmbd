'use client';
import { Icon } from "@iconify/react";
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface SidebarItemProps {
  label: string;
  icon: string;
  href?: string;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  label, href, onClick, icon
}) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    if (onClick) {
      return onClick();
    } else if (href) {
      router.push(href);
    }
  }, [router, onClick, href]);

  return (
    <div onClick={handleClick} className="flex flex-row items-center">
      <div className="
        relative
        rounded-full 
        h-14
        w-14
        flex
        items-center
        justify-center 
        p-4
        hover:bg-slate-300 
        hover:bg-opacity-10 
        cursor-pointer 
        lg:hidden
      ">
        <Icon icon={icon} height="24" />
      </div>
      <div className="
        relative
        hidden 
        lg:flex 
        items-row 
        gap-2 
        px-4
        py-2 
        rounded-full 
        hover:bg-slate-300 
        hover:bg-opacity-10 
        cursor-pointer
        items-center
      ">
        <Icon icon={icon || 'carbon:help'} height="20" />

        <p className="hidden lg:block text-sm font-medium">
          {label}
        </p>
      </div>
    </div>
  )
}

export default SidebarItem;
