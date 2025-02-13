// components/SideBar.tsx
import { signOut } from 'next-auth/react';
import SidebarLogo from './SidebarLogo';
import SidebarItem from './SidebarItem';
import SidebarTweetButton from './SidebarTweetButton';
const SideBar = () => {
  

  // Define the items to display in the sidebar
  const items = [
    {
        label: "الاشعارات",
        icon: "carbon:notification",
        href: "/",
    },
    {
        label: "الرسائل",
        icon: "lets-icons:message-light",
        href: "/",
    },
    {
        label: "الدليل",
        icon: "ph:book",
        href: "/",
    },
    {
        label: "المساعدة",
        icon: "ph:headset",
        href: "/",
    }
];

  return (
    <div className="col-span-1 h-full ">
      <div className="flex flex-col items-end">
        <div className="space-y-2 lg:w-[200px]">
          {/* <SidebarLogo /> */}
          {items.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
            />
          ))}
          
            {/* <SidebarItem
             
              
              label="Logout"
            /> */}
          
          {/* <SidebarTweetButton /> */}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
