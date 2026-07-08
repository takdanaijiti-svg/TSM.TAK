import React from 'react';
import { useEquipment } from '../contexts/EquipmentContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, TrendingUp } from 'lucide-react';
import { format, subMonths, isSameMonth, parseISO } from 'date-fns';

export function Analytics() {
  const { orders, equipment } = useEquipment();

  // Mock processing for charts
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    const d = subMonths(new Date(), 5 - i);
    return {
      name: format(d, 'MMM'),
      date: d,
      ยืม: 0,
      เบิก: 0
    };
  });

  orders.forEach(order => {
    const orderDate = parseISO(order.requestDate);
    const monthData = last6Months.find(m => isSameMonth(m.date, orderDate));
    if (monthData) {
      const hasLoanable = order.items.some(i => i.equipment.type === 'Loanable');
      if (hasLoanable) monthData['ยืม'] += 1;
      else monthData['เบิก'] += 1;
    }
  });

  // Most popular equipment
  const eqCount: Record<string, { name: string; count: number }> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!eqCount[item.equipmentId]) {
        eqCount[item.equipmentId] = { name: item.equipment.name, count: 0 };
      }
      eqCount[item.equipmentId].count += item.quantity;
    });
  });
  const topEquipment = Object.values(eqCount).sort((a, b) => b.count - a.count).slice(0, 5);

  const handleExport = () => {
    // Generate simple CSV
    const headers = "ID,User,Department,Date,Status,Items\n";
    const rows = orders.map(o => 
      `"${o.id}","${o.userName}","${o.userDepartment}","${format(parseISO(o.requestDate), 'yyyy-MM-dd')}","${o.status}","${o.items.length} items"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "report.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">รายงานและสถิติ</h1>
          <p className="text-slate-500 mt-1">ข้อมูลเชิงลึกการใช้งานระบบยืม-คืน</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-xl shadow-sm transition-colors"
        >
          <Download size={18} />
          ส่งออก CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <TrendingUp size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">แนวโน้มการทำรายการ 6 เดือนย้อนหลัง</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last6Months} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Line type="monotone" dataKey="ยืม" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="เบิก" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <TrendingUp size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">5 อันดับอุปกรณ์ยอดนิยม</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topEquipment} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12 }} width={120} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" name="จำนวน" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
