
import React, { useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { EnquiryFormData } from '../types';
import { submitEnquiry } from '../utils/api';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose }) => {
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

  const handleClose = () => {
    setStatus('idle');
    setFormData(initialFormState);
    onClose();
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
        <option value="SSC">SSC</option>
        <option value="CBSE">CBSE</option>
      </>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Admission Enquiry">
      <div className="min-h-[400px] flex flex-col justify-center">
        {status === 'success' ? (
          <div className="text-center py-6 px-2 animate-fade-in-up flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-md shadow-green-100">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-serif font-bold text-secondary-900 mb-3">Submission Success!</h4>
            <p className="text-slate-600 mb-8 text-base leading-relaxed">
              We've received your details. To get immediate fee details and a digital brochure, please chat with our counselor on WhatsApp.
            </p>
            
            <div className="space-y-3 w-full">
              <button 
                  onClick={openWhatsApp}
                  className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold shadow-lg shadow-green-500/10 transition-all active:scale-95"
              >
                  <MessageCircle className="w-5 h-5" />
                  Continue on WhatsApp
              </button>

              <button 
                onClick={handleClose}
                className="w-full py-3 text-slate-400 font-medium hover:text-secondary-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <p className="text-slate-500 text-sm">Join the family of high achievers.</p>
              </div>

              {status === 'error' && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2 border border-red-100">
                      <AlertCircle className="w-4 h-4" />
                      Oops! Please try again or call us.
                  </div>
              )}
              
              <div className="space-y-4">
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Student Name *</label>
                      <input
                          type="text"
                          name="studentName"
                          required
                          value={formData.studentName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-primary-500 outline-none transition-all"
                          placeholder="Full Name"
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
                              {['5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map(g => (
                                <option key={g} value={`${g} Standard`}>{g} Standard</option>
                              ))}
                          </select>
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Board *</label>
                          <select
                              name="board"
                              required
                              value={formData.board}
                              onChange={handleChange}
                              disabled={!formData.grade}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-primary-500 outline-none transition-all appearance-none disabled:opacity-50"
                          >
                              <option value="" disabled>Select</option>
                              {renderBoardOptions()}
                          </select>
                      </div>
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
                          placeholder="Current School Name"
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
                          placeholder="10-digit phone"
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
                          placeholder="Parent's Name"
                      />
                  </div>
              </div>

              <div className="pt-4">
                  <Button 
                      type="submit" 
                      className="w-full py-4 rounded-xl shadow-lg shadow-primary-500/20" 
                      disabled={status === 'submitting'}
                  >
                      {status === 'submitting' ? 'Processing...' : 'Submit Admission Request'}
                  </Button>
              </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default EnquiryModal;
