import Link from "next/link"

const desktopFooterSections = [
  {
    title: "الحركة",
    links: [
      { text: "حول", href: "/about" },
      { text: "الاطار", href: "/vision" },
      { text: "السياسة", href: "/values" },
      { text: "الفريق", href: "/team" }
    ]
  },
  {
    title: "المشاريع",
    links: [
      { text: "المبادرات", href: "/initiatives" },
      { text: "البرامج", href: "/programs" },
      { text: "الشراكات", href: "/partnerships" },
      { text: "التطوع", href: "/volunteer" }
    ]
  },
  {
    title: "الإعلام",
    links: [
      { text: "الأخبار", href: "/news" },
      { text: "الفعاليات", href: "/events" },
      { text: "المقالات", href: "/articles" },
      { text: "الوثائقيات", href: "/documents" }
    ]
  },
  {
    title: "الاتصال",
    links: [
      { text: "اتصل بنا", href: "/contact" },
      { text: "الفروع", href: "/branches" },
      { text: "الدعم", href: "/support" },
      { text: "انضم إلينا", href: "/join" }
    ]
  }
]

const mobileFooterLinks = [
  { text: "حول", href: "/about" },
  { text: "الاطار", href: "/vision" },
  { text: "المبادرات", href: "/initiatives" },
  { text: "البرامج", href: "/programs" },
  { text: "الأخبار", href: "/news" },
  { text: "الفعاليات", href: "/events" },
  { text: "اتصل بنا", href: "/contact" },
  { text: "انضم إلينا", href: "/join" }
]

const DesktopFooter = () => {
  return (
    <div className="hidden md:block">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-20 gap-y-10 md:gap-44 pr-12">
        {desktopFooterSections.map((section, index) => (
          <div key={index} className="w-full text-right">
            <h3 className="text-lg font-bold text-black dark:text-neutral-100">
              {section.title}
            </h3>
            <ul className="space-y-2 mt-2">
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors duration-200"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

const MobileFooter = () => {
  return (
    <div className="md:hidden overflow-x-auto">
      <div className="flex flex-wrap gap-2 justify-center">
        {mobileFooterLinks.map((link, index) => (
          <div key={index} className="flex items-center justify-center">
            <Link
              href={link.href}
              className="text-sm text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors duration-200 whitespace-nowrap"
            >
              {link.text}
            </Link>
            {index < mobileFooterLinks.length - 1 && (
              <span className="mx-2 text-gray-400 dark:text-neutral-600">•</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-black antialiased font-sans text-gray-700 dark:text-neutral-300 py-6 md:py-10 relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] w-screen flex items-center justify-center mt-4">
      <div className="w-full max-w-7xl px-4">
        <DesktopFooter />
        <MobileFooter />
        
        <hr className="my-4 md:my-6 border-gray-200 dark:border-neutral-800" />
        <div className="flex gap-8 pr-3 md:pr-12 items-center justify-start text-gray-500 dark:text-neutral-400">
          <p>السودان</p>
          <p>العربية</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer