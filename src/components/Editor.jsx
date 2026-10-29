/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

const Section = ({ title, children, isOpen, onToggle }) => (
    <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
        <button
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition text-left"
            onClick={onToggle}
        >
            <span className="font-semibold text-gray-700">{title}</span>
            {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
        {isOpen && <div className="p-4 bg-white border-t border-gray-200">{children}</div>}
    </div>
);

export default function Editor({ resumeData, setResumeData }) {
    const [openSection, setOpenSection] = useState('personal');

    const handleChange = (section, field, value) => {
        setResumeData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const handleArrayChange = (section, index, field, value) => {
        const newArray = [...resumeData[section]];
        newArray[index][field] = value;
        setResumeData(prev => ({ ...prev, [section]: newArray }));
    };

    const handleBulletChange = (section, itemIndex, bulletIndex, value) => {
        const newArray = [...resumeData[section]];
        newArray[itemIndex].description_bullets[bulletIndex] = value;
        setResumeData(prev => ({ ...prev, [section]: newArray }));
    };

    const addArrayItem = (section, template) => {
        setResumeData(prev => ({
            ...prev,
            [section]: [...(prev[section] || []), template]
        }));
    };

    const removeArrayItem = (section, index) => {
        const newArray = [...resumeData[section]];
        newArray.splice(index, 1);
        setResumeData(prev => ({ ...prev, [section]: newArray }));
    };

    const addBullet = (section, itemIndex) => {
        const newArray = [...resumeData[section]];
        newArray[itemIndex].description_bullets.push("New bullet point");
        setResumeData(prev => ({ ...prev, [section]: newArray }));
    };

    const removeBullet = (section, itemIndex, bulletIndex) => {
        const newArray = [...resumeData[section]];
        newArray[itemIndex].description_bullets.splice(bulletIndex, 1);
        setResumeData(prev => ({ ...prev, [section]: newArray }));
    };

    if (!resumeData) return null;

    return (
        <div className="space-y-4">
            {/* Personal Info */}
            <Section title="Personal Information" isOpen={openSection === 'personal'} onToggle={() => setOpenSection(openSection === 'personal' ? null : 'personal')}>
                <div className="grid grid-cols-1 gap-4">
                    <input className="input-field" placeholder="Full Name" value={resumeData.personal_info?.full_name || ''} onChange={e => handleChange('personal_info', 'full_name', e.target.value)} />
                    <input className="input-field" placeholder="Email" value={resumeData.personal_info?.email || ''} onChange={e => handleChange('personal_info', 'email', e.target.value)} />
                    <input className="input-field" placeholder="Phone" value={resumeData.personal_info?.phone || ''} onChange={e => handleChange('personal_info', 'phone', e.target.value)} />
                    <input className="input-field" placeholder="LinkedIn URL" value={resumeData.personal_info?.linkedin || ''} onChange={e => handleChange('personal_info', 'linkedin', e.target.value)} />
                    <input className="input-field" placeholder="Portfolio URL" value={resumeData.personal_info?.portfolio || ''} onChange={e => handleChange('personal_info', 'portfolio', e.target.value)} />
                </div>
            </Section>

            {/* Professional Summary */}
            <Section title="Professional Summary" isOpen={openSection === 'summary'} onToggle={() => setOpenSection(openSection === 'summary' ? null : 'summary')}>
                <textarea
                    className="input-field h-32"
                    placeholder="Write a compelling professional summary..."
                    value={resumeData.professional_summary || ''}
                    onChange={e => setResumeData(prev => ({ ...prev, professional_summary: e.target.value }))}
                />
            </Section>

            {/* Experience */}
            <Section title="Experience" isOpen={openSection === 'experience'} onToggle={() => setOpenSection(openSection === 'experience' ? null : 'experience')}>
                {resumeData.experience?.map((exp, idx) => (
                    <div key={idx} className="mb-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-800">Job {idx + 1}</h4>
                            <button onClick={() => removeArrayItem('experience', idx)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <input className="input-field" placeholder="Job Title" value={exp.job_title} onChange={e => handleArrayChange('experience', idx, 'job_title', e.target.value)} />
                            <input className="input-field" placeholder="Company" value={exp.company} onChange={e => handleArrayChange('experience', idx, 'company', e.target.value)} />
                            <input className="input-field" placeholder="Start Date" value={exp.start_date} onChange={e => handleArrayChange('experience', idx, 'start_date', e.target.value)} />
                            <input className="input-field" placeholder="End Date" value={exp.end_date} onChange={e => handleArrayChange('experience', idx, 'end_date', e.target.value)} />
                        </div>
                        <div className="space-y-2 pl-4 border-l-2 border-gray-100">
                            <label className="text-xs font-semibold text-gray-500">Achievements (Bullets)</label>
                            {exp.description_bullets.map((bullet, bIdx) => (
                                <div key={bIdx} className="flex gap-2">
                                    <textarea
                                        rows="2"
                                        className="input-field text-sm"
                                        value={bullet}
                                        onChange={e => handleBulletChange('experience', idx, bIdx, e.target.value)}
                                    />
                                    <button onClick={() => removeBullet('experience', idx, bIdx)} className="text-gray-400 hover:text-red-500 self-start mt-2"><Trash2 className="w-3 h-3" /></button>
                                </div>
                            ))}
                            <button onClick={() => addBullet('experience', idx)} className="text-xs text-indigo-600 font-medium hover:underline flex items-center mt-2">
                                <Plus className="w-3 h-3 mr-1" /> Add Bullet
                            </button>
                        </div>
                    </div>
                ))}
                <button
                    onClick={() => addArrayItem('experience', { job_title: '', company: '', start_date: '', end_date: '', description_bullets: [''] })}
                    className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium rounded-lg border border-dashed border-gray-300 flex items-center justify-center transition"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Experience
                </button>
            </Section>

            {/* Education */}
            <Section title="Education" isOpen={openSection === 'education'} onToggle={() => setOpenSection(openSection === 'education' ? null : 'education')}>
                {resumeData.education?.map((edu, idx) => (
                    <div key={idx} className="mb-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-800">Education {idx + 1}</h4>
                            <button onClick={() => removeArrayItem('education', idx)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <input className="input-field" placeholder="Degree" value={edu.degree} onChange={e => handleArrayChange('education', idx, 'degree', e.target.value)} />
                            <input className="input-field" placeholder="School/University" value={edu.school} onChange={e => handleArrayChange('education', idx, 'school', e.target.value)} />
                            <input className="input-field" placeholder="Graduation Year" value={edu.graduation_year} onChange={e => handleArrayChange('education', idx, 'graduation_year', e.target.value)} />
                        </div>
                    </div>
                ))}
                <button
                    onClick={() => addArrayItem('education', { degree: '', school: '', graduation_year: '' })}
                    className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium rounded-lg border border-dashed border-gray-300 flex items-center justify-center transition"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Education
                </button>
            </Section>

            {/* Skills */}
            <Section title="Skills" isOpen={openSection === 'skills'} onToggle={() => setOpenSection(openSection === 'skills' ? null : 'skills')}>
                <div className="grid grid-cols-1 gap-2">
                    <label className="text-sm text-gray-600">Comma separated skills</label>
                    <textarea
                        className="input-field"
                        value={resumeData.skills?.join(", ") || ''}
                        onChange={e => setResumeData(prev => ({ ...prev, skills: e.target.value.split(",").map(s => s.trim()) }))}
                    />
                </div>
            </Section>

            <style>{`
                .input-field {
                    width: 100%;
                    padding: 0.5rem 0.75rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                }
                .input-field:focus {
                    outline: none;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                }
            `}</style>
        </div>
    );
}
