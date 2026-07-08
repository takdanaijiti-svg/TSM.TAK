import React, { useState } from 'react';
import { useEquipment } from '../contexts/EquipmentContext';
import { Wrench, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export function Maintenance() {
  const { maintenance, completeMaintenance } = useEquipment();
  const [filter, setFilter] = useState<'All' | 'In Progress' | 'Completed'>('All');

  const filtered = maintenance.filter(m => filter === 'All' ? true : m.status === filter);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">ระบบแจ้งซ่อม</h1>
          <p className="text-slate-500 mt-1">ประวัติและการจัดการอุปกรณ์ที่ชำรุด</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setFilter('All')}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${filter === 'All' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            ทั้งหมด
          </button>
          <button 
            onClick={() => setFilter('In Progress')}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${filter === 'In Progress' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            กำลังซ่อม
          </button>
          <button 
            onClick={() => setFilter('Completed')}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${filter === 'Completed' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            ซ่อมเสร็จแล้ว
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
              <tr>
                <th className="px-6 py-4">วันที่แจ้งซ่อม</th>
                <th className="px-6 py-4">อุปกรณ์</th>
                <th className="px-6 py-4">อาการชำรุด</th>
                <th className="px-6 py-4">ผู้แจ้ง</th>
                <th className="px-6 py-4">สถานะ</th>
                <th className="px-6 py-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <Wrench className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    ไม่มีประวัติการแจ้งซ่อม
                  </td>
                </tr>
              ) : (
                filtered.map((record, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={record.id} 
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(record.reportedDate).toLocaleDateString('th-TH')}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{record.equipmentName}</td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{record.issueDescription}</td>
                    <td className="px-6 py-4 text-slate-600">{record.reportedBy}</td>
                    <td className="px-6 py-4">
                      {record.status === 'In Progress' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                          <Clock size={12} />
                          กำลังซ่อม
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          <CheckCircle size={12} />
                          เสร็จสิ้น
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {record.status === 'In Progress' && (
                        <button 
                          onClick={() => completeMaintenance(record.id)}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          ปิดงานซ่อม
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
