import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { Navbar, Footer } from '@/components/layout/Navbar';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage, RegisterPage, VerifyOtpPage, ForgotPasswordPage, ResetPasswordPage } from '@/pages/AuthPages';
import { RoadmapPage, ChapterPage } from '@/pages/RoadmapPage';
import { LessonPage } from '@/pages/LessonPage';
import { QuizPage } from '@/pages/QuizPage';
import { DashboardPage, BookmarksPage, SettingsPage, AdminPage } from '@/pages/DashboardPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { DevopsRoadmapPage } from '@/pages/DevopsRoadmapPage';
import { useThemeStore } from '@/stores';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1 },
  },
});

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp" element={<VerifyOtpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/devops-roadmap" element={<DevopsRoadmapPage />} />
            <Route path="/chapter/:slug" element={<ChapterPage />} />
            <Route path="/lesson/:slug" element={<LessonPage />} />
            <Route path="/quiz/:slug" element={<QuizPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </AppLayout>
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
