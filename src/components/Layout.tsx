import { PropsWithChildren } from 'react';
import { BottomNav } from './BottomNav';
import { Header } from './Header';

export const Layout = ({ children }: PropsWithChildren) => (
  <div className="min-h-screen pb-24">
    <Header />
    <main className="mx-auto w-full max-w-5xl px-4 py-6">{children}</main>
    <BottomNav />
  </div>
);
