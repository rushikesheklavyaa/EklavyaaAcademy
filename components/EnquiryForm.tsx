
import React, { useState } from 'react';
import Section from './ui/Section';
import Button from './ui/Button';
import { Send, CheckCircle, Phone, Mail, AlertCircle, MessageCircle } from 'lucide-react';
import { EnquiryFormData } from '../types';
import { submitEnquiry } from '../utils/api';

const EnquiryForm: React.FC = () => {
  const initialFormState: EnquiryFormData = {
    studentName: '',
    parentName: '',
    grade: '',
    board: '',
    schoolName: '',
    address: '',
    phone: '',
    email: '',
    message: ''
  };

  const [formData, setFormData] = useState<EnquiryFormData>(initialFormState);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submittedData, setSubmittedData] = useState<EnquiryFormData | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'grade') {
      setFormData(prev => ({ ...prev, [name]: value, board: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    const success = await submitEnquiry(formData);
    
    if (success) {
      setSubmittedData({ ...formData });
      setStatus('success');
      setFormData(initialFormState);
    } else {
      setStatus('error');
    }
  };

  const openWhatsApp = () => {
    if (!submittedData) return;
    const phoneNumber = '919011141618'; 
    const text = `Hello Eklavyaa Academy, I have just submitted an enquiry on your website.\n\n*Student Details:*\nName: ${submittedData.studentName}\nClass: ${submittedData.grade}\nBoard: ${submittedData.board}\nSchool: ${submittedData.schoolName}\nParent: ${submittedData.parentName}\nPhone: ${submittedData.phone}\n\nPlease share the coaching details and brochure.`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const renderBoardOptions = () => {
    const isHigherSecondary = formData.grade === '11th Standard' || formData.grade === '12th Standard';
    return isHigherSecondary ? (
      <>
        <option value="Science">Science</option>
        <option value="Commerce">Commerce</option>
      </>
    ) : (
      <>
        <option value="SSC">SSC (State Board)</option>
        <option value="CBSE">CBSE</option>
      </>
    );
  };

  return (
    <Section id="enquiry" bg="white">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="flex flex-col lg:flex-row min-h-[500px]">
            {/* Contact Info Sidebar */}
            <div className="lg:w-2/5 bg-secondary-900 p-8 lg:p-12 text-white flex flex-col justify-between order-1">
                <div>
                    <h3 className="text-3xl lg:text-4xl font-bold leading-tight mb-6">
                        Take the First Step to <span className="text-primary-500 font-serif italic">Excellence</span>
                    </h3>
                    <p className="text-slate-300 mb-8 text-base leading-relaxed opacity-90">
                        Fill out our admission enquiry form and our academic counselor will help you choose the right path for your academic future.
                    </p>
                    <div className="space-y-4">
                        {['Free Counseling Session', 'Scholarship Info', 'Demo Lectures'].map((item) => (
                          <div key={item} className="flex items-center gap-3 text-sm font-medium">
                              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
                              <span>{item}</span>
                          </div>
                        ))}
                    </div>
                </div>
                
                <div className="mt-12 space-y-8">
                     <div>
                        <div className="text-primary-400 font-bold tracking-widest text-[10px] uppercase mb-4 opacity-80">Call Us Now</div>
                        <div className="flex flex-col gap-3">
                            {['9011141618', '9022781871', '7666076709'].map(num => (
                              <a key={num} href={`tel:${num}`} className="flex items-center gap-3 hover:text-primary-400 transition-colors text-lg font-medium group">
                                  <Phone className="w-5 h-5 text-primary-500 group-hover:scale-110 transition-transform shrink-0" /> {num}
                              </a>
                            ))}
                        </div>
                     </div>
                     
                     <div>
                        <div className="text-primary-400 font-bold tracking-widest text-[10px] uppercase mb-3 opacity-80">Email Us</div>
                        <a href="mailto:enquiry.eklavyaa@gmail.com" className="flex items-center gap-3 text-sm hover:text-primary-400 transition-colors break-words group">
                            <Mail className="w-5 h-5 text-primary-500 group-hover:scale-110 transition-transform shrink-0" /> enquiry.eklavyaa@gmail.com
                        </a>
                     </div>
                </div>
            </div>

            {/* Form Area or Success Message */}
            <div className="lg:w-3/5 p-8 lg:p-12 bg-white flex flex-col justify-center order-2">
                {status === 'success' ? (
                    <div className="text-center py-10 animate-fade-in-up flex flex-col items-center">
                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-8 shadow-inner">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h4 className="text-3xl font-serif font-bold text-secondary-900 mb-4">Details Received!</h4>
                        <p className="text-slate-600 mb-10 text-lg max-w-sm mx-auto leading-relaxed">
                            Thank you for reaching out. Please click below to confirm your enquiry on WhatsApp to receive our brochure and fee structure instantly.
                        </p>
                        
                        <div className="flex flex-col gap-4 w-full max-w-sm">
                          <button 
                              onClick={openWhatsApp}
                              className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold shadow-xl shadow-green-500/20 transition-all transform hover:-translate-y-1 active:scale-95"
                          >
                              <MessageCircle className="w-6 h-6" />
                              Confirm via WhatsApp
                          </button>
                          
                          <button 
                              onClick={() => setStatus('idle')}
                              className="text-slate-400 hover:text-secondary-900 text-sm font-medium transition-colors"
                          >
                              Submit Another Enquiry
                          </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <h4 className="text-2xl font-serif font-bold text-secondary-900">Enquiry Form</h4>
                          <p className="text-slate-500 text-sm">Please fill in the details below to get started.</p>
                        </div>

                        {status === 'error' && (
                           <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-3 border border-red-100">
                              <AlertCircle className="w-5 h-5 shrink-0" />
                              <span>Unable to submit. Please check your connection or call us.</span>
                           </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Student Name *</label>
                                <input
                                    type="text"
                                    name="studentName"
                                    required
                                    value={formData.studentName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all"
                                    placeholder="e.g. Rahul Patil"
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
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all"
                                    placeholder="Parent's Name"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                             <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Class *</label>
                                <select
                                    name="grade"
                                    required
                                    value={formData.grade}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Select Class</option>
                                    {['5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map(g => (
                                      <option key={g} value={`${g} Standard`}>{g} Standard</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Board / Stream *</label>
                                <select
                                    name="board"
                                    required
                                    value={formData.board}
                                    onChange={handleChange}
                                    disabled={!formData.grade}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-primary-500 outline-none transition-all disabled:opacity-50 appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Choose Board</option>
                                    {renderBoardOptions()}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">School Name *</label>
                                <input
                                    type="text"
                                    name="schoolName"
                                    required
                                    value={formData.schoolName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-primary-500 outline-none transition-all"
                                    placeholder="Current school"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button 
                                type="submit" 
                                className="w-full py-4 rounded-xl shadow-xl shadow-primary-500/20 active:scale-95 transition-all flex items-center justify-center gap-2" 
                                disabled={status === 'submitting'}
                            >
                                {status === 'submitting' ? (
                                  <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Submitting...
                                  </>
                                ) : (
                                  <>
                                    Submit Enquiry <Send className="w-4 h-4" />
                                  </>
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
      </div>
    </Section>
  );
};

export default EnquiryForm;
