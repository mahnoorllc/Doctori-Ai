
import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import ChatSummary from "./pages/ChatSummary";
import Doctors from "./pages/Doctors";
import DoctorProfile from "./pages/DoctorProfile";
import Medicine from "./pages/Medicine";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const HealthTipsBD = lazy(() => import('./pages/HealthTipsBD'));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Index />} />
                  <Route path="chat" element={<Chat />} />
                  <Route path="chat-summary" element={<ChatSummary />} />
                  <Route path="doctors" element={<Doctors />} />
                  <Route path="doctor/:id" element={<DoctorProfile />} />
                  <Route path="medicine" element={<Medicine />} />
                  {/* Blog routes */}
                  <Route path="blog" element={<Blog />}>
                    <Route path="health-tips-bd" element={<HealthTipsBD />} />
                  </Route>
                  <Route path="blog/:slug" element={<BlogPost />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="login" element={<Login />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="doctor-dashboard" element={<DoctorDashboard />} />
                  <Route path="admin" element={<AdminDashboard />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
