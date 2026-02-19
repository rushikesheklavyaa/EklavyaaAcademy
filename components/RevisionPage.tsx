
import React, { useState } from 'react';
import Section from './ui/Section';
import Button from './ui/Button';
import { Rocket, CheckCircle, Brain, Zap, BookOpen, Clock, AlertCircle, ArrowLeft, MessageCircle } from 'lucide-react';
import { EnquiryFormData } from '../types';
import { submitEnquiry } from '../utils/api';

interface RevisionPageProps {
  onBack: () => void;
}

const RevisionPage: React.FC<RevisionPageProps> = ({ onBack }) => {
  const initialFormState: EnquiryFormData = {
    studentName: '',
    parentName: '',
    grade: '',
    board: 'Revision Batch', // Hardcoded for sheet tracking
    schoolName: '',
    address: '',
    phone: '',
    email: '',
    message: 'Registering for FREE REVISION & SCORE BOOSTER SESSION'
  };

  const [formData, setFormData] = useState<EnquiryFormData>(initialFormState);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submittedData, setSubmittedData] = useState<EnquiryFormData | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // We prepend "REVISION BATCH" to the grade so it stands out in the Excel sheet
    const submissionData = {
      ...formData,
      grade: `REVISION BATCH - ${formData.grade}` 
    };

    const success = await submitEnquiry(submissionData);
    
    if (success) {
      setSubmittedData(formData);
      setStatus('success');
      setFormData(initialFormState);
    } else {
      setStatus('error');
    }
  };

  const openWhatsApp = () => {
    if (!submittedData) return;
    const phoneNumber = '919011141618'; 
    const text = `Hello Eklavyaa Academy, I have registered for the *Free Revision Batch*.\n\n*Student Details:*\nName: ${submittedData.studentName}\nClass: ${submittedData.grade}\nSchool: ${submittedData.schoolName}\nParent: ${submittedData.parentName}\nPhone: ${submittedData.phone}\n\nPlease confirm my seat and share the schedule.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (status === 'success') {
    return (
      <Section className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-lg mx-auto p-8 bg-white rounded-3xl shadow-xl animate-fade-in-up">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-green-100 shadow-lg">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-secondary-900 mb-4">Registration Successful!</h2>
          <p className="text-slate-600 mb-8 text-lg leading-relaxed">
            You have successfully registered for the Free Revision & Score Booster Session. To get instant confirmation and schedule details, please say Hi on WhatsApp.
          </p>
          
          <div className="space-y-4">
            <button 
                onClick={openWhatsApp}
                className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold shadow-xl shadow-green-500/20 transition-all transform hover:-translate-y-1 active:scale-95"
            >
                <MessageCircle className="w-6 h-6" />
                Get Schedule on WhatsApp
            </button>
            
            <button 
              onClick={onBack} 
              className="text-slate-400 hover:text-secondary-900 font-medium text-sm transition-colors block w-full py-2"
            >
              Return to Home
            </button>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Content */}
          <div className="animate-fade-in-up">
            <div className="inline-block px-4 py-1.5 rounded-full bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wider mb-6">
              Limited Time Free Session
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary-900 leading-tight mb-6">
              Free Revision & <br/>
              <span className="text-primary-500 italic">Score Booster Session</span>
            </h1>

            <p className="text-xl text-slate-700 font-medium mb-8">
              For 8th & 9th Standard (All Subjects)
            </p>

            <div className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
              <div className="flex gap-4">
                <div className="bg-orange-100 p-2 rounded-lg h-fit text-orange-600"><Rocket className="w-6 h-6" /></div>
                <div>
                  <h4 className="font-bold text-secondary-900 text-lg">Missed Your Basics?</h4>
                  <p className="text-slate-600 text-sm">We are here to strengthen them! Turn weak subjects into strong points.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-blue-100 p-2 rounded-lg h-fit text-blue-600"><Zap className="w-6 h-6" /></div>
                <div>
                  <h4 className="font-bold text-secondary-900 text-lg">Score Improvement Focus</h4>
                  <p className="text-slate-600 text-sm">Low marks in previous exams? Let's fix that with exam-oriented questions.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-purple-100 p-2 rounded-lg h-fit text-purple-600"><Brain className="w-6 h-6" /></div>
                <div>
                  <h4 className="font-bold text-secondary-900 text-lg">Concept Clarity & Tricks</h4>
                  <p className="text-slate-600 text-sm">Learn smart tricks, shortcuts, and get personal guidance for doubt solving.</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
               <h3 className="font-bold text-secondary-900 mb-4 flex items-center gap-2">
                 <BookOpen className="w-5 h-5 text-primary-500" /> Subjects Covered
               </h3>
               <div className="flex flex-wrap gap-3">
                  {['Mathematics', 'Science', 'English'].map(sub => (
                    <span key={sub} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium text-sm">
                      {sub}
                    </span>
                  ))}
               </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
               <Clock className="w-4 h-4" /> Limited Seats – Registration Required
            </div>
          </div>

          {/* Right Column: Registration Form */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border-t-4 border-primary-500 lg:sticky lg:top-28 animate-fade-in-up animate-delay-200">
             <h3 className="text-2xl font-serif font-bold text-secondary-900 mb-2">Book Your Free Seat</h3>
             <p className="text-slate-500 text-sm mb-6">Fill the details below to join the revision batch.</p>

             {status === 'error' && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2 border border-red-100 mb-6">
                    <AlertCircle className="w-4 h-4" />
                    Submission failed. Please call us directly.
                </div>
             )}

             <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Student Name *</label>
                    <input
                        type="text"
                        name="studentName"
                        required
                        value={formData.studentName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-primary-500 outline-none transition-all"
                        placeholder="Student Full Name"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Parent Name *</label>
                    <input
                        type="text"
                        name="parentName"
                        required
                        value={formData.parentName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-primary-500 outline-none transition-all"
                        placeholder="Parent Name"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Mobile Number *</label>
                    <input
                        type="tel"
                        name="phone"
                        required
                        pattern="[0-9]{10}"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-primary-500 outline-none transition-all"
                        placeholder="10-digit number"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Class *</label>
                      <select
                          name="grade"
                          required
                          value={formData.grade}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-primary-500 outline-none transition-all appearance-none"
                      >
                          <option value="">Select</option>
                          <option value="8th Standard">8th Standard</option>
                          <option value="9th Standard">9th Standard</option>
                      </select>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">School *</label>
                      <input
                          type="text"
                          name="schoolName"
                          required
                          value={formData.schoolName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-primary-500 outline-none transition-all"
                          placeholder="School Name"
                      />
                   </div>
                </div>

                <div className="pt-2">
                  <Button 
                      type="submit" 
                      className="w-full py-4 rounded-xl shadow-lg shadow-primary-500/20" 
                      disabled={status === 'submitting'}
                  >
                      {status === 'submitting' ? 'Registering...' : 'Register Now - It\'s Free!'}
                  </Button>
                  <p className="text-center text-xs text-slate-400 mt-3">
                    By registering, you agree to receive updates via WhatsApp/Call.
                  </p>
                </div>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevisionPage;
