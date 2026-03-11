'use client';

import { ReactNode } from 'react';

interface LibrariesLayoutProps {
  children: ReactNode;
}

export default function LibrariesLayout({ children }: LibrariesLayoutProps) {
  return (
    <div className="h-full bg-gray-50">
      {children}
    </div>
  );
}
