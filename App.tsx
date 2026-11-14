import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Courses from './components/Courses';
import Features from './components/Features';
import Methodology from './components/Methodology';
import EnquiryForm from './components/EnquiryForm';
import EventsGallery from './components/EventsGallery';
import Footer from './components/Footer';
import EnquiryModal from './components/EnquiryModal';
import ProgramRegistrationPage from './components/ProgramRegistrationPage';
import AdminDashboard from './components/AdminDashboard';
import { CoursePageTabId, FinishLineStdChoice } from './types';

type ViewMode = 'home' | 'programs' | 'admin';

const getInitialRoute = (): {
  view: ViewMode;
  tab: CoursePageTabId;
  std: FinishLineStdChoice;
} => {
  const path = window.location.pathname.toLowerCase();
  const search = new URLSearchParams(window.location.search);
  const hash = window.location.hash.toLowerCase();

  if (
    path === '/admin' ||
    path.endsWith('/admin') ||
    hash === '#admin' ||
    search.get('admin') === '1' ||
    search.get('page') === 'admin'
  ) {
    return { view: 'admin', tab: 'esat', std: '10th' };
  }
  if (hash === '#esat') {
    return { view: 'programs', tab: 'esat', std: '10th' };
  }
  if (hash === '#finish-line' || hash === '#10th-course' || hash === '#downloads') {
    return { view: 'programs', tab: 'finish-line', std: '10th' };
  }
  if (hash === '#12th-course') {
    return { view: 'programs', tab: 'finish-line', std: '12th' };
  }
  return { view: 'home', tab: 'esat', std: '10th' };
};

const App: React.FC = () => {
  const initial = getInitialRoute();
  const [viewMode, setViewMode] = useState<ViewMode>(initial.view);
  const [activeProgramTab, setActiveProgramTab] = useState<CoursePageTabId>(initial.tab);
  const [finishLineStd, setFinishLineStd] = useState<FinishLineStdChoice>(initial.std);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const openEnquiry = () => setIsEnquiryOpen(true);
  const closeEnquiry = () => setIsEnquiryOpen(false);

  const openProgramPage = (tab: CoursePageTabId, std?: FinishLineStdChoice) => {
    setActiveProgramTab(tab);
    if (std) {
      setFinishLineStd(std);
    }
    setViewMode('programs');
    const targetHash =
      tab === 'esat' ? '#esat' : std === '12th' ? '#12th-course' : '#finish-line';
    window.history.pushState(null, '', targetHash);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAdminPortal = () => {
    setViewMode('admin');
    window.history.pushState(null, '', '#admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHomeSection = (sectionId?: string) => {
    setViewMode('home');
    if (sectionId) {
      window.history.pushState(null, '', `#${sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
    } else {
      window.history.pushState(null, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const syncFromUrl = () => {
      const next = getInitialRoute();
      setViewMode(next.view);
      setActiveProgramTab(next.tab);
      setFinishLineStd(next.std);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        openAdminPortal();
      }
    };

    window.addEventListener('hashchange', syncFromUrl);
    window.addEventListener('popstate', syncFromUrl);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', syncFromUrl);
      window.removeEventListener('popstate', syncFromUrl);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased">
      <Navbar
        onOpenEnquiry={openEnquiry}
        onNavigateHome={() => goHomeSection()}
        onNavigateTab={(tab) =>
          openProgramPage(tab, tab === 'finish-line' ? finishLineStd : undefined)
        }
        onNavigateDownloads={() => openProgramPage('finish-line', '10th')}
        onNavigateAdmin={openAdminPortal}
      />

      <main className="flex-1">
        {viewMode === 'admin' ? (
          <AdminDashboard onBackHome={() => goHomeSection()} />
        ) : viewMode === 'programs' ? (
          <ProgramRegistrationPage
            activeTab={activeProgramTab}
            finishLineStd={finishLineStd}
            onTabChange={(tab) => openProgramPage(tab, tab === 'finish-line' ? finishLineStd : undefined)}
            onFinishLineStdChange={(std) => setFinishLineStd(std)}
            onBackHome={() => goHomeSection()}
          />
        ) : (
          <>
            <Hero
              onOpenEnquiry={openEnquiry}
              onOpenCourseTab={(tab) => openProgramPage(tab, tab === 'finish-line' ? '10th' : undefined)}
            />
            <About />
            <Courses />
            <Features />
            <Methodology />
            <EnquiryForm />
            <EventsGallery onOpenAdmin={openAdminPortal} />
          </>
        )}
      </main>

      <Footer
        onNavigateHome={() => goHomeSection()}
        onNavigatePrograms={() => openProgramPage('esat')}
        onNavigateAdmin={openAdminPortal}
      />

      <EnquiryModal isOpen={isEnquiryOpen} onClose={closeEnquiry} />
    </div>
  );
};

export default App;
