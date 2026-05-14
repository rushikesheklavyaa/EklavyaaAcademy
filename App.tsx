
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Courses from './components/Courses';
import Features from './components/Features';
import Methodology from './components/Methodology';
import Downloads from './components/Downloads';
import EnquiryForm from './components/EnquiryForm';
import Footer from './components/Footer';
import EnquiryModal from './components/EnquiryModal';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import FelicitationPage from './components/FelicitationPage';

type ViewState = 'home' | 'felicitation' | 'downloads';

const App: React.FC = () => {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('home');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary-500 selection:text-white">
      <Navbar 
        onOpenEnquiry={() => setIsEnquiryModalOpen(true)} 
        onNavigateHome={() => setCurrentView('home')} 
        onNavigateDownloads={() => {
          setCurrentView('downloads');
          scrollToTop();
        }}
      />
      
      <main>
        {currentView === 'home' ? (
          <>
            <Hero 
              onOpenEnquiry={() => setIsEnquiryModalOpen(true)}
              onOpenRevision={() => {
                setCurrentView('felicitation');
                scrollToTop();
              }}
            />
            <About />
            <Courses />
            <Features />
            <Methodology />
            <EnquiryForm />
          </>
        ) : currentView === 'downloads' ? (
          <div className="pt-20">
             <Downloads />
          </div>
        ) : (
          <FelicitationPage onBack={() => {
            setCurrentView('home');
            scrollToTop();
          }} />
        )}
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
