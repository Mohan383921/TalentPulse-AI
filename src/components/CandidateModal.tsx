import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Briefcase,
  Building2,
  DollarSign,
  FileText,
  Clock,
  Printer,
  XCircle,
  HelpCircle,
  GraduationCap
} from 'lucide-react';
import { Candidate } from '../types';

interface CandidateModalProps {
  candidate: Candidate;
  onClose: () => void;
  onGenerateQuestions: (candidate: Candidate) => void;
  onUpdateStatus?: (candidateId: string, newStatus: string) => void;
}

export function CandidateModal({ 
  candidate, 
  onClose, 
  onGenerateQuestions,
  onUpdateStatus 
}: CandidateModalProps) {
  const [currentStatus, setCurrentStatus] = useState<string>(candidate.status || 'Review');
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setCurrentStatus(newStatus);
    setUpdating(true);

    try {
      if (onUpdateStatus) {
        onUpdateStatus(candidate.id, newStatus);
      } else {
        await fetch(`/api/candidates/${candidate.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  const resumeScore = candidate.resumeScore || candidate.matchScore || 75;
  const mlScore = candidate.mlScore || candidate.matchScore || 72;
  const finalScore = candidate.finalScore || candidate.matchScore || 74;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-scaleUp">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-sm shadow-sm">
              {candidate.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900">{candidate.name}</h2>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                  {candidate.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {candidate.appliedJobTitle} • <span className="text-indigo-600">{candidate.department || 'General'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* AI Scores Matrix Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-500/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300">
                  AI Multi-Factor Score Matrix
                </span>
                <h3 className="text-2xl font-black mt-1 text-white">
                  {finalScore}% Final Recruitment Score
                </h3>
                <p className="text-xs text-slate-300 mt-1 flex items-center space-x-1.5">
                  <span>Source:</span>
                  <span className="font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                    {candidate.source || 'Direct Ingestion'}
                  </span>
                </p>
              </div>

              {/* Status Switcher Buttons */}
              <div className="bg-white/10 p-1.5 rounded-xl backdrop-blur-md border border-white/10 flex items-center space-x-1 text-xs">
                <button
                  onClick={() => handleStatusChange('Shortlisted')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    currentStatus === 'Shortlisted'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  Shortlisted
                </button>
                <button
                  onClick={() => handleStatusChange('Review')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    currentStatus === 'Review'
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  Review
                </button>
                <button
                  onClick={() => handleStatusChange('Rejected')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    currentStatus === 'Rejected'
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  Rejected
                </button>
              </div>
            </div>

            {/* 3 AI Metrics Breakdown Cards */}
            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                <span className="block text-[10px] uppercase font-bold text-slate-300">1. Resume Score</span>
                <span className="text-lg font-black text-indigo-300">{resumeScore}%</span>
                <span className="block text-[9px] text-slate-400">Text Structure & Clarity</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                <span className="block text-[10px] uppercase font-bold text-slate-300">2. ML Score</span>
                <span className="text-lg font-black text-violet-300">{mlScore}%</span>
                <span className="block text-[9px] text-slate-400">Skill Vector Alignment</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                <span className="block text-[10px] uppercase font-bold text-slate-300">3. Final Score</span>
                <span className="text-lg font-black text-emerald-400">{finalScore}%</span>
                <span className="block text-[9px] text-slate-400">Weighted AI Prediction</span>
              </div>
            </div>
          </div>

          {/* Contact & Meta Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center space-x-2 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="truncate">{candidate.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{candidate.phone || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <Briefcase className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{candidate.experienceYears} Yrs Exp</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{candidate.expectedSalary || '₹50,000'}</span>
            </div>
          </div>

          {/* Enterprise Resume Intelligence */}
          <div className="bg-gradient-to-br from-indigo-50/70 via-slate-50 to-purple-50/50 rounded-2xl p-5 border border-indigo-100 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Enterprise Resume Intelligence & ATS Evaluation</span>
              </h4>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold">
                  ATS Score: {candidate.atsCompatibilityScore || 85}%
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  Quality: {candidate.resumeQualityScore || 88}%
                </span>
              </div>
            </div>

            {candidate.professionalSummary && (
              <p className="text-xs text-slate-700 leading-relaxed italic bg-white/80 p-3 rounded-xl border border-indigo-100">
                "{candidate.professionalSummary}"
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {candidate.resumeStrengths && candidate.resumeStrengths.length > 0 && (
                <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200/80 space-y-1.5">
                  <span className="font-bold text-emerald-900 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Resume Strengths</span>
                  </span>
                  <ul className="space-y-1 text-emerald-800">
                    {candidate.resumeStrengths.map((str, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {candidate.resumeWeaknesses && candidate.resumeWeaknesses.length > 0 && (
                <div className="bg-rose-50/80 p-3.5 rounded-xl border border-rose-200/80 space-y-1.5">
                  <span className="font-bold text-rose-900 flex items-center space-x-1">
                    <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Areas for Improvement</span>
                  </span>
                  <ul className="space-y-1 text-rose-800">
                    {candidate.resumeWeaknesses.map((wk, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{wk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {candidate.resumeImprovementSuggestions && candidate.resumeImprovementSuggestions.length > 0 && (
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-800 text-xs">AI Suggestions for Candidate Optimization:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {candidate.resumeImprovementSuggestions.map((sug, idx) => (
                    <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
                      💡 {sug}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Hiring Recommendation Engine */}
          {candidate.hiringRecommendation && (
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold flex items-center space-x-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>AI Hiring Recommendation Verdict</span>
                </span>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wide ${
                    candidate.hiringRecommendation.verdict === 'Strong Hire' ? 'bg-emerald-500 text-white' :
                    candidate.hiringRecommendation.verdict === 'Hire' ? 'bg-teal-500 text-white' :
                    candidate.hiringRecommendation.verdict === 'Review Further' ? 'bg-amber-500 text-slate-950' :
                    'bg-rose-600 text-white'
                  }`}>
                    {candidate.hiringRecommendation.verdict}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Confidence: {candidate.hiringRecommendation.confidenceScore}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {candidate.hiringRecommendation.reasoning}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className="text-slate-400">Hiring Risk Profile:</span>
                <span className={`font-bold px-2.5 py-0.5 rounded text-[11px] ${
                  candidate.hiringRecommendation.hiringRisk === 'Low Risk' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                  candidate.hiringRecommendation.hiringRisk === 'Medium Risk' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-rose-950 text-rose-400 border border-rose-800'
                }`}>
                  {candidate.hiringRecommendation.hiringRisk}
                </span>
              </div>
            </div>
          )}

          {/* Skill Gap Analyzer */}
          {candidate.skillGapAnalysis && (
            <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-200/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Skill Gap Intelligence & Actionable Roadmap</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                  <span className="font-bold text-amber-900 block mb-1">Missing Technical Qualifications:</span>
                  <ul className="space-y-1 text-slate-700">
                    {(candidate.skillGapAnalysis.missingSkills || []).map((sk, idx) => (
                      <li key={idx} className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span>{sk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                  <span className="font-bold text-amber-900 block mb-1">AI Recommendation Roadmap:</span>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    {candidate.skillGapAnalysis.recommendationRoadmap || 'Conduct targeted technical interview screening focused on core architecture.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Explainable AI (XAI) Feature Contribution Breakdown */}
          {candidate.explainableAi && (
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <span>Explainable AI (XAI) - Mathematical Feature Weighting</span>
              </h4>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="block text-[10px] text-slate-500 font-semibold">Skill Weight</span>
                  <span className="text-sm font-bold text-indigo-600">{candidate.explainableAi.skillContributionScore}%</span>
                  <div className="w-full bg-slate-100 rounded-full h-1 mt-1">
                    <div className="bg-indigo-600 h-1 rounded-full" style={{ width: `${candidate.explainableAi.skillContributionScore}%` }} />
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="block text-[10px] text-slate-500 font-semibold">Experience Weight</span>
                  <span className="text-sm font-bold text-violet-600">{candidate.explainableAi.experienceContributionScore}%</span>
                  <div className="w-full bg-slate-100 rounded-full h-1 mt-1">
                    <div className="bg-violet-600 h-1 rounded-full" style={{ width: `${candidate.explainableAi.experienceContributionScore}%` }} />
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="block text-[10px] text-slate-500 font-semibold">Education Weight</span>
                  <span className="text-sm font-bold text-emerald-600">{candidate.explainableAi.educationContributionScore}%</span>
                  <div className="w-full bg-slate-100 rounded-full h-1 mt-1">
                    <div className="bg-emerald-600 h-1 rounded-full" style={{ width: `${candidate.explainableAi.educationContributionScore}%` }} />
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="block text-[10px] text-slate-500 font-semibold">Project Weight</span>
                  <span className="text-sm font-bold text-cyan-600">{candidate.explainableAi.projectContributionScore}%</span>
                  <div className="w-full bg-slate-100 rounded-full h-1 mt-1">
                    <div className="bg-cyan-600 h-1 rounded-full" style={{ width: `${candidate.explainableAi.projectContributionScore}%` }} />
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="block text-[10px] text-slate-500 font-semibold">Resume Quality</span>
                  <span className="text-sm font-bold text-amber-600">{candidate.explainableAi.resumeQualityContributionScore}%</span>
                  <div className="w-full bg-slate-100 rounded-full h-1 mt-1">
                    <div className="bg-amber-600 h-1 rounded-full" style={{ width: `${candidate.explainableAi.resumeQualityContributionScore}%` }} />
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-600 font-mono">
                Formula: Final Score = (Skill × 0.35) + (Experience × 0.25) + (Education × 0.15) + (Project × 0.15) + (Resume Quality × 0.10)
              </div>
            </div>
          )}

          {/* Verified Candidate Skills */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Verified Technical Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills.map((skill, i) => (
                <span key={i} className="text-xs bg-indigo-50 border border-indigo-200 text-indigo-900 px-3 py-1 rounded-lg font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Resume Text Content */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Resume / Ingested Document Excerpt</h4>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
              {candidate.resumeText}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-6 py-4 border-t border-slate-100 flex items-center justify-between z-10">
          <button
            onClick={() => {
              onClose();
              onGenerateQuestions(candidate);
            }}
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Generate Interview Kit</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Profile</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
