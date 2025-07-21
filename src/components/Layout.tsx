import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ChatWidget } from "./ChatWidget";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="relative flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};