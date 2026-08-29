import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";

export default function PublicLayout({ children }) {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />

        {/* Main Content Area - Full width */}
        <div className="w-full flex flex-col min-h-screen relative overflow-x-hidden">
          {/* No padding top because Navbar is fixed and translucent. Pages like Home will span behind it. */}
          <main className="grow">{children}</main>

          <Footer />
        </div>

        <ScrollToTop />
      </div>
    </>
  );
}
