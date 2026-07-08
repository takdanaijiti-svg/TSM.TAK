import React, { useState } from 'react';
import { useJobs } from '../contexts/JobContext';
import { JobStatus } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, ChevronRight, MessageSquare, Paperclip, Truck } from 'lucide-react';

const COLUMNS: JobStatus[] = ['Pending', 'In Progress', 'Completed', 'Delivered'];

export function JobKanban() {
  const { jobs, updateJobStatus } = useJobs();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [note, setNote] = useState('');
  const [attachment, setAttachment] = useState('');

  const handleStatusChange = (jobId: string, status: JobStatus) => {
    updateJobStatus(jobId, status, note, attachment);
    setSelectedJob(null);
    setNote('');
    setAttachment('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">จัดการงานผลิต / ออกแบบ</h1>
          <p className="text-slate-500 mt-1">กระดานติดตามสถานะการทำงาน</p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {COLUMNS.map(status => {
          const columnJobs = jobs.filter(j => j.status === status);
          
          return (
            <div key={status} className="flex-shrink-0 w-80 flex flex-col bg-slate-100 rounded-2xl p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  {status === 'Pending' && <Clock size={16} className="text-amber-500" />}
                  {status === 'In Progress' && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                  {status === 'Completed' && <CheckCircle2 size={16} className="text-green-500" />}
                  {status === 'Delivered' && <Truck size={16} className="text-purple-500" />}
                  {status}
                </h3>
                <span className="bg-white text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                  {columnJobs.length}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                <AnimatePresence>
                  {columnJobs.map(job => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-green-400 hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-slate-400 font-mono">#{job.id.toUpperCase()}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{job.category}</span>
                      </div>
                      <h4 className="font-semibold text-slate-800 text-sm mb-1">{job.subType}</h4>
                      <p className="text-xs text-slate-500 mb-3 truncate">{job.topic}</p>
                      <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-50 pt-3">
                        <div className="flex items-center gap-1">
                           <span className="font-medium text-slate-700">{job.userName}</span>
                        </div>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-green-500 transition-colors" />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {selectedJob && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <div className="text-xs font-bold text-green-600 mb-1">{selectedJob.category}</div>
                <h3 className="text-xl font-bold text-slate-800">{selectedJob.subType}</h3>
              </div>
              <button onClick={() => setSelectedJob(null)} className="p-2 text-slate-400 hover:text-slate-600 bg-white rounded-full shadow-sm">
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">ผู้สั่งงาน:</span> <span className="font-medium text-slate-800">{selectedJob.userName}</span></div>
                <div><span className="text-slate-500">หน่วยงาน:</span> <span className="font-medium text-slate-800">{selectedJob.userDepartment}</span></div>
                <div><span className="text-slate-500">เบอร์โทร:</span> <span className="font-medium text-slate-800">{selectedJob.userPhone}</span></div>
                <div><span className="text-slate-500">กำหนดรับ:</span> <span className="font-medium text-slate-800">{new Date(selectedJob.dueDate).toLocaleDateString('th-TH')}</span></div>
                {selectedJob.size && <div><span className="text-slate-500">ขนาด:</span> <span className="font-medium text-slate-800">{selectedJob.size}</span></div>}
                <div><span className="text-slate-500">จำนวน:</span> <span className="font-medium text-slate-800">{selectedJob.quantity} ชิ้น</span></div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl text-sm border border-slate-100">
                <span className="text-slate-500 block mb-1">หัวข้อ/เรื่อง:</span>
                <span className="font-medium text-slate-800">{selectedJob.topic || '-'}</span>
                
                {selectedJob.details && (
                  <>
                    <span className="text-slate-500 block mt-3 mb-1">รายละเอียดเพิ่มเติม:</span>
                    <span className="font-medium text-slate-800 whitespace-pre-wrap">{selectedJob.details}</span>
                  </>
                )}
              </div>

              {(selectedJob.status === 'In Progress' || selectedJob.status === 'Completed') && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div>
                     <label className="text-sm font-medium text-slate-700 mb-1 block">แนบไฟล์งานที่เสร็จแล้ว (URL)</label>
                     <input type="text" value={attachment} onChange={e => setAttachment(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="https://..." />
                  </div>
                  <div>
                     <label className="text-sm font-medium text-slate-700 mb-1 block">ข้อความแจ้งเตือน (ส่งถึงผู้ใช้)</label>
                     <textarea value={note} onChange={e => setNote(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500" rows={2} placeholder="เช่น สามารถมารับงานได้ที่ห้องโสตฯ..." />
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-slate-50 flex gap-2 justify-end border-t border-slate-200">
              {selectedJob.status === 'Pending' && (
                <button onClick={() => handleStatusChange(selectedJob.id, 'In Progress')} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                  เริ่มดำเนินการ
                </button>
              )}
              {selectedJob.status === 'In Progress' && (
                <button onClick={() => handleStatusChange(selectedJob.id, 'Completed')} className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                  เสร็จสิ้น (รอส่งมอบ)
                </button>
              )}
              {selectedJob.status === 'Completed' && (
                <button onClick={() => handleStatusChange(selectedJob.id, 'Delivered')} className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700">
                  ส่งมอบเรียบร้อย
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
