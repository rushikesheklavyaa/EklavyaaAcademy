
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Courses from './components/Courses';
import Features from './components/Features';
import Methodology from './components/Methodology';
import EnquiryForm from './components/EnquiryForm';
import Footer from './components/Footer';
import EnquiryModal from './components/EnquiryModal';
import FloatingWhatsApp from './components/FloatingWhatsApp';

const App: React.FC = () => {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary-500 selection:text-white">
      <Navbar onOpenEnquiry={() => setIsEnquiryModalOpen(true)} />
      <main>
        <Hero onOpenEnquiry={() => setIsEnquiryModalOpen(true)} />
        <About />
        <Courses />
        <Features />
        <Methodology />
        <EnquiryForm />
      </main>
      <Footer />
      <EnquiryModal 
        isOpen={isEnquiryModalOpen} 
        onClose={() => setIsEnquiryModalOpen(false)} 
      />
      <FloatingWhatsApp />
    </div>
  );
};

export default App;
