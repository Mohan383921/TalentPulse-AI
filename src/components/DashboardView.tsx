import React from 'react';
import { 
  Users, 
  Briefcase, 
  UserCheck, 
  Clock, 
  ArrowUpRight, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  FileText,
  Search,
  ChevronRight,
  QrCode,
  Download,
  Printer
} from 'lucide-react';
import { Candidate, Job, AnalyticsData } from '../types';

interface DashboardViewProps {
  candidates: Candidate[];
  jobs: Job[];
  analytics: AnalyticsData | null;
  setActiveTab: (tab: string) => void;
  onSelectCandidate: (candidate: Candidate) => void;
  onOpenQR?: () => void;
}

export function DashboardView({ 
  candidates, 
  jobs, 
  analytics, 
  setActiveTab,
  onSelectCandidate,
  onOpenQR
}: DashboardViewProps) {
  const topCandidates = [...candidates].sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-8 text-white shadow-2xl border border-indigo-500/20">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enterprise AI Recruitment Suite v2.5</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mb-3">
            Intelligent Resume Screening & Candidate Ranking
          </h1>
          <p className="text-slate-300 text-base mb-6 leading-relaxed">
            Automate ingestion, parse resumes with Gemini AI, run RAG-powered semantic matching, and generate tailored interview questions instantly.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('ingestion')}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30"
            >
              <FileText className="w-4 h-4" />
              <span>Upload Resumes</span>
            </button>
            {onOpenQR && (
              <button
                onClick={onOpenQR}
                className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-emerald-600/20"
              >
                <QrCode className="w-4 h-4" />
                <span>Mobile QR Registration</span>
              </button>
            )}
            <a
              href="/api/candidates/export-csv"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all border border-slate-700"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export CSV</span>
            </a>
            <a
              href="/api/candidates/export-pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all border border-slate-700"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Executive PDF Report</span>
            </a>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Applicants</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl font-bold text-slate-900">
              {analytics ? analytics.totalApplicants : candidates.length}
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" /> +12% this wk
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Shortlisted / Matches</span>
            <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl font-bold text-slate-900">
              {analytics ? analytics.shortlistedCount : candidates.filter(c => c.matchScore >= 85).length}
            </div>
            <span className="text-xs font-medium text-slate-500">High Match (&gt;85%)</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg Match Score</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl font-bold text-slate-900">
              {analytics ? `${analytics.avgMatchScore}%` : '88.5%'}
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              AI Optimized
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg Time-to-Shortlist</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl font-bold text-slate-900">
              {analytics ? `${analytics.avgTimeToHireDays} days` : '14 days'}
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              60% Faster
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Candidates Ranked */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Top Ranked Candidates</h2>
              <p className="text-xs text-slate-500">AI-screened candidates sorted by semantic match score</p>
            </div>
            <button
              onClick={() => setActiveTab('jobs')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {topCandidates.map((cand) => (
              <div 
                key={cand.id}
                onClick={() => onSelectCandidate(cand)}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-base">
                    {cand.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {cand.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{cand.appliedJobTitle}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {cand.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="text-[10px] bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                          {skill}
                        </span>
                      ))}
                      {cand.skills.length > 3 && (
                        <span className="text-[10px] text-slate-500 px-1 py-0.5">+{cand.skills.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right flex items-center space-x-4">
                  <div>
                    <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Sparkles className="w-3 h-3 mr-1 text-emerald-600" />
                      {cand.matchScore}% Match
                    </div>
                    <span className="block text-[10px] text-slate-400 mt-1">{cand.status}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Openings & Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Active Job Postings</h2>
              <span className="text-xs bg-indigo-50 text-indigo-600 font-semibold px-2.5 py-0.5 rounded-full">
                {jobs.length} Active
              </span>
            </div>

            <div className="space-y-3">
              {jobs.map((job) => (
                <div key={job.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xs font-bold text-slate-900">{job.title}</h3>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {job.applicantsCount} Applicants
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{job.department} • {job.location}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('jobs')}
              className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors shadow-sm"
            >
              Manage Job Postings
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI Assistant Ready</span>
            </h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Use RAG conversational search to query candidate skills, compare resumes side-by-side, or generate custom interview prompts.
            </p>
            <button
              onClick={() => setActiveTab('assistant')}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/30"
            >
              Open AI RAG Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
