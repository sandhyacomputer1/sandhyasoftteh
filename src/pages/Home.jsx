import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';

// Lazy load sections for better performance
import Hero from '../components/sections/Hero';
const About = lazy(() => import('../components/sections/About'));
const Services = lazy(() => import('../components/sections/Services'));
const Industries = lazy(() => import('../components/sections/Industries'));
const WhyUs = lazy(() => import('../components/sections/WhyUs'));
const Process = lazy(() => import('../components/sections/Process'));
const Stats = lazy(() => import('../components/sections/Stats'));
const Portfolio = lazy(() => import('../components/sections/Portfolio'));
const Franchises = lazy(() => import('../components/sections/Franchises'));
const Testimonials = lazy(() => import('../components/sections/Testimonials'));

const SectionLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Home = () => (
    <main className="home-page" role="main">
        <Hero />
        <Suspense fallback={<SectionLoader />}>
            <About />
            <Services />
            <Industries />
            <WhyUs />
            <Process />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
            <Stats />
            <Portfolio />
            <Testimonials />
            <Franchises />
        </Suspense>
    </main>
);

export default Home;
