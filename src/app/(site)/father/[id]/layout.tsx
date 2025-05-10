import React from 'react';

export default function FatherLayout({
  children,
  params,
}: {
  children: React.ReactNode,
  params: { id: string }
}) {
  return (
    <>
      <header className="py-6 border-b mb-6">
        <h1 className="text-2xl font-bold">الأب: {params.id}</h1>
        {/* يمكن إضافة مكون تنقل هنا لاحقاً */}
      </header>
      <main className="container mx-auto">
        {children}
      </main>
    </>
  );
}
