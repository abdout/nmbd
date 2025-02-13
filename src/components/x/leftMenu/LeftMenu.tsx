import Link from "next/link";
import Image from "next/image";
import ProfileCard from "./ProfileCard";

const menuItems = [
  { label: "الاشعارات", icon: "/x/bell.png", href: "#" },
  { label: "الرسائل", icon: "/x/mail.png", href: "#" },
  { label: "الدليل", icon: "/x/book.png", href: "#" },
  { label: "المساعدة", icon: "/x/help.png", href: "#" },
  
];

const LeftMenu = ({ type }: { type: "home" | "profile" }) => {
  return (
    <div className="flex flex-col gap-6">
      <ProfileCard />
      <div className="flex flex-col gap-2">
        {menuItems.map((item, index) => (
          <div key={index}>
            <Link href={item.href} className="flex items-center gap-4 p-2 reveal-less">
              <Image src={item.icon} alt={item.label} width={25} height={25} />
              <p className="hidden lg:block text-sm font-medium">
                {item.label}
              </p>
            </Link>
            {index !== menuItems.length - 1 && <hr className="border-t-1 border-gray-50 w-36 self-center" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftMenu;
