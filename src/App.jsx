import { useState, useEffect, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase/config';
import SEO from './components/SEO';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollProgress from './components/layout/ScrollProgress';
import CustomCursor from './components/ui/CustomCursor';
import Loader from './components/layout/Loader';
import SmoothScroll from './components/layout/SmoothScroll';

const Home = lazy(() => import('./pages/Home'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const Careers = lazy(() => import('./pages/Careers.jsx'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ProjectManager = lazy(() => import('./pages/admin/ProjectManager'));
const FranchiseManager = lazy(() => import('./pages/admin/FranchiseManager'));
const JobManager = lazy(() => import('./pages/admin/JobManager'));
const MessageManager = lazy(() => import('./pages/admin/MessageManager'));
const TestimonialManager = lazy(() => import('./pages/admin/TestimonialManager'));
const ApplicationManager = lazy(() => import('./pages/admin/ApplicationManager'));

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_path: location.pathname,
      });
    }
  }, [location]);

  return (
    <>
      <SEO />
      {!isAdmin && <header><Navbar /></header>}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          role="main"
          id="main-content"
        >
          <Suspense fallback={<div className="min-h-screen bg-[#0A0A0F]" aria-label="Loading content" />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/portfolio/:id" element={<ProjectDetails />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Protected Management Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/projects" element={<ProjectManager />} />
              <Route path="/admin/franchises" element={<FranchiseManager />} />
              <Route path="/admin/jobs" element={<JobManager />} />
              <Route path="/admin/messages" element={<MessageManager />} />
              <Route path="/admin/testimonials" element={<TestimonialManager />} />
              <Route path="/admin/applications" element={<ApplicationManager />} />
            </Routes>
          </Suspense>
        </motion.main>
      </AnimatePresence>
      {!isAdmin && <footer><Footer /></footer>}
    </>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <HashRouter>
        <div className="app" role="application" aria-label="Sandhya SoftTech Website">
          <SmoothScroll>
            <ScrollProgress />
            <CustomCursor />
            <AnimatePresence mode="wait">
              {loading ? (
                <Loader key="loader" />
              ) : (
                <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                  <AnimatedRoutes />
                </motion.div>
              )}
            </AnimatePresence>
          </SmoothScroll>
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
