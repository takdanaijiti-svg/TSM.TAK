import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEquipment } from '../contexts/EquipmentContext';
import { useJobs } from '../contexts/JobContext';
import { useSettings } from '../contexts/SettingsContext';
import { Package, CheckCircle, AlertTriangle, Clock, ChevronRight, Printer, PenTool, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { isPast, parseISO } from 'date-fns';
import QRCode from 'react-qr-code';

export function Dashboard() {
  const { user } = useAuth();
  const { equipment, orders } = useEquipment();
  const { jobs } = useJobs();
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState<'equipment' | 'jobs'>('equipment');
  const [printingOrder, setPrintingOrder] = useState<any>(null);

  const userOrders = user && user.role === 'Staff' ? orders.filter(o => o.userId === user.id) : orders;
  const recentOrders = userOrders.slice(0, 5);

  const userJobs = user && user.role === 'Staff' ? jobs.filter(j => j.userId === user.id) : jobs;
  const recentJobs = userJobs.slice(0, 5);

  const stats = {
    total: equipment.reduce((sum, eq) => sum + eq.totalUnits, 0),
    available: equipment.reduce((sum, eq) => sum + eq.availableUnits, 0),
    inUse: orders.filter(o => o.status === 'In Use').reduce((sum, o) => sum + o.items.length, 0),
    maintenance: equipment.reduce((sum, eq) => sum + (eq.totalUnits - eq.availableUnits), 0)
  };

  const jobStats = {
    total: jobs.length,
    pending: jobs.filter(j => j.status === 'Pending').length,
    inProgress: jobs.filter(j => j.status === 'In Progress').length,
    completed: jobs.filter(j => j.status === 'Completed').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800';
      case 'Approved': case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'In Use': return 'bg-purple-100 text-purple-800';
      case 'Returned': case 'Delivered': case 'Completed': return 'bg-green-100 text-green-800';
      case 'Dispensed': return 'bg-slate-100 text-slate-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">แดชบอร์ด</h1>
        <p className="text-slate-500 mt-1">{user ? `ยินดีต้อนรับ, ${user.name}` : 'สถิติและการทำงานของเวชนิทัศน์และโสตทัศนศึกษา'}</p>
      </div>

      <div className="flex bg-slate-200/50 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('equipment')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'equipment' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Package size={16} /> อุปกรณ์โสตฯ
        </button>
        <button 
          onClick={() => setActiveTab('jobs')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'jobs' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <PenTool size={16} /> งานผลิต / ออกแบบ
        </button>
      </div>

      {(!user || user?.role !== 'Staff') && activeTab === 'equipment' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="ครุภัณฑ์ทั้งหมด" value={stats.total} icon={<Package size={24} className="text-blue-600" />} bg="bg-blue-50" />
          <StatCard title="พร้อมให้บริการ" value={stats.available} icon={<CheckCircle size={24} className="text-green-600" />} bg="bg-green-50" />
          <StatCard title="กำลังถูกยืม" value={stats.inUse} icon={<Clock size={24} className="text-purple-600" />} bg="bg-purple-50" />
          <StatCard title="รอ/กำลังซ่อม" value={stats.maintenance} icon={<AlertTriangle size={24} className="text-amber-600" />} bg="bg-amber-50" />
        </div>
      )}

      {(!user || user?.role !== 'Staff') && activeTab === 'jobs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="งานทั้งหมด" value={jobStats.total} icon={<LayoutDashboard size={24} className="text-blue-600" />} bg="bg-blue-50" />
          <StatCard title="รอรับงาน" value={jobStats.pending} icon={<Clock size={24} className="text-amber-600" />} bg="bg-amber-50" />
          <StatCard title="กำลังดำเนินการ" value={jobStats.inProgress} icon={<PenTool size={24} className="text-purple-600" />} bg="bg-purple-50" />
          <StatCard title="เสร็จสิ้น/ส่งมอบ" value={jobStats.completed} icon={<CheckCircle size={24} className="text-green-600" />} bg="bg-green-50" />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
             {activeTab === 'equipment' ? 'การเบิกยืมอุปกรณ์ล่าสุด' : 'รายการคำสั่งงานล่าสุด'}
          </h2>
          {user?.role === 'Admin' || user?.role === 'Manager' ? (
            <Link to={activeTab === 'equipment' ? "/kanban" : "/job-kanban"} className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-1">
              จัดการคำขอ <ChevronRight size={16} />
            </Link>
          ) : null}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
              <tr>
                <th className="px-6 py-4">{activeTab === 'equipment' ? 'ผู้ขอ' : 'ผู้สั่งงาน'}</th>
                <th className="px-6 py-4">รายการ</th>
                <th className="px-6 py-4">{activeTab === 'equipment' ? 'วันที่รับอุปกรณ์' : 'วันที่ต้องการงาน'}</th>
                <th className="px-6 py-4">สถานะ</th>
                {activeTab === 'jobs' && <th className="px-6 py-4">หมายเหตุ</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeTab === 'equipment' ? (
                recentOrders.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">ยังไม่มีความเคลื่อนไหว</td></tr>
                ) : recentOrders.map((order, i) => {
                    const isOverdue = order.expectedReturnDate && order.status === 'In Use' && isPast(parseISO(order.expectedReturnDate));
                    return (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        key={order.id} className={`hover:bg-slate-50 transition-colors ${isOverdue ? 'bg-red-50/50' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{order.userName}</div>
                          <div className="text-xs text-slate-500">{order.userDepartment}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-700">
                            {order.items.map(item => `${item.equipment.name} (${item.quantity})`).join(', ')}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{new Date(order.pickupDate).toLocaleDateString('th-TH')}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          {isOverdue && <span className="ml-2 text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded uppercase">Overdue</span>}
                          {user && (
                            <button onClick={() => setPrintingOrder(order)} className="ml-3 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="พิมพ์ใบเบิก/ยืม">
                              <Printer size={16} />
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    );
                })
              ) : (
                recentJobs.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">ยังไม่มีรายการสั่งงาน</td></tr>
                ) : recentJobs.map((job, i) => (
                    <motion.tr 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        key={job.id} className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{job.userName}</div>
                          <div className="text-xs text-slate-500">{job.userDepartment}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-800">{job.subType}</div>
                          <div className="text-xs text-slate-500 truncate max-w-[200px]">{job.topic}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{new Date(job.dueDate).toLocaleDateString('th-TH')}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 text-xs max-w-[200px]">
                           {job.deliveryNote ? <div className="truncate">{job.deliveryNote}</div> : '-'}
                           {job.completedAttachment && (
                             <a href={job.completedAttachment} target="_blank" rel="noreferrer" className="text-green-600 hover:underline block mt-1">ไฟล์งานเสร็จสิ้น</a>
                           )}
                        </td>
                      </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {printingOrder && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4"
            onClick={() => setPrintingOrder(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white p-6 max-w-sm w-full mx-auto font-mono text-sm relative shadow-2xl"
              style={{ borderTop: '8px solid #f8fafc', borderBottom: '4px dashed #cbd5e1' }}
            >
              <div className="text-center mb-6 border-b border-dashed border-slate-300 pb-4">
                <h2 className="font-bold text-lg">{settings.hospitalName}</h2>
                <p>{settings.appName}</p>
                <p className="mt-2 text-xs">ใบเบิก/ยืมอุปกรณ์</p>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between"><span>รหัส:</span> <span>#{printingOrder.id.toUpperCase()}</span></div>
                <div className="flex justify-between"><span>วันที่:</span> <span>{new Date(printingOrder.requestDate).toLocaleDateString('th-TH')}</span></div>
                <div className="flex justify-between"><span>ผู้ขอ:</span> <span>{printingOrder.userName}</span></div>
                <div className="flex justify-between"><span>แผนก:</span> <span>{printingOrder.userDepartment}</span></div>
              </div>
              <div className="border-b border-dashed border-slate-300 pb-4 mb-4">
                <div className="font-bold mb-2">รายการ:</div>
                {printingOrder.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between mb-1">
                    <span className="truncate pr-2">- {item.equipment.name}</span>
                    <span>x{item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center mt-6 pt-4 border-t border-slate-200">
                 <div className="bg-white p-2 border border-slate-200 rounded-lg mb-2">
                   <QRCode value={`https://taksin.hospital/verify/${printingOrder.id}`} size={96} />
                 </div>
                 <p className="text-[10px] text-slate-400">สแกนเพื่อตรวจสอบสถานะ</p>
              </div>
              <button onClick={() => setPrintingOrder(null)} className="absolute top-2 right-2 p-2 text-slate-400 hover:text-slate-600">×</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ title, value, icon, bg }: { title: string, value: number, icon: React.ReactNode, bg: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${bg}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 leading-none">{value}</h3>
      </div>
    </div>
  );
}
