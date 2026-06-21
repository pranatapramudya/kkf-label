import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { FloatingCSButton } from "@/components/FloatingCSButton";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">{children}</main>
      <Footer />
      <FloatingCSButton />
    </>
  );
}
