import { SiteConfig } from "./type"

export const siteConfig: SiteConfig = {
  name: "المنصة",
  description:
    "An open source application built using the new router, server components and everything new in Next.js 13.",
  url: "https://nmbdsd.org",
  ogImage: "https://tx.shadcn.com/og.jpg",
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/taxonomy",
  },
}

import { DocsConfig } from "./type"

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Guides",
      href: "/guides",
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
        },
      ],
    },
    {
      title: "Documentation",
      items: [
        {
          title: "Introduction",
          href: "/docs/documentation",
        },
        {
          title: "Contentlayer",
          href: "/docs/in-progress",
          disabled: true,
        },
        {
          title: "Components",
          href: "/docs/documentation/components",
        },
        {
          title: "Code Blocks",
          href: "/docs/documentation/code-blocks",
        },
        {
          title: "Style Guide",
          href: "/docs/documentation/style-guide",
        },
        {
          title: "Search",
          href: "/docs/in-progress",
          disabled: true,
        },
      ],
    },
    {
      title: "Blog",
      items: [
        {
          title: "Introduction",
          href: "/docs/in-progress",
          disabled: true,
        },
        {
          title: "Build your own",
          href: "/docs/in-progress",
          disabled: true,
        },
        {
          title: "Writing Posts",
          href: "/docs/in-progress",
          disabled: true,
        },
      ],
    },
    {
      title: "Dashboard",
      items: [
        {
          title: "Introduction",
          href: "/docs/in-progress",
          disabled: true,
        },
        {
          title: "Layouts",
          href: "/docs/in-progress",
          disabled: true,
        },
        {
          title: "Server Components",
          href: "/docs/in-progress",
          disabled: true,
        },
        {
          title: "Authentication",
          href: "/docs/in-progress",
          disabled: true,
        },
        {
          title: "Database with Prisma",
          href: "/docs/in-progress",
          disabled: true,
        },
        {
          title: "API Routes",
          href: "/docs/in-progress",
          disabled: true,
        },
      ],
    },
    {
      title: "Marketing Site",
      items: [
        {
          title: "Introduction",
          href: "/docs/in-progress",
          disabled: true,
        },
        {
          title: "File Structure",
          href: "/docs/in-progress",
          disabled: true,
        },
        {
          title: "Tailwind CSS",
          href: "/docs/in-progress",
          disabled: true,
        },
        {
          title: "Typography",
          href: "/docs/in-progress",
          disabled: true,
        },
      ],
    },
  ],
}

import { MarketingConfig } from "@/components/template/header-taxonomy/type"

export const marketingConfig: MarketingConfig = {
  mainNav: [
    {
      title: "فريق",
      href: "/member",
    },
    {
      title: "مشروع",
      href: "/project",
    },

    {
      title: "مهمة",
      href: "/task",
    },

    {
      title: "ورقة",
      href: "/paper",
    },

    {
      title: "امانة",
      href: "/club",
    },
    {
      title: "مال",
      href: "/finance",
    },
    
    {
      title: "العضوية",
      href: "/membership/applications",
      roleRequired: ["ADMIN", "MEMBERSHIP_SECRETARY"],
    },
  ],
}