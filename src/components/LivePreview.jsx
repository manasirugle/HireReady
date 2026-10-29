/* eslint-disable no-unused-vars */
import { Download, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';

export default function LivePreview({ resumeData, selectedTemplate }) {
    const [scale, setScale] = useState(0.85);

    if (!resumeData) return null;

    const handleDownload = () => {
        const element = document.getElementById('resume-preview-content');

        // Clone the node to clean up for PDF/print if needed, or use specific options
        // For html2pdf, we want to capture the element as if it were unscaled.
        // The scale transform on the parent doesn't affect the element's internal layout, 
        // but html2canvas might capture the visual scale.
        // Best practice: temporarily reset scale or use a clone. 
        // However, html2pdf usually captures DOM structure.

        const opt = {
            margin: 0.4,
            filename: `${resumeData.personal_info?.full_name || 'Resume'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, scrollX: 0, scrollY: 0 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        if (window.html2pdf) {
            // We use the element directly. If the visual quality is low due to CSS transform, 
            // we might need to temporarily unset it, but here the transform is on the wrapper.
            window.html2pdf().set(opt).from(element).save();
        } else {
            alert("PDF Generator is still loading...");
        }
    };

    return (
        <div className="flex flex-col items-center w-full bg-gray-600 p-4 rounded-lg overflow-hidden h-full">
            <div className="flex justify-between w-full max-w-3xl mb-4 sticky top-0 z-20 bg-gray-600/90 backdrop-blur pb-2">
                <div className="text-white text-sm flex items-center font-medium">
                    Preview Mode
                </div>
                <div className="flex space-x-2 items-center">
                    <div className="flex items-center bg-gray-700 rounded-lg mr-2">
                        <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-2 text-white hover:bg-gray-600 rounded-l-lg"><ZoomOut className="w-4 h-4" /></button>
                        <span className="text-xs text-white px-2 w-12 text-center">{Math.round(scale * 100)}%</span>
                        <button onClick={() => setScale(s => Math.min(1.5, s + 0.1))} className="p-2 text-white hover:bg-gray-600 rounded-r-lg"><ZoomIn className="w-4 h-4" /></button>
                    </div>
                    <button
                        onClick={handleDownload}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-bold hover:bg-indigo-700 transition flex items-center shadow-lg"
                    >
                        <Download className="w-4 h-4 mr-2" /> PDF
                    </button>
                </div>
            </div>

            <div className="w-full flex-1 overflow-auto flex justify-center bg-gray-500/30 rounded-lg p-8 custom-scrollbar relative">
                <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', transition: 'transform 0.2s' }}>
                    <div
                        id="resume-preview-content"
                        className="bg-white shadow-2xl w-[8.5in] min-h-[11in] p-[1in] text-gray-900 font-serif relative mx-auto"
                        style={{ fontSize: '11pt', lineHeight: '1.4' }}
                    >
                        {/* Header */}
                        <div className="border-b-2 border-gray-900 pb-6 mb-8 text-center">
                            <h1 className="text-4xl font-extrabold uppercase tracking-widest text-gray-900 mb-2">{resumeData.personal_info?.full_name || "Your Name"}</h1>
                            <div className="flex justify-center flex-wrap gap-3 text-sm text-gray-600 font-sans mt-2">
                                {resumeData.personal_info?.email && <span className="flex items-center">{resumeData.personal_info.email}</span>}
                                {resumeData.personal_info?.phone && <span>• {resumeData.personal_info.phone}</span>}
                                {resumeData.personal_info?.linkedin && <span>• {resumeData.personal_info.linkedin}</span>}
                                {resumeData.personal_info?.portfolio && <span>• {resumeData.personal_info.portfolio}</span>}
                            </div>
                        </div>

                        {/* Summary */}
                        {resumeData.professional_summary && (
                            <div className="mb-8">
                                <h2 className="text-sm font-bold uppercase tracking-widest mb-3 text-indigo-900 border-b border-gray-200 pb-1">Professional Summary</h2>
                                <p className="text-gray-700 text-justify">{resumeData.professional_summary}</p>
                            </div>
                        )}

                        {/* Experience */}
                        <div className="mb-8">
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 text-indigo-900 border-b border-gray-200 pb-1">Professional Experience</h2>
                            {resumeData.experience?.map((exp, idx) => (
                                <div key={idx} className="mb-5 break-inside-avoid">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-gray-800 text-lg">{exp.job_title}</h3>
                                        <span className="text-sm font-medium text-gray-500 font-sans">{exp.start_date} – {exp.end_date}</span>
                                    </div>
                                    <p className="text-md font-semibold text-indigo-700 mb-2">{exp.company}</p>
                                    <ul className="list-disc list-outside ml-5 space-y-1">
                                        {exp.description_bullets?.map((bull, i) => (
                                            <li key={i} className="text-gray-700 pl-1 marker:text-gray-400">{bull}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* Education */}
                        <div className="mb-8 break-inside-avoid">
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 text-indigo-900 border-b border-gray-200 pb-1">Education</h2>
                            {resumeData.education?.map((edu, idx) => (
                                <div key={idx} className="mb-3">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-gray-800 text-md">{edu.school}</h3>
                                        <span className="text-sm font-medium text-gray-500 font-sans">{edu.graduation_year}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 italic">{edu.degree}</p>
                                </div>
                            ))}
                        </div>

                        {/* Skills */}
                        <div className="break-inside-avoid">
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 text-indigo-900 border-b border-gray-200 pb-1">Skills</h2>
                            <p className="text-gray-700 leading-relaxed font-sans text-sm">
                                {resumeData.skills?.join(" • ")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
