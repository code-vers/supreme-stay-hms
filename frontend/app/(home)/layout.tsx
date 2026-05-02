import Footer from "../../components/shared/footer";
import Navbar from "../../components/shared/navbar";
import type { ReactNode } from "react";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <main className='flex-1 bg-secondary'>{children}</main>
      <Footer />
    </div>
  );
}
