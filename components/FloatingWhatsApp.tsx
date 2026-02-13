
import React from 'react';
import { MessageCircle } from 'lucide-react';

const FloatingWhatsApp: React.FC = () => {
  const openWhatsApp = () => {
    const phoneNumber = '919011141618';
    const text = 'Hello Eklavyaa Academy, I am interested in your coaching programs. Could you please share more details?';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={openWhatsApp}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group"
      aria-label="Chat on WhatsApp"
    >
      <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 group-hover:hidden"></div>
      <MessageCircle className="w-7 h-7 relative z-10" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-4 bg-white text-secondary-900 px-3 py-1.5 rounded-lg text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-100">
        Chat with us!
      </span>
    </button>
  );
};

export default FloatingWhatsApp;
