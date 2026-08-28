import React, { useState } from 'react';
import { 
  Candidate, 
  Job, 
  PipelineStage 
} from '../types';
import { 
  Users, 
  Search, 
  Filter, 
  ChevronRight, 
  Sparkles, 
  MoveRight, 
  ArrowRight,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase
} from 'lucide-react';

interface KanbanPipelineViewProps {
  candidates: Candidate[];
  jobs: Job[];
  onUpdateStatus: (candidateId: string, newStatus: string) => void;
  onSelectCandidate: (candidate: Candidate) => void;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  'Applied',
  'Resume Screening',
  'AI Evaluation',
  'Shortlisted',
  'Interview Scheduled',
  'Technical Interview',
  'HR Interview',
  'Manager Review',
  'Offer Released',
  'Accepted',
  'Rejected',
  'Onboarding'
];

export function KanbanPipelineView({ candidates, jobs, onUpdateStatus, onSelectCandidate }: KanbanPipelineViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [draggedCandidateId, setDraggedCandidateId] = useState<string | null>(null);

  // Map candidates to pipeline stages safely
  const mapStatusToStage = (status: string): PipelineStage => {
    const matched = PIPELINE_STAGES.find(s => s.toLowerCase() === status.toLowerCase());
    if (matched) return matched;
    
    // Normalization fallbacks for legacy status values
    if (status.includes('Review') || status.includes('New Applicant')) return 'Applied';
    if (status.includes('Shortlist')) return 'Shortlisted';
    if (status.includes('Hired')) return 'Accepted';
    if (status.includes('Reject')) return 'Rejected';
    return 'Applied';
  };

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.appliedJobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesJob = selectedJobId === 'all' || c.appliedJobId === selectedJobId;
    return matchesSearch && matchesJob;
  });

  const getStageCandidates = (stage: PipelineStage) => {
    return filteredCandidates.filter(c => mapStatusToStage(c.status) === stage);
  };

  const handleDragStart = (e: React.DragEvent, candidateId: string) => {
    e.dataTransfer.setData('text/plain', candidateId);
    setDraggedCandidateId(candidateId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    const candidateId = e.dataTransfer.getData('text/plain') || draggedCandidateId;
    if (candidateId) {
      onUpdateStatus(candidateId, targetStage);
      setDraggedCandidateId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30">
                12-Stage Automated Pipeline
              </span>
            </div>
            <h1 className="text-2xl font-black mt-2 tracking-tight">Enterprise Recruitment Pipeline</h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Drag-and-drop candidates across 12 automated recruitment stages from application through technical evaluation to offer acceptance and onboarding.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
            <Users className="w-5 h-5 text-indigo-400" />
            <div>
              <p className="text-xs text-slate-400">Total Active Candidates</p>
              <p className="text-xl font-bold text-indigo-200">{filteredCandidates.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text"
            placeholder="Search candidates by name, job, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-600">Filter Job:</span>
          </div>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Requisitions ({jobs.length})</option>
            {jobs.map(j => (
              <option key={j.id} value={j.id}>{j.title} ({j.department})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board Container - Horizontal Scroll */}
      <div className="overflow-x-auto pb-6 custom-scrollbar">
        <div className="flex space-x-4 min-w-[3200px]">
          {PIPELINE_STAGES.map((stage, idx) => {
            const stageList = getStageCandidates(stage);
            
            // Dynamic column color themes
            let headerBg = "bg-slate-100 text-slate-700 border-slate-200";
            let badgeBg = "bg-slate-200 text-slate-800";
            
            if (stage === 'Shortlisted') {
              headerBg = "bg-indigo-50 text-indigo-900 border-indigo-200";
              badgeBg = "bg-indigo-200 text-indigo-900";
            } else if (stage === 'Offer Released' || stage === 'Accepted') {
              headerBg = "bg-emerald-50 text-emerald-900 border-emerald-200";
              badgeBg = "bg-emerald-200 text-emerald-900";
            } else if (stage === 'Rejected') {
              headerBg = "bg-rose-50 text-rose-900 border-rose-200";
              badgeBg = "bg-rose-200 text-rose-900";
            } else if (stage === 'Onboarding') {
              headerBg = "bg-cyan-50 text-cyan-900 border-cyan-200";
              badgeBg = "bg-cyan-200 text-cyan-900";
            }

            return (
              <div 
                key={stage}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
                className="w-72 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3 flex flex-col space-y-3 min-h-[600px] transition-colors hover:border-indigo-300"
              >
                {/* Stage Column Header */}
                <div className={`p-3 rounded-xl border flex items-center justify-between font-bold text-xs ${headerBg}`}>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-current opacity-75" />
                    <span>{stage}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${badgeBg}`}>
                    {stageList.length}
                  </span>
                </div>

                {/* Candidate Cards in Stage */}
                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {stageList.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center text-xs text-slate-400">
                      No candidates in {stage}
                    </div>
                  ) : (
                    stageList.map((candidate) => (
                      <div
                        key={candidate.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, candidate.id)}
                        className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all cursor-grab active:cursor-grabbing space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-0.5" onClick={() => onSelectCandidate(candidate)}>
                            <h3 className="text-xs font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                              {candidate.name}
                            </h3>
                            <p className="text-[11px] font-medium text-slate-500 line-clamp-1">
                              {candidate.appliedJobTitle}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              candidate.matchScore >= 80 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            }`}>
                              {candidate.matchScore}% AI
                            </span>
                          </div>
                        </div>

                        {/* Candidate Skills Pills */}
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 3).map((skill, sIdx) => (
                            <span key={sIdx} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium">
                              {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 3 && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              +{candidate.skills.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Action Bar & Move Stage Dropdown */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                          <span className="flex items-center space-x-1 text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>{candidate.experienceYears}y exp</span>
                          </span>

                          <div className="flex items-center space-x-1">
                            <select
                              value={mapStatusToStage(candidate.status)}
                              onChange={(e) => onUpdateStatus(candidate.id, e.target.value)}
                              className="bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-700 rounded px-1.5 py-0.5 outline-none hover:bg-slate-200 cursor-pointer"
                            >
                              {PIPELINE_STAGES.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
