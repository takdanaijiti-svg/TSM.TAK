import React, { useState } from 'react';
import { useEquipment } from '../contexts/EquipmentContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Package, Plus, Minus, Pencil, Trash2, Wrench, Search, 
  X, HelpCircle, CheckCircle, AlertTriangle, Filter, Edit3, Image
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Equipment, EquipmentType } from '../types';

const CATEGORIES = ['Hardware', 'Audio', 'Cables', 'Accessories', 'Office Supply', 'Camera', 'Lighting'];

const PRESET_EQ_IMAGES = [
  'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80&w=150&h=150', // Projector/TV
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=150&h=150', // Headphones/Audio
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=150&h=150', // Camera
  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=150&h=150', // Office/Notebook
  'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=150&h=150', // Tablet/Accessories
];

function getCategoryBadgeStyle(category: string) {
  switch (category) {
    case 'Hardware':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
    case 'Audio':
      return 'bg-purple-50 text-purple-700 border border-purple-100';
    case 'Cables':
      return 'bg-sky-50 text-sky-700 border border-sky-100';
    case 'Accessories':
      return 'bg-rose-50 text-rose-700 border border-rose-100';
    case 'Office Supply':
      return 'bg-amber-50 text-amber-700 border border-amber-100';
    case 'Camera':
      return 'bg-indigo-50 text-indigo-700 border border-indigo-100';
    case 'Lighting':
      return 'bg-yellow-50 text-yellow-800 border border-yellow-100';
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
}

export function Inventory() {
  const { equipment, addEquipment, updateEquipment, deleteEquipment, reportMaintenance, adjustAvailableQuantity } = useEquipment();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Modals
  const [isEqModalOpen, setIsEqModalOpen] = useState(false);
  const [editingEq, setEditingEq] = useState<Equipment | null>(null);
  
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
  const [repairEq, setRepairEq] = useState<Equipment | null>(null);
  const [repairIssue, setRepairIssue] = useState('');

  const [showImgGuide, setShowImgGuide] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Hardware',
    type: 'Loanable' as EquipmentType,
    totalUnits: 1,
    imageUrl: '',
    description: '',
  });

  const [formError, setFormError] = useState('');

  // Handle Opening Add Modal
  const handleOpenAddModal = () => {
    setEditingEq(null);
    setFormData({
      name: '',
      category: 'Hardware',
      type: 'Loanable',
      totalUnits: 1,
      imageUrl: '',
      description: '',
    });
    setFormError('');
    setIsEqModalOpen(true);
  };

  // Handle Opening Edit Modal
  const handleOpenEditModal = (eq: Equipment) => {
    setEditingEq(eq);
    setFormData({
      name: eq.name,
      category: eq.category,
      type: eq.type,
      totalUnits: eq.totalUnits,
      imageUrl: eq.imageUrl || '',
      description: eq.description || '',
    });
    setFormError('');
    setIsEqModalOpen(true);
  };

  // Handle Opening Repair Modal
  const handleOpenRepairModal = (eq: Equipment) => {
    setRepairEq(eq);
    setRepairIssue('');
    setIsRepairModalOpen(true);
  };

  const handleSaveEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      setFormError('กรุณากรอกข้อมูลชื่ออุปกรณ์และเลือกหมวดหมู่');
      return;
    }

    if (formData.totalUnits < 0) {
      setFormError('จำนวนทั้งหมดต้องไม่ต่ำกว่า 0');
      return;
    }

    if (editingEq) {
      // Calculate availableUnits adjustment
      const diff = formData.totalUnits - editingEq.totalUnits;
      const newAvail = Math.max(0, editingEq.availableUnits + diff);
      
      updateEquipment(editingEq.id, {
        ...formData,
        availableUnits: newAvail
      });
    } else {
      addEquipment(formData);
    }

    setIsEqModalOpen(false);
  };

  const handleReportRepairSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repairEq || !repairIssue.trim()) return;

    reportMaintenance(repairEq.id, repairIssue);
    setIsRepairModalOpen(false);
    alert(`ส่งซ่อมอุปกรณ์ "${repairEq.name}" และหักสต็อกคงเหลือ 1 ชิ้นเรียบร้อยแล้ว สามารถติดตามสถานะได้ที่เมนูแจ้งซ่อม`);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ที่จะลบรายการอุปกรณ์: ${name}? การดำเนินการนี้ไม่สามารถย้อนกลับได้`)) {
      deleteEquipment(id);
    }
  };

  const handleQuickAdjust = (id: string, currentAvail: number, currentTotal: number, delta: number) => {
    if (delta > 0 && currentAvail >= currentTotal) {
      // If user wants to increase availableUnits beyond totalUnits, we ask if they want to increase total units as well
      if (window.confirm('จำนวนที่พร้อมใช้งานไม่สามารถเกินจำนวนทั้งหมดได้ คุณต้องการเพิ่มยอดรวม (Total Units) ด้วยหรือไม่?')) {
        updateEquipment(id, {
          totalUnits: currentTotal + 1,
          availableUnits: currentAvail + 1
        });
      }
      return;
    }
    if (delta < 0 && currentAvail <= 0) return;
    adjustAvailableQuantity(id, delta);
  };

  const filteredEquipment = equipment.filter(eq => {
    const matchesSearch = eq.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          eq.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (eq.description && eq.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' ? true : eq.category === categoryFilter;
    const matchesType = typeFilter === 'All' ? true : eq.type === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">คลังและสต็อกอุปกรณ์</h1>
          <p className="text-slate-500 mt-1">จัดการข้อมูลครุภัณฑ์ วัสดุสิ้นเปลือง และระดับสต็อกคงคลัง (เฉพาะแอดมิน/เจ้าหน้าที่)</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus size={20} />
          <span>เพิ่มอุปกรณ์ใหม่</span>
        </button>
      </div>

      {/* Static Image hosting guide banner */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center shrink-0 border border-green-200">
            <Image size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">💡 เคล็ดลับการใส่รูปภาพอุปกรณ์</h4>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed max-w-2xl">
              หากไม่ได้กรอกที่อยู่รูปภาพในนี้ ระบบจะแสดงรูปไอคอนกล่องสินค้าให้โดยอัตโนมัติ คุณสามารถอัปโหลดภาพไปที่เว็บบริการฝากรูปภาพภายนอกฟรี แล้วนำ "Direct Link" มาวางได้ทันที เพื่อความสวยงามและแสดงผลที่คมชัด
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowImgGuide(true)}
          className="text-xs font-bold text-green-700 hover:text-green-800 bg-white border border-green-200 px-3 py-1.5 rounded-lg shadow-xs shrink-0 self-start md:self-auto"
        >
          อ่านคู่มือวิธีฝากรูป
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="ค้นหาชื่ออุปกรณ์, รายละเอียด หรือหมวดหมู่..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-slate-50/50"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-white text-sm text-slate-700 font-medium"
          >
            <option value="All">ทุกหมวดหมู่</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-white text-sm text-slate-700 font-medium"
          >
            <option value="All">ทุกประเภท</option>
            <option value="Loanable">ยืม-คืน (Loanable)</option>
            <option value="Consumable">เบิกจ่าย (Consumable)</option>
          </select>
        </div>
      </div>

      {/* Stock Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
              <tr>
                <th className="px-6 py-4">รูปภาพ & อุปกรณ์</th>
                <th className="px-6 py-4">หมวดหมู่</th>
                <th className="px-6 py-4">ประเภท</th>
                <th className="px-6 py-4 text-center">สิทธิ์การใช้งาน (พร้อมใช้ / ทั้งหมด)</th>
                <th className="px-6 py-4">สถานะคลัง</th>
                <th className="px-6 py-4 text-right">การจัดการสิทธิ์ & เครื่องมือ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEquipment.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <Package className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    ไม่พบรายการอุปกรณ์ตามเงื่อนไขที่ค้นหา
                  </td>
                </tr>
              ) : (
                filteredEquipment.map((eq, i) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.2) }}
                    key={eq.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    {/* Image & Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {eq.imageUrl ? (
                          <img 
                            src={eq.imageUrl} 
                            alt={eq.name} 
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200 shrink-0">
                            <Package size={20} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 block truncate max-w-xs">{eq.name}</span>
                          {eq.description && (
                            <span className="text-xs text-slate-400 block truncate max-w-xs mt-0.5">{eq.description}</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getCategoryBadgeStyle(eq.category)}`}>
                        {eq.category}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        eq.type === 'Loanable' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'
                      }`}>
                        {eq.type === 'Loanable' ? 'ยืม-คืน' : 'เบิกจ่ายหมดไป'}
                      </span>
                    </td>

                    {/* Available / Total and +/- Controls */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuickAdjust(eq.id, eq.availableUnits, eq.totalUnits, -1)}
                            className="w-7 h-7 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg flex items-center justify-center transition-colors font-bold disabled:opacity-40"
                            title="ลดจำนวนพร้อมใช้ลง 1 ชิ้น"
                            disabled={eq.availableUnits <= 0}
                          >
                            <Minus size={14} />
                          </button>
                          
                          <span className="font-bold text-slate-800 text-sm min-w-[50px] text-center">
                            {eq.availableUnits} / {eq.totalUnits}
                          </span>

                          <button
                            onClick={() => handleQuickAdjust(eq.id, eq.availableUnits, eq.totalUnits, 1)}
                            className="w-7 h-7 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg flex items-center justify-center transition-colors font-bold"
                            title="เพิ่มจำนวนพร้อมใช้ขึ้น 1 ชิ้น"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400">คลิก +/- เพื่อปรับยอดพร้อมใช้ไว</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {eq.status === 'Available' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
                          <CheckCircle size={12} />
                          พร้อมบริการ
                        </span>
                      ) : eq.status === 'Low Stock' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full animate-pulse">
                          <AlertTriangle size={12} />
                          สต็อกเหลือน้อย
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
                          <AlertTriangle size={12} />
                          หมดชั่วคราว
                        </span>
                      )}
                    </td>

                    {/* Action Tools */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {eq.type === 'Loanable' && (
                          <button
                            onClick={() => handleOpenRepairModal(eq)}
                            className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50 px-2 py-1.5 rounded-lg border border-amber-200 transition-colors font-medium shrink-0"
                            title="แจ้งส่งซ่อมบำรุง"
                          >
                            <Wrench size={12} />
                            <span>แจ้งซ่อม</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenEditModal(eq)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors"
                          title="แก้ไขข้อมูลหลัก"
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          onClick={() => handleDelete(eq.id, eq.name)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded-lg transition-colors"
                          title="ลบรายการครุภัณฑ์"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Equipment Modal */}
      <AnimatePresence>
        {isEqModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                <h3 className="font-bold text-lg text-slate-800">
                  {editingEq ? '🔧 แก้ไขข้อมูลอุปกรณ์' : '📦 เพิ่มอุปกรณ์ใหม่ในคลัง'}
                </h3>
                <button 
                  onClick={() => setIsEqModalOpen(false)} 
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4">
                {formError && (
                  <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSaveEquipment} id="equipment-form" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">ชื่ออุปกรณ์ / รายการ *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
                      placeholder="เช่น กล้อง DSLR Sony Alpha 7 IV"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">หมวดหมู่ *</label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-white"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">ประเภทการใช้งาน *</label>
                      <select
                        value={formData.type}
                        onChange={e => setFormData({ ...formData, type: e.target.value as EquipmentType })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-white"
                      >
                        <option value="Loanable">ยืม-คืน (ครุภัณฑ์)</option>
                        <option value="Consumable">เบิกจ่าย (วัสดุหมดไป/สิ้นเปลือง)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">จำนวนทั้งหมดในคลัง (ยอดรวม) *</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={formData.totalUnits}
                        onChange={e => setFormData({ ...formData, totalUnits: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">ที่อยู่ลิงก์รูปภาพ (Image URL)</label>
                      <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 text-xs font-mono"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>

                  {/* Preset Images Quick Select */}
                  <div>
                    <span className="block text-xs font-medium text-slate-500 mb-2">หรือคลิกเลือกรูปภาพสต็อกแนะนำด่วน:</span>
                    <div className="flex gap-2 flex-wrap">
                      {PRESET_EQ_IMAGES.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData({ ...formData, imageUrl: imgUrl })}
                          className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                            formData.imageUrl === imgUrl ? 'border-green-600 ring-2 ring-green-100 scale-105' : 'border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <img src={imgUrl} alt="Preset Eq" className="w-full h-full object-cover" />
                        </button>
                      ))}
                      {formData.imageUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, imageUrl: '' })}
                          className="text-[10px] text-red-500 hover:text-red-600 font-semibold px-2 border border-red-100 rounded-lg hover:bg-red-50"
                        >
                          ล้างรูป
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">รายละเอียด / สเปกอุปกรณ์</label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 text-sm"
                      rows={3}
                      placeholder="เช่น ขาตั้งคาร์บอนไฟเบอร์ สูงสูงสุด 170 ซม. รับน้ำหนักได้ 5 กก."
                    />
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEqModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  form="equipment-form"
                  className="px-5 py-2 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
                >
                  บันทึกข้อมูล
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Report Repair Maintenance Modal */}
      <AnimatePresence>
        {isRepairModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                  <Wrench size={18} className="text-amber-600" />
                  <span>แจ้งส่งซ่อมครุภัณฑ์</span>
                </h3>
                <button 
                  onClick={() => setIsRepairModalOpen(false)} 
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600">
                  ส่งซ่อมครุภัณฑ์ <strong className="text-slate-950">"{repairEq?.name}"</strong> 
                  จะลดจำนวนพร้อมใช้งานจริงลง 1 ชิ้นเพื่อส่งไปยังฝ่ายช่างซ่อมบำรุง
                </p>

                <form onSubmit={handleReportRepairSubmit} id="repair-form" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">ระบุอาการชำรุด / ปัญหาบกพร่อง *</label>
                    <textarea
                      required
                      value={repairIssue}
                      onChange={e => setRepairIssue(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 text-sm"
                      rows={4}
                      placeholder="เช่น ขาตั้งยึดไม่อยู่ล็อกหลวม, ปุ่มเปิดปิดกล้องกดไม่ติด, เลนส์โฟกัสมีเสียงฝืด..."
                    />
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setIsRepairModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  form="repair-form"
                  className="px-5 py-2 bg-amber-600 text-white font-medium rounded-xl hover:bg-amber-700 transition-colors"
                >
                  ยืนยันการส่งซ่อม
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Informational Image Guide Modal */}
      <AnimatePresence>
        {showImgGuide && (
          <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-lg text-slate-800">
                  📁 คู่มือการฝากไฟล์รูปภายนอก (Hosting Guide)
                </h3>
                <button 
                  onClick={() => setShowImgGuide(false)} 
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4 text-sm text-slate-600 leading-relaxed">
                <p>
                  เนื่องจากแอปพลิเคชันนี้ทำงานบนฐานข้อมูลจำลองและเก็บข้อมูลบนเบราว์เซอร์ชั่วคราว การนำรูปภาพของคุณมาใช้งาน สามารถทำได้หลากหลายวิธีดังนี้:
                </p>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-800 block mb-1">1. ใช้ผู้ให้บริการฝากรูปฟรี (Recommended)</span>
                    <p className="text-xs text-slate-500">
                      คุณสามารถเข้าไปที่เว็บฝากรูป เช่น <strong>Postimages.org</strong>, <strong>Imgbb.com</strong> หรือ <strong>Imgur.com</strong> แล้วอัปโหลดรูปภาพของคุณ 
                      จากนั้นเลือกคัดลอกลิงก์ประเภท <strong>"Direct Link (ลิงก์ตรง)"</strong> ที่ลงท้ายด้วยนามสกุลไฟล์ เช่น <code>.jpg</code> หรือ <code>.png</code> มาใส่ในช่อง Image URL
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-800 block mb-1">2. ดึงจากคลังรูปภาพออนไลน์ของแผนก (Intranet / Cloud)</span>
                    <p className="text-xs text-slate-500">
                      หากทางกลุ่มงานโสตฯ หรือโรงพยาบาลมีเซิร์ฟเวอร์เก็บข้อมูลกลาง หรือเว็บแผนกอยู่แล้ว สามารถนำ URL ของรูปภาพจากเว็บไซต์โรงพยาบาลมาใช้ได้โดยตรง
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-800 block mb-1">3. ค้นหารูปสต็อก Unsplash / Google Images</span>
                    <p className="text-xs text-slate-500">
                      ค้นหาภาพอุปกรณ์ที่ใกล้เคียงใน Google หรือ Unsplash คลิกขวาแล้วเลือก <strong>"คัดลอกที่อยู่รูปภาพ (Copy Image Address)"</strong> เพื่อนำมาใช้งานได้เลยทันที
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50 text-right">
                <button
                  onClick={() => setShowImgGuide(false)}
                  className="px-5 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
                >
                  เข้าใจแล้ว
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
