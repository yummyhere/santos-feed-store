import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { StorefrontLayout } from './components/StorefrontLayout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { PreOrder } from './pages/PreOrder';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { POSLayout } from './pos/POSLayout';
import { POS } from './pages/POS';
import { Inventory } from './pages/Inventory';
import { SalesHistory } from './pages/SalesHistory';

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Storefront Experience */}
          <Route element={<StorefrontLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/pre-order" element={<PreOrder />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Desktop-First Barcode POS & Inventory UI */}
          <Route path="/pos" element={<POSLayout />}>
            <Route index element={<POS />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="history" element={<SalesHistory />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
