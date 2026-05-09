import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import Layout from '@/components/Layout';
import Index from '@/pages/Index';
import SOSPage from '@/pages/SOS';
import SOSHistory from '@/pages/SOSHistory';
import MedicalPage from '@/pages/Medical';
import RestroomsPage from '@/pages/Restrooms';
import ResourcesPage from '@/pages/Resources';
import ProfilePage from '@/pages/Profile';
import AuthPage from '@/components/SignIn';
import NotFound from '@/pages/NotFound';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-empowerHer-purple"></div>
    </div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout><Outlet /></Layout>}>
        <Route index element={<Index />} />
        <Route path="sos" element={<SOSPage />} />
        <Route path="sos-history" element={<SOSHistory />} />
        <Route path="medical" element={<MedicalPage />} />
        <Route path="restrooms" element={<RestroomsPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="sign-in" element={<AuthPage />} />
        <Route path="sign-up" element={<AuthPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 