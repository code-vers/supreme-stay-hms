import Footer from "../../components/shared/footer";
import Navbar from "../../components/shared/navbar";

export default function HomeLayout({ children }) {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
}
