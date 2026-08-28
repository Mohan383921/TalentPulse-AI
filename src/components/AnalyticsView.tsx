import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Sparkles, 
  Download,
  CheckCircle2,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { AnalyticsData } from '../types';

interface AnalyticsViewProps {
  analytics: AnalyticsData | null;
}

export function AnalyticsView({ analytics }: AnalyticsViewProps) {
  const data = analytics || {
    totalApplicants: 131,
    shortlistedCount: 42,
    avgMatchScore: 88.5,
    avgTimeToHireDays: 14.2,
    pipelineFunnel: [
      { stage: "Ingested", count: 131 },
      { stage: "AI Screened", count: 98 },
      { stage: "Shortlisted", count: 42 },
      { stage: "Interviewed", count: 18 },
      { stage: "Offered", count: 6 }
    ],
    matchScoreDistribution: [
      { range: "90-100%", count: 28 },
      { range: "80-89%", count: 45 },
      { range: "70-79%", count: 18 },
      { range: "<70%", count: 7 }
    ],
    sourceOfHire: [
      { source: "Direct Upload", count: 45 },
      { source: "LinkedIn RAG", count: 38 },
      { source: "Employee Referral", count: 25 },
      { source: "University Partner", count: 23 }
    ],
    topSkillsInPool: [
      { skill: "Python", candidateCount: 28 },
      { skill: "React", candidateCount: 22 },
      { skill: "TypeScript", candidateCount: 19 },
      { skill: "SQL", candidateCount: 15 }
    ],
    skillGapTrends: [
      { skill: "Cloud Deployment (AWS/GCP)", gapPercentage: 42 },
      { skill: "Distributed Vector Search", gapPercentage: 35 },
      { skill: "System Performance Profiling", gapPercentage: 28 }
    ],
    recruiterProductivity: {
      resumesScreenedToday: 18,
      interviewsScheduledThisWeek: 9,
      avgScreeningTimeSeconds: 1.8
    }
  };

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#3b82f6', '#10b981'];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Recruitment Analytics & KPI Dashboards</h1>
            <p className="text-xs text-slate-500">Pipeline conversion rates, screening velocity, and match score distribution</p>
          </div>
        </div>
        <button
          onClick={() => alert("Report successfully exported as CSV / PDF.")}
          className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Analytics Report</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Applicants</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl font-bold text-slate-900">{data.totalApplicants}</div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+14% MoM</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Shortlisted</span>
            <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl font-bold text-slate-900">{data.shortlistedCount}</div>
            <span className="text-xs font-medium text-slate-500">32% Conversion</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg Match Score</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl font-bold text-slate-900">{data.avgMatchScore}%</div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">High Quality</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Time-to-Shortlist</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl font-bold text-slate-900">{data.avgTimeToHireDays} days</div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">-60% vs baseline</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pipeline Funnel */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-base font-bold text-slate-900 mb-1">Hiring Pipeline Funnel</h3>
          <p className="text-xs text-slate-500 mb-6">Candidate volume across recruitment stages</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.pipelineFunnel} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="stage" type="category" stroke="#94a3b8" fontSize={11} width={110} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Match Score Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-base font-bold text-slate-900 mb-1">Match Score Distribution</h3>
          <p className="text-xs text-slate-500 mb-6">Breakdown of AI match scores across all ingested profiles</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.matchScoreDistribution} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sprint 2 Advanced Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Skills in Pool */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Top Skills in Candidate Pool</span>
          </h3>
          <div className="space-y-2.5 text-xs">
            {(data.topSkillsInPool || []).map((sk, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800">{sk.skill}</span>
                <span className="font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {sk.candidateCount} Candidates
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Gap Trends */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <span>Market Skill Gap Trends</span>
          </h3>
          <div className="space-y-3 text-xs">
            {(data.skillGapTrends || []).map((gap, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">{gap.skill}</span>
                  <span className="font-bold text-amber-700">{gap.gapPercentage}% Gap Rate</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${gap.gapPercentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recruiter Productivity Metrics */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-indigo-300 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Recruiter Productivity Velocity</span>
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
              <span className="text-slate-300">Resumes Screened Today</span>
              <span className="text-lg font-black text-emerald-400">
                {data.recruiterProductivity?.resumesScreenedToday || 12}
              </span>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
              <span className="text-slate-300">Interviews Scheduled</span>
              <span className="text-lg font-black text-indigo-400">
                {data.recruiterProductivity?.interviewsScheduledThisWeek || 8}
              </span>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
              <span className="text-slate-300">Avg AI Screening Velocity</span>
              <span className="text-lg font-black text-cyan-400">
                {data.recruiterProductivity?.avgScreeningTimeSeconds || 1.8}s / resume
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
