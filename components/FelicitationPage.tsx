
import React, { useState } from 'react';
import Section from './ui/Section';
import Button from './ui/Button';
import { Trophy, GraduationCap, Medal, Star, CheckCircle, AlertCircle, ArrowLeft, MessageCircle, Upload, Calendar, MapPin, Users } from 'lucide-react';
import { submitEnquiry } from '../utils/api';

interface FelicitationPageProps {
  onBack: () => void;
}

const FelicitationPage: React.FC<FelicitationPageProps> = ({ onBack }) => {
  const initialFormState = {
    studentName: '',
    parentName: '',
    standard: '',
    schoolName: '',
    percentage: '',
    rank: '',
    phone: '',
    altPhone: '',
    message: '' // We can store the subjects data here temporarily for now
  };

  const [formData, setFormData] = useState(initialFormState);
  const [subjects, setSubjects] = useState([{ name: '', marks: '' }]);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submittedData, setSubmittedData] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubjectChange = (index: number, field: 'name' | 'marks', value: string) => {
    const newSubjects = [...subjects];
    newSubjects[index][field] = value;
    setSubjects(newSubjects);
  };

  const addSubjectRow = () => {
    setSubjects([...subjects, { name: '', marks: '' }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    const subjectsText = subjects.filter(s => s.name.trim() !== '').map(s => `${s.name}: ${s.marks}`).join('\n');
    const submissionData = {
      SheetName: 'Falicitation List',
      FormType: 'Felicitation 2026',
      StudentName: formData.studentName,
      ParentName: formData.parentName,
      Standard: formData.standard, 
      SchoolName: formData.schoolName,
      Percentage: formData.percentage,
      Rank: formData.rank || 'N/A',
      Subjects: subjectsText,
      Phone: formData.phone,
      AlternatePhone: formData.altPhone || 'N/A'
    };

    const success = await submitEnquiry(submissionData);
    
    if (success) {
      setSubmittedData({
        ...formData, 
        percentage: formData.percentage
      });
      setStatus('success');
      setFormData(initialFormState);
      setSubjects([{ name: '', marks: '' }]);
    } else {
      setStatus('error');
    }
  };

  const openWhatsApp = () => {
    if (!submittedData) return;
    const phoneNumber = '919011141618'; // Replace with Academy's WhatsApp number if needed
    const text = `Hello Eklavyaa Academy, I have registered for the *Felicitation Ceremony 2026*.\n\n*Student Details:*\nName: ${submittedData.studentName}\nClass: ${submittedData.standard}\nPercentage: ${submittedData.percentage}\nSchool: ${submittedData.schoolName}\nParent: ${submittedData.parentName}\nPhone: ${submittedData.phone}\n\nPlease confirm my registration.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (status === 'success') {
    return (
      <Section className="min-h-[80vh] flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-lg mx-auto p-8 bg-white rounded-3xl shadow-xl border-t-4 border-amber-400 animate-fade-in-up">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-green-100 shadow-lg">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-secondary-900 mb-4">Registration Successful!</h2>
          <p className="text-slate-600 mb-6 text-lg leading-relaxed">
            We are honored to celebrate your dedication and success. Let your achievement inspire many more students to dream big and work hard.
          </p>
          <p className="text-xl font-bold font-serif text-primary-600 mb-8">
            🏆 Join us in making this celebration memorable!
          </p>
          
          <div className="space-y-4">
            <button 
                onClick={openWhatsApp}
                className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold shadow-xl shadow-green-500/20 transition-all transform hover:-translate-y-1 active:scale-95"
            >
                <MessageCircle className="w-6 h-6" />
                Notify Us on WhatsApp
            </button>

            <button 
              onClick={onBack} 
              className="text-slate-400 hover:text-secondary-900 font-medium text-sm transition-colors block w-full py-2"
            >
              ← Return to Home
            </button>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-5 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
               <Trophy className="w-4 h-4" /> Grand Felicitation 2026
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary-900 leading-tight mb-6">
              Honoring Talent, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-amber-500">Inspiring Futures</span>
            </h1>

            <p className="text-lg text-slate-700 font-medium mb-8">
              Join us to celebrate the glorious achievements of our SSC & HSC board toppers.
            </p>

            {/* Event Details */}
            <div className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
              <h3 className="font-bold text-secondary-900 text-lg border-b pb-2 mb-4">Event Details</h3>
              <div className="flex gap-4 items-center">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Calendar className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Date & Time</h4>
                  <p className="text-slate-500 text-sm">17th May 2026, 5:00 PM to 7:00 PM</p>
                </div>
              </div>
              <div className="flex gap-4 items-center mt-2">
                <div className="bg-amber-50 p-3 rounded-xl text-amber-600"><MapPin className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Venue</h4>
                  <p className="text-slate-500 text-sm">Eklavyaa Academy</p>
                </div>
              </div>
              <div className="flex gap-4 items-center mt-2">
                <div className="bg-purple-50 p-3 rounded-xl text-purple-600"><Users className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Guest of Honor</h4>
                  <p className="text-slate-500 text-sm">
                    <strong>Dr. SUNIL V. KALYANKAR</strong><br/>
                    (MDS &ndash; Orthodontics & Dentofacial Orthopedics)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-gradient-to-br from-secondary-900 to-primary-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
                  <div className="absolute right-[-20%] top-[-20%] opacity-10 transform rotate-12 group-hover:rotate-45 transition-transform duration-700">
                      <GraduationCap className="w-48 h-48" />
                  </div>
                  <h3 className="text-xl font-bold font-serif mb-2 relative z-10 flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Previous Year Stars
                  </h3>
                  <p className="text-slate-300 text-sm mb-4 relative z-10">We celebrate excellence every year. Be the next to shine on our hall of fame.</p>
              </div>

              <div className="text-center p-6 bg-slate-100 rounded-2xl border border-slate-200">
                <p className="text-slate-600 font-serif italic mb-2">"Quality is not an act, it is a habit."</p>
                <div className="flex justify-center gap-1 text-amber-500 mb-1">
                   <Star className="w-4 h-4 fill-current"/>
                   <Star className="w-4 h-4 fill-current"/>
                   <Star className="w-4 h-4 fill-current"/>
                   <Star className="w-4 h-4 fill-current"/>
                   <Star className="w-4 h-4 fill-current"/>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Registration Form */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border-t-4 border-amber-400 lg:sticky lg:top-24 animate-fade-in-up animate-delay-200">
             <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-secondary-900">📋 Registration Form</h3>
                  <p className="text-slate-500 text-sm mt-1">Please fill out with accurate academic details.</p>
                </div>
                <Medal className="w-10 h-10 text-amber-400" />
             </div>

             {status === 'error' && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2 border border-red-100 mb-6">
                    <AlertCircle className="w-4 h-4" />
                    Submission failed. Please try again.
                </div>
             )}

             <form onSubmit={handleSubmit} className="space-y-6">
                {/* Student Information */}
                <div>
                   <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b pb-2 mb-4">Student Information</h4>
                   <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Full Name *</label>
                          <input
                              type="text" name="studentName" required value={formData.studentName} onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 outline-none transition-all"
                              placeholder="Enter your full name as per marksheet"
                          />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Parent's Name *</label>
                          <input
                              type="text" name="parentName" required value={formData.parentName} onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 outline-none transition-all"
                              placeholder="Father’s / Mother’s / Guardian’s name"
                          />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Standard *</label>
                          <select
                              name="standard" required value={formData.standard} onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 outline-none transition-all appearance-none"
                          >
                              <option value="">Select Standard</option>
                              <option value="10th SSC">10th SSC</option>
                              <option value="12th HSC Science">12th HSC Science</option>
                              <option value="12th HSC Commerce">12th HSC Commerce</option>
                              <option value="12th HSC Arts">12th HSC Arts</option>
                          </select>
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">School / Junior College Name *</label>
                          <input
                              type="text" name="schoolName" required value={formData.schoolName} onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 outline-none transition-all"
                              placeholder="Enter complete institution name"
                          />
                      </div>
                   </div>
                </div>

                {/* Academic Performance */}
                <div>
                   <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b pb-2 mb-4 mt-6">📊 Academic Performance</h4>
                   <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Board Percentage *</label>
                          <input
                              type="text" name="percentage" required value={formData.percentage} onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 outline-none transition-all"
                              placeholder="Example: 92.40%"
                          />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Rank in School/College</label>
                          <input
                              type="text" name="rank" value={formData.rank} onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 outline-none transition-all"
                              placeholder="If applicable"
                          />
                      </div>
                   </div>
                   
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Subject-wise Marks</label>
                     {subjects.map((sub, idx) => (
                       <div key={idx} className="flex gap-2">
                         <input type="text" placeholder={`Subject ${idx + 1}`} value={sub.name} onChange={(e) => handleSubjectChange(idx, 'name', e.target.value)} className="w-2/3 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-amber-400 outline-none"/>
                         <input type="text" placeholder="Marks" value={sub.marks} onChange={(e) => handleSubjectChange(idx, 'marks', e.target.value)} className="w-1/3 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-amber-400 outline-none"/>
                       </div>
                     ))}
                     <button type="button" onClick={addSubjectRow} className="text-xs text-blue-600 font-bold hover:underline mt-2">+ Add another subject</button>
                   </div>
                </div>

                {/* Contact Information */}
                <div>
                   <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b pb-2 mb-4 mt-6">📞 Contact Information</h4>
                   <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Student Contact Number</label>
                          <input
                              type="tel" name="phone" required pattern="[0-9]{10}" value={formData.phone} onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 outline-none transition-all"
                              placeholder="Active WhatsApp number"
                          />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Alternate Number</label>
                          <input
                              type="tel" name="altPhone" pattern="[0-9]{10}" value={formData.altPhone} onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 outline-none transition-all"
                              placeholder="Parent / Guardian number"
                          />
                      </div>
                   </div>
                </div>

                <div className="pt-4">
                  <Button 
                      type="submit" 
                      className="w-full py-4 rounded-xl shadow-lg shadow-amber-500/20 bg-gradient-to-r from-blue-600 to-amber-500 hover:from-blue-700 hover:to-amber-600 border-none text-white text-lg font-bold" 
                      disabled={status === 'submitting'}
                  >
                      {status === 'submitting' ? 'Registering...' : '✅ Register Now'}
                  </Button>
                </div>
             </form>
             
             {/* Custom form-specific footer */}
             <div className="mt-12 pt-6 border-t border-slate-100 text-center">
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">© 2026 Academic Excellence Felicitation Ceremony</p>
                 <p className="text-xs text-slate-400">Organized by Eklavyaa Academy</p>
                 <p className="text-xs text-amber-600 font-serif italic mt-2">“Honoring Talent, Inspiring Futures” ✨</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FelicitationPage;
