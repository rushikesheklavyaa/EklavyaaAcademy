import React from 'react';
import { ArrowRight, Award, Flame, Check, Quote } from 'lucide-react';
import { CoursePageTabId } from '../types';
import heroEditorialImg from '../src/assets/images/hero_academy_editorial_1794649049637.jpg';

interface HeroProps {
  onOpenEnquiry: () => void;
  onOpenCourseTab: (tabId: CoursePageTabId) => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenCourseTab }) => {
  return (
    <section className="relative pt-24 pb-16 md:pt-28 md:pb-24 overflow-hidden bg-white text-secondary-900">
      <div className="absolute inset-0 bg-grid z-0 opacity-60"></div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        {/* Top Image Banner */}
        <div className="relative w-full h-[220px] sm:h-[300px] md:h-[360px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm mb-10">
          <img
            src={heroEditorialImg}
            alt="Sunlit study desk with textbook, geometric compass, and fountain pen representing disciplined exam preparation"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary-950/75 via-secondary-900/20 to-transparent" />
          <div className="absolute bottom-5 left-6 right-6 flex flex-wrap items-end justify-between gap-4 text-white">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300 mb-1">
                Eklavyaa Academy · Std 5 to 12 · CBSE, SSC & HSC
              </p>
              <p className="text-base sm:text-lg font-bold tracking-tight">
                Ekagrata · Shraddha · Consistency
              </p>
            </div>
            <a
              href="#events"
              className="text-xs sm:text-sm font-semibold text-white/90 hover:text-white underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              See Campus Events & Visits
            </a>
          </div>
        </div>

        {/* Headline & Inspiring Quote Below Image Banner */}
        <div className="max-w-4xl mx-auto text-center mb-12 md:mb-14">
          <h1 className="text-3xl sm:text-5xl md:text-[3.35rem] font-bold text-secondary-900 leading-[1.1] tracking-tight mb-6 text-balance">
            Sharp Concepts.{' '}
            <span className="text-primary-600">Fearless Board Results.</span>
          </h1>

          <figure className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-6 md:px-10 md:py-7 max-w-3xl mx-auto">
            <Quote className="w-5 h-5 text-primary-500 mx-auto mb-3" aria-hidden="true" />
            <blockquote className="text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed font-medium">
              “Success in board exams is never luck or rote memory—it grows from clear daily
              concepts, disciplined mock practice, and mentors who back every student.”
            </blockquote>
            <figcaption className="text-xs sm:text-sm font-semibold text-primary-600 mt-4 tracking-wide">
              Eklavyaa Academy Mentorship · Admissions Open
            </figcaption>
          </figure>
        </div>

        {/* 2 Flagship Programs: E-SAT Entrance Exam & Finish Line 30 - Crash Course */}
        <div id="hero-programs" className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* E-SAT Entrance Exam */}
          <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 text-white border border-emerald-800/70 rounded-2xl p-8 md:p-9 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4" /> Scholarship & Aptitude Exam
                </span>
                <span className="text-xs font-bold text-emerald-300 tabular-nums">
                  FREE · Std 5 to 12
                </span>
              </div>

              <h2 className="font-bold text-white text-3xl tracking-tight mb-3">
                E-SAT Entrance Exam
              </h2>
              <p className="text-sm md:text-base text-emerald-100/85 leading-relaxed mb-6">
                Eklavyaa Scholarship & Aptitude Test for all 5th to 12th Std students (CBSE, SSC &
                HSC). Benchmark aptitude in 30 minutes and unlock merit fee scholarships.
              </p>

              <div className="grid grid-cols-3 gap-3 py-4 px-4 rounded-xl bg-emerald-950/70 border border-emerald-800/70 mb-6 text-center">
                <div>
                  <div className="text-lg font-bold text-white tabular-nums">50 MCQs</div>
                  <div className="text-[11px] text-emerald-200/80">30 Minutes</div>
                </div>
                <div className="border-x border-emerald-800/70">
                  <div className="text-lg font-bold text-white tabular-nums">Std 5–12</div>
                  <div className="text-[11px] text-emerald-200/80">All Boards</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-emerald-300 tabular-nums">15%–50%</div>
                  <div className="text-[11px] text-emerald-200/80">Scholarship</div>
                </div>
              </div>

              <ul className="space-y-2.5 mb-8 text-sm text-emerald-50">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Quantitative, Logical Reasoning & Analytical Assessment</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Guaranteed Merit Certificate & Tuition Fee Waiver</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => onOpenCourseTab('esat')}
              className="group w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:via-teal-500 hover:to-emerald-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
            >
              <span>Register for E-SAT Entrance Exam</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Finish Line 30 - Crash Course */}
          <div className="bg-secondary-900 text-white border border-secondary-800 rounded-2xl p-8 md:p-9 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Flame className="w-4 h-4" /> Intensive Board Program
                </span>
                <span className="text-xs font-bold text-amber-400 tabular-nums">
                  30 Days · Rs. 2,999
                </span>
              </div>

              <h2 className="font-bold text-white text-3xl tracking-tight mb-3">
                Finish Line 30 - Crash Course
              </h2>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-6">
                Our flagship 30-Day Crash Course for board aspirants. Choose your class—
                <strong className="text-white">Std 10th (CBSE & SSC)</strong> or{' '}
                <strong className="text-white">Std 12th Commerce (Accountancy)</strong>—to view
                your full syllabus and register.
              </p>

              <div className="grid grid-cols-2 gap-3 py-4 px-4 rounded-xl bg-secondary-800/80 border border-secondary-700 mb-6">
                <div>
                  <div className="text-sm font-bold text-white">Std 10th Course</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Maths, Science, English & Prelims
                  </div>
                </div>
                <div className="border-l border-secondary-700 pl-4">
                  <div className="text-sm font-bold text-white">Std 12th Commerce</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    30-Day Accountancy Crash Course
                  </div>
                </div>
              </div>

              <ul className="space-y-2.5 mb-8 text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Select Std 10th or Std 12th on the next page to see full syllabus</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Chapter-wise tests, board-pattern papers & answer-writing mastery</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => onOpenCourseTab('finish-line')}
              className="group w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-orange-500 via-primary-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
            >
              <span>Register for Finish Line 30 (10th / 12th)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
