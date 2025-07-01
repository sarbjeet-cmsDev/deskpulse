'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <div className="mx-auto max-w-full">
      <div className={isAdmin ? 'mx-auto' : 'container mx-auto px-6 py-8'}>
        {children}
      </div>
    </div>
  );
}