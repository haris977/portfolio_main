import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { FloatingNav } from "@/components/ui/FloatingNavbar";
import { navItems } from "@/data";

export default function Home() {
  return (
    <main className="relative z-10 min-h-screen bg-gradient-radial  flex flex-col items-center justify-center">

      <div className="w-full ">
        <FloatingNav navItems={navItems}/>
        <Hero />
        <Footer />
      </div>
      <div>
      </div>
    </main>
  );
}
