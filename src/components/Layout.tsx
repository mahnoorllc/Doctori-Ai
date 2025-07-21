import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { ChatWidget } from "./ChatWidget";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="relative">
        <Outlet />
      </main>
      <ChatWidget />
    </div>
  );
};