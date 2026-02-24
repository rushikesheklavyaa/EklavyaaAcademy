
import React from 'react';
import Section from './ui/Section';
import Reveal from './ui/Reveal';
import { FileText, Download, BookOpen } from 'lucide-react';
import Button from './ui/Button';

const subjects = [
  {
    id: 1,
    title: 'Class 10 Mathematics',
    description: 'Short revision notes for Algebra and Geometry to help you grasp key concepts quickly.',
    icon: <BookOpen className="w-6 h-6 text-blue-500" />,
    color: 'bg-blue-50 text-blue-600',
    files: [
      { name: 'Algebra Revision Notes.pdf', size: 'PDF', url: 'https://drive.google.com/file/d/1W7iyM5cawRr5sgrPJypcsow95d06nP7m/view?usp=sharing' },
      { name: 'Geometry Revision Notes.pdf', size: 'PDF', url: 'https://drive.google.com/file/d/1BOjpJGR8AlPvMO3Dw9oE5Kh0pO2_2w0T/view?usp=sharing' },
    ]
  },
  {
    id: 2,
    title: 'Class 10 Science',
    description: 'Concise revision notes for Science 1 and Science 2 for effective last-minute preparation.',
    icon: <BookOpen className="w-6 h-6 text-green-500" />,
    color: 'bg-green-50 text-green-600',
    files: [
      { name: 'Science 1 Revision Notes.pdf', size: 'PDF', url: 'https://drive.google.com/file/d/1Wagv-dXzfjHCZ9QgRRHVxoRafyqjAccc/view?usp=drive_link' },
      { name: 'Science 2 Revision Notes.pdf', size: 'PDF', url: 'https://drive.google.com/file/d/1EtClFNcjnBJSCG9wDSMkD-qhtzJNVDlI/view?usp=drive_link' },
    ]
  }
];

const Downloads: React.FC = () => {
  const handleDownload = (file: { name: string; url?: string }) => {
    if (file.url) {
      window.open(file.url, '_blank');
      return;
    }

    // Fallback for local files if no URL is provided
    const fileUrl = `/notes/${file.name}`;
    
    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Section id="downloads" className="bg-slate-50">
      <Reveal>
        <div className="text-center mb-12">
          <h2 className="text-primary-600 font-bold tracking-wider uppercase text-sm mb-2">Study Resources</h2>
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-secondary-900 mb-4">
            Download <span className="text-primary-500 italic">Free Notes</span>
          </h3>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Access high-quality study materials prepared by our expert faculty to boost your preparation.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {subjects.map((subject, index) => (
          <Reveal key={subject.id} delay={index * 100}>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 group">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${subject.color} group-hover:scale-110 transition-transform duration-300`}>
                  {subject.icon}
                </div>
              </div>
              
              <h4 className="text-xl font-bold text-secondary-900 mb-2">{subject.title}</h4>
              <p className="text-slate-600 text-sm mb-6">{subject.description}</p>
              
              <div className="space-y-3">
                {subject.files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">{file.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">{file.size}</span>
                      <button 
                        onClick={() => handleDownload(file)}
                        className="text-primary-500 hover:text-primary-600 p-1 hover:bg-primary-50 rounded transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Reveal delay={400}>
          <div className="inline-flex flex-col items-center">
             <p className="text-slate-500 text-sm mb-4">Want access to full course materials?</p>
             <Button onClick={() => document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth' })}>
               Request Full Access
             </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
};

export default Downloads;
