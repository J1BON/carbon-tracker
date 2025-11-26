import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import ScrollToTop from "@/components/ScrollToTop";
import Login from "@/pages/Login";
import Dashboard from "@/features/dashboard/Dashboard";
import TreePlanting from "@/features/tree-planting/TreePlanting";
import Leaderboard from "@/features/leaderboard/Leaderboard";
import Onboarding from "@/features/onboarding/Onboarding";
import CFCReportForm from "@/features/cfc/CFCReportForm";
import LearnAboutCFC from "@/features/cfc/LearnAboutCFC";
import MyCFCReports from "@/features/cfc/MyCFCReports";
import EcoTipsChatbot from "@/features/cfc/EcoTipsChatbot";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Resources from "@/pages/Resources";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import ResourceDetail from "@/pages/ResourceDetail";
import AdminDashboard from "@/features/admin/AdminDashboard";
import UserManagement from "@/features/admin/UserManagement";
import ContentManagement from "@/features/admin/ContentManagement";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tree-planting"
            element={
              <ProtectedRoute>
                <TreePlanting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route
            path="/cfc/report"
            element={
              <ProtectedRoute>
                <CFCReportForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cfc/my-reports"
            element={
              <ProtectedRoute>
                <MyCFCReports />
              </ProtectedRoute>
            }
          />
          <Route path="/cfc/learn" element={<LearnAboutCFC />} />
          <Route
            path="/cfc/chatbot"
            element={
              <ProtectedRoute>
                <EcoTipsChatbot />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/resources/:id" element={<ResourceDetail />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/content"
            element={
              <AdminRoute>
                <ContentManagement />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

