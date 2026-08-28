import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Download, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Code2, 
  GraduationCap, 
  Award, 
  Briefcase, 
  Sparkles, 
  Edit3, 
  X, 
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  MapPin,
  BookOpen
} from 'lucide-react';
import { Candidate, ExtractedResumeDetails } from '../types';

interface ExtractedResumeMatrixViewProps {
  candidates: Candidate[];
  onUpdateCandidate?: (updatedCandidate: Candidate) => void;
}

export function ExtractedResumeMatrixView({ candidates, onUpdateCandidate }: ExtractedResumeMatrixViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [boardFilter, setBoardFilter] = useState('All');
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [editFormData, setEditFormData] = useState<ExtractedResumeDetails>({});

  // Dynamic CGPA Calculation across all candidates
  const cgpaValues = candidates
    .map(c => c.extractedDetails?.collegeCgpa)
    .filter(Boolean)
    .map(str => {
      const match = str!.match(/(\d+(\.\d+)?)/);
      if (!match) return null;
      const val = parseFloat(match[1]);
      if (val > 10 && val <= 100) return val / 10;
      if (val <= 10) return val;
      return null;
    })
    .filter((val): val is number => val !== null && !isNaN(val));

  const avgCgpa = cgpaValues.length > 0 
    ? (cgpaValues.reduce((a, b) => a + b, 0) / cgpaValues.length).toFixed(2)
    : "0";

  // Dynamic Top School Boards
  const boardCounts: Record<string, number> = {};
  candidates.forEach(c => {
    const board = c.extractedDetails?.schoolBoard;
    if (board && board.trim() && board.toLowerCase() !== "n/a") {
      boardCounts[board.trim()] = (boardCounts[board.trim()] || 0) + 1;
    }
  });
  const topBoardsList = Object.entries(boardCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([b]) => b);

  const topBoardsDisplay = topBoardsList.length > 0 ? topBoardsList.join(", ") : "None";

  // Dynamic Verified / Extracted Credentials Stat
  const extractedCount = candidates.filter(c => c.extractedDetails && Object.keys(c.extractedDetails).length > 0).length;
  const verifiedCredentialsDisplay = candidates.length === 0 
    ? "0 Extracted" 
    : `${extractedCount} / ${candidates.length} (${Math.round((extractedCount / candidates.length) * 100)}%)`;

  // Filter candidates based on search query and school board filter
  const filteredCandidates = candidates.filter(candidate => {
    const details = candidate.extractedDetails || {};
    const query = searchQuery.toLowerCase();
    
    const matchesQuery = 
      candidate.name.toLowerCase().includes(query) ||
      candidate.email.toLowerCase().includes(query) ||
      (candidate.phone && candidate.phone.toLowerCase().includes(query)) ||
      (details.address && details.address.toLowerCase().includes(query)) ||
      (details.skills && details.skills.toLowerCase().includes(query)) ||
      (details.schoolBoard && details.schoolBoard.toLowerCase().includes(query)) ||
      (details.certificates && details.certificates.toLowerCase().includes(query));

    const matchesBoard = boardFilter === 'All' || 
      (details.schoolBoard && details.schoolBoard.toLowerCase().includes(boardFilter.toLowerCase()));

    return matchesQuery && matchesBoard;
  });

  // Extract unique school boards for filter dropdown
  const uniqueBoards = Array.from(new Set(
    candidates.map(c => c.extractedDetails?.schoolBoard).filter(Boolean) as string[]
  ));

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = [
      "Name",
      "Address",
      "Phone No.",
      "Mail ID",
      "GitHub Link",
      "LinkedIn URL",
      "LeetCode / HackerRank URL",
      "Board of School",
      "10th %",
      "12th / Diploma / ITI",
      "College CGPA",
      "Skills",
      "Projects Description",
      "Internships",
      "Training",
      "Extra Curricular",
      "Co-Curricular",
      "Hobbies",
      "Certificates & Awards"
    ];

    const rows = filteredCandidates.map(c => {
      const d = c.extractedDetails || {};
      return [
        `"${c.name}"`,
        `"${d.address || 'N/A'}"`,
        `"${c.phone || 'N/A'}"`,
        `"${c.email || 'N/A'}"`,
        `"${d.githubUrl || 'N/A'}"`,
        `"${d.linkedinUrl || 'N/A'}"`,
        `"${d.codingProfileUrl || 'N/A'}"`,
        `"${d.schoolBoard || 'N/A'}"`,
        `"${d.percentage10th || 'N/A'}"`,
        `"${d.percentage12thOrDiploma || 'N/A'}"`,
        `"${d.collegeCgpa || 'N/A'}"`,
        `"${d.skills || c.skills.join(', ')}"`,
        `"${(d.projectsDescription || '').replace(/"/g, '""')}"`,
        `"${(d.internships || '').replace(/"/g, '""')}"`,
        `"${(d.training || '').replace(/"/g, '""')}"`,
        `"${(d.extraCurricular || '').replace(/"/g, '""')}"`,
        `"${(d.coCurricular || '').replace(/"/g, '""')}"`,
        `"${(d.hobbies || '').replace(/"/g, '""')}"`,
        `"${(d.certificates || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Extracted_Resume_Matrix_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenEdit = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    const d = candidate.extractedDetails || {};
    setEditFormData({
      address: d.address || "",
      githubUrl: d.githubUrl || "",
      linkedinUrl: d.linkedinUrl || "",
      codingProfileUrl: d.codingProfileUrl || "",
      schoolBoard: d.schoolBoard || "",
      percentage10th: d.percentage10th || "",
      percentage12thOrDiploma: d.percentage12thOrDiploma || "",
      collegeCgpa: d.collegeCgpa || "",
      skills: d.skills || candidate.skills.join(', '),
      projectsDescription: d.projectsDescription || "",
      internships: d.internships || "",
      training: d.training || "",
      extraCurricular: d.extraCurricular || "",
      coCurricular: d.coCurricular || "",
      hobbies: d.hobbies || "",
      certificates: d.certificates || ""
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCandidate) return;

    const updated: Candidate = {
      ...editingCandidate,
      extractedDetails: { ...editFormData }
    };

    if (onUpdateCandidate) {
      onUpdateCandidate(updated);
    }
    setEditingCandidate(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-indigo-500/20 border border-indigo-400/30 rounded-2xl text-indigo-400 shrink-0">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Extracted Resume Matrix</h1>
                  <span className="bg-indigo-500/30 text-indigo-300 border border-indigo-500/50 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Auto-Populated
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  Automated structured master ledger extracting key academic history, online profiles, skills, projects, and extracurricular details upon resume ingestion.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV (19 Columns)</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/40 border border-slate-700/50 p-3 rounded-2xl">
            <div className="text-xs font-medium text-slate-400">Total Candidates</div>
            <div className="text-xl font-bold text-white mt-1">{candidates.length} Profiles</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 p-3 rounded-2xl">
            <div className="text-xs font-medium text-slate-400">Avg College CGPA</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">
              {avgCgpa === "0" ? "0" : `${avgCgpa} / 10.0`}
            </div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 p-3 rounded-2xl">
            <div className="text-xs font-medium text-slate-400">Top School Boards</div>
            <div className="text-xl font-bold text-indigo-300 mt-1">{topBoardsDisplay}</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 p-3 rounded-2xl">
            <div className="text-xs font-medium text-slate-400">Verified Credentials</div>
            <div className="text-xl font-bold text-amber-300 mt-1">{verifiedCredentialsDisplay}</div>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Board Filter */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate name, email, address, board, skills, projects, certificates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="flex items-center space-x-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">School Board:</label>
            <select
              value={boardFilter}
              onChange={(e) => setBoardFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All School Boards</option>
              <option value="CBSE">CBSE Board</option>
              <option value="ICSE">ICSE Board</option>
              <option value="Stateboard">State Board</option>
              <option value="Kendriya">Kendriya Vidyalaya (KV)</option>
              <option value="Matriculation">Matriculation</option>
              {uniqueBoards.map((board, idx) => (
                <option key={idx} value={board}>{board}</option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredCandidates.length}</strong> of {candidates.length}
          </div>
        </div>
      </div>

      {/* Main Extracted Resume Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left border-collapse min-w-[2400px]">
            <thead>
              <tr className="bg-slate-900 text-slate-200 text-[11px] uppercase tracking-wider font-bold">
                {/* 1. Candidate Name (Non-sticky so whole row scrolls together seamlessly) */}
                <th className="py-3.5 px-4 border-r border-slate-800 w-[200px]">
                  1. Candidate Name
                </th>
                {/* 2. Address */}
                <th className="py-3.5 px-4 border-r border-slate-800 w-[220px]">
                  2. Address
                </th>
                {/* 3. Phone */}
                <th className="py-3.5 px-4 border-r border-slate-800 w-[140px]">
                  3. Phone No.
                </th>
                {/* 4. Mail ID */}
                <th className="py-3.5 px-4 border-r border-slate-800 w-[180px]">
                  4. Mail ID
                </th>
                {/* 5. GitHub Link */}
                <th className="py-3.5 px-4 border-r border-slate-800 w-[150px]">
                  5. GitHub Link
                </th>
                {/* 6. LinkedIn URL */}
                <th className="py-3.5 px-4 border-r border-slate-800 w-[150px]">
                  6. LinkedIn URL
                </th>
                {/* 7. LeetCode / HackerRank URL */}
                <th className="py-3.5 px-4 border-r border-slate-800 w-[190px]">
                  7. LeetCode / HackerRank
                </th>
                {/* 8. Board of School */}
                <th className="py-3.5 px-4 border-r border-slate-800 w-[160px]">
                  8. School Board
                </th>
                {/* 9. 10th % */}
                <th className="py-3.5 px-4 border-r border-slate-800 w-[110px]">
                  9. 10th % / CGPA
                </th>
                {/* 10. 12th / Diploma / ITI */}
                <th className="py-3.5 px-4 border-r border-slate-800 w-[160px]">
                  10. 12th / Diploma / ITI
                </th>
                {/* 11. College CGPA */}
                <th className="py-3.5 px-4 border-r border-slate-800 w-[130px]">
                  11. College CGPA
                </th>
                {/* 12. Skills */}
                <th className="py-3.5 px-4 border-r border-slate-800 w-[200px]">
                  12. Extracted Skills
                </th>
                {/* 13. Projects Description */}
                <th className="py-3.5 px-4 border-r border-slate-800 w-[240px]">
                  13. Projects Description
                </th>
                {/* 14. Internships */}
                <th className="py-3.5 px-4 border-r border-slate-800 w-[220px]">
                  14. Internships
                </th>
                {/* 15. Training */}
                <th className="py-3.5 px-4 border-r border-slate-800 w-[200px]">
                  15. Training (If Any)
                </th>
                {/* 16. Extra Curricular */}
                <th className="py-3.5 px-4 border-r border-slate-800 w-[180px]">
                  16. Extra Curricular
                </th>
                {/* 17. Co-Curricular */}
                <th className="py-3.5 px-4 border-r border-slate-800 w-[180px]">
                  17. Co-Curricular
                </th>
                {/* 18. Hobbies */}
                <th className="py-3.5 px-4 border-r border-slate-800 w-[160px]">
                  18. Hobbies
                </th>
                {/* 19. Certificates */}
                <th className="py-3.5 px-4 border-r border-slate-800 w-[220px]">
                  19. Certificates & Awards
                </th>
                <th className="py-3.5 px-4 text-center w-[90px]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={20} className="py-12 text-center text-slate-400">
                    <FileSpreadsheet className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">No candidates match the specified filter query.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try resetting search filters or upload new candidate resumes.</p>
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((candidate, idx) => {
                  const d = candidate.extractedDetails || {};
                  return (
                    <tr key={candidate.id || idx} className="hover:bg-indigo-50/40 transition-colors group">
                      {/* 1. Name */}
                      <td className="py-3.5 px-4 border-r border-slate-200 font-bold text-slate-900">
                        <div className="flex items-center justify-between">
                          <span className="truncate">{candidate.name}</span>
                        </div>
                        <div className="text-[10px] text-indigo-600 font-medium truncate mt-0.5">
                          {candidate.appliedJobTitle}
                        </div>
                      </td>

                      {/* 2. Address */}
                      <td className="py-3.5 px-4 border-r border-slate-200 text-slate-600">
                        <div className="flex items-start space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{d.address || "N/A"}</span>
                        </div>
                      </td>

                      {/* 3. Phone */}
                      <td className="py-3.5 px-4 border-r border-slate-200 text-slate-800 font-mono text-[11px]">
                        <div className="flex items-center space-x-1.5">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{candidate.phone || "N/A"}</span>
                        </div>
                      </td>

                      {/* 4. Mail ID */}
                      <td className="py-3.5 px-4 border-r border-slate-200 text-slate-800 font-mono text-[11px]">
                        <div className="flex items-center space-x-1.5 truncate">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{candidate.email || "N/A"}</span>
                        </div>
                      </td>

                      {/* 5. GitHub Link */}
                      <td className="py-3.5 px-4 border-r border-slate-200">
                        {d.githubUrl ? (
                          <a 
                            href={d.githubUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 hover:underline font-semibold text-[11px]"
                          >
                            <Github className="w-3.5 h-3.5" />
                            <span>GitHub Profile</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">N/A</span>
                        )}
                      </td>

                      {/* 6. LinkedIn URL */}
                      <td className="py-3.5 px-4 border-r border-slate-200">
                        {d.linkedinUrl ? (
                          <a 
                            href={d.linkedinUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 hover:underline font-semibold text-[11px]"
                          >
                            <Linkedin className="w-3.5 h-3.5" />
                            <span>LinkedIn Profile</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">N/A</span>
                        )}
                      </td>

                      {/* 7. LeetCode / HackerRank URL */}
                      <td className="py-3.5 px-4 border-r border-slate-200">
                        {d.codingProfileUrl ? (
                          <a 
                            href={d.codingProfileUrl.split('|')[0].trim()} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center space-x-1 text-amber-600 hover:text-amber-800 hover:underline font-semibold text-[11px]"
                          >
                            <Code2 className="w-3.5 h-3.5 text-amber-500" />
                            <span>LeetCode / HackerRank</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">N/A</span>
                        )}
                      </td>

                      {/* 8. Board of School */}
                      <td className="py-3.5 px-4 border-r border-slate-200 font-semibold text-slate-800">
                        <span className="inline-block bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md text-[11px] border border-slate-200">
                          {d.schoolBoard || "N/A"}
                        </span>
                      </td>

                      {/* 9. 10th % */}
                      <td className="py-3.5 px-4 border-r border-slate-200 font-bold text-emerald-700">
                        {d.percentage10th || "N/A"}
                      </td>

                      {/* 10. 12th / Diploma / ITI */}
                      <td className="py-3.5 px-4 border-r border-slate-200 font-semibold text-slate-800">
                        {d.percentage12thOrDiploma || "N/A"}
                      </td>

                      {/* 11. College CGPA */}
                      <td className="py-3.5 px-4 border-r border-slate-200">
                        {d.collegeCgpa ? (
                          <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded-lg text-[11px]">
                            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{d.collegeCgpa}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">N/A</span>
                        )}
                      </td>

                      {/* 12. Skills */}
                      <td className="py-3.5 px-4 border-r border-slate-200">
                        {d.skills || (candidate.skills && candidate.skills.length > 0) ? (
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {(d.skills || candidate.skills.join(', ')).split(',').slice(0, 4).map((sk, sIdx) => (
                              <span key={sIdx} className="bg-indigo-50 text-indigo-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-indigo-100">
                                {sk.trim()}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">N/A</span>
                        )}
                      </td>

                      {/* 13. Projects Description */}
                      <td className="py-3.5 px-4 border-r border-slate-200 text-slate-700">
                        <p className="line-clamp-2 text-[11px] leading-relaxed">
                          {d.projectsDescription || "N/A"}
                        </p>
                      </td>

                      {/* 14. Internships */}
                      <td className="py-3.5 px-4 border-r border-slate-200 text-slate-700">
                        <p className="line-clamp-2 text-[11px]">
                          {d.internships || "N/A"}
                        </p>
                      </td>

                      {/* 15. Training (If Any) */}
                      <td className="py-3.5 px-4 border-r border-slate-200 text-slate-700">
                        <p className="line-clamp-2 text-[11px]">
                          {d.training || "N/A"}
                        </p>
                      </td>

                      {/* 16. Extra Curricular */}
                      <td className="py-3.5 px-4 border-r border-slate-200 text-slate-700">
                        <p className="line-clamp-2 text-[11px]">
                          {d.extraCurricular || "N/A"}
                        </p>
                      </td>

                      {/* 17. Co-Curricular */}
                      <td className="py-3.5 px-4 border-r border-slate-200 text-slate-700">
                        <p className="line-clamp-2 text-[11px]">
                          {d.coCurricular || "N/A"}
                        </p>
                      </td>

                      {/* 18. Hobbies */}
                      <td className="py-3.5 px-4 border-r border-slate-200 text-slate-700">
                        <p className="line-clamp-2 text-[11px]">
                          {d.hobbies || "N/A"}
                        </p>
                      </td>

                      {/* 19. Certificates */}
                      <td className="py-3.5 px-4 border-r border-slate-200 text-slate-800 font-medium">
                        {d.certificates ? (
                          <div className="flex items-start space-x-1">
                            <Award className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <span className="line-clamp-2 text-[11px]">{d.certificates}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">N/A</span>
                        )}
                      </td>

                      {/* Action: Edit Record */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleOpenEdit(candidate)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-600 transition-all cursor-pointer"
                          title="Edit Extracted Details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Extracted Record Modal */}
      {editingCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-6 my-8 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600">
                  <Edit3 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Edit Extracted Details - {editingCandidate.name}</h2>
                  <p className="text-xs text-slate-500">Update extracted resume fields for candidate matrix database</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingCandidate(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Physical Address</label>
                  <input
                    type="text"
                    value={editFormData.address || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">School Board (e.g. CBSE, ICSE, Stateboard, KV)</label>
                  <input
                    type="text"
                    value={editFormData.schoolBoard || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, schoolBoard: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">GitHub Profile Link</label>
                  <input
                    type="text"
                    value={editFormData.githubUrl || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, githubUrl: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={editFormData.linkedinUrl || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, linkedinUrl: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">LeetCode / HackerRank URL</label>
                  <input
                    type="text"
                    value={editFormData.codingProfileUrl || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, codingProfileUrl: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">10th Grade Percentage / CGPA</label>
                  <input
                    type="text"
                    value={editFormData.percentage10th || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, percentage10th: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">12th Grade / Diploma / ITI</label>
                  <input
                    type="text"
                    value={editFormData.percentage12thOrDiploma || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, percentage12thOrDiploma: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">College CGPA / Percentage</label>
                  <input
                    type="text"
                    value={editFormData.collegeCgpa || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, collegeCgpa: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Projects (Short Description)</label>
                <textarea
                  rows={2}
                  value={editFormData.projectsDescription || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, projectsDescription: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Internships</label>
                  <textarea
                    rows={2}
                    value={editFormData.internships || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, internships: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Training (If Any)</label>
                  <textarea
                    rows={2}
                    value={editFormData.training || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, training: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Extra Curricular</label>
                  <input
                    type="text"
                    value={editFormData.extraCurricular || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, extraCurricular: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Co-Curricular</label>
                  <input
                    type="text"
                    value={editFormData.coCurricular || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, coCurricular: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hobbies</label>
                  <input
                    type="text"
                    value={editFormData.hobbies || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, hobbies: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Course / Winning / Participation Certificates</label>
                  <input
                    type="text"
                    value={editFormData.certificates || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, certificates: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCandidate(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl font-semibold shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Candidate Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
