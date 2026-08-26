import { Outlet } from "react-router-dom";
import { Navbar } from "../navigation/Navbar";
import { MobileStickyCTA } from "../navigation/MobileStickyCTA";
import { Footer } from "./Footer";
import { StructuredData } from "../seo/StructuredData";

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <StructuredData />
      <Navbar />
      <main className="flex-1 pb-24 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileStickyCTA />
    </div>
  );
}
