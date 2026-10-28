import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartPanel } from './CartPanel';

export function StorefrontLayout() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, search]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5EF] text-[#292B27]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartPanel />
    </div>
  );
}
