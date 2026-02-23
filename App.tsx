
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
import RevisionPage from './components/RevisionPage';

type ViewState = 'home' | 'revision';

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
      />
      
      <main>
        {currentView === 'home' ? (
          <>
            <Hero 
              onOpenEnquiry={() => setIsEnquiryModalOpen(true)}
              onOpenRevision={() => {
                setCurrentView('revision');
                scrollToTop();
              }}
            />
            <About />
            <Courses />
            <Features />
            <Methodology />
            <Downloads />
            <EnquiryForm />
          </>
        ) : (
          <RevisionPage onBack={() => {
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
