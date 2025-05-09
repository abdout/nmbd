import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test Lab",
  description: "Development testing area",
};

export default function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {children}
    </div>
  );
} 