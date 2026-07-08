import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, Mail, Phone, Building, Plus, Pencil, Trash2, X, Search, Info, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Role } from '../types';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150&h=150', // Female Doctor 1
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150&h=150', // Male Doctor 1
  'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=150&h=150', // Female Doctor 2
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150&h=150', // Male Doctor 2
  'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=150&h=150', // Female Staff
  'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=150&h=150', // Male Staff
];

export function StaffDirectory() {
  const { user: currentUser, users, addUser, deleteUser, updateUser } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<User | null>(null);
  const [showImageGuide, setShowImageGuide] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Staff' as Role,
    department: '',
    phone: '',
    imageUrl: '',
  });

  const [formError, setFormError] = useState('');

  const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Manager';

  const handleOpenAddModal = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      email: '',
      role: 'Staff',
      department: '',
      phone: '',
      imageUrl: '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (staff: User) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      role: staff.role,
      department: staff.department,
      phone: staff.phone,
      imageUrl: staff.imageUrl || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDeleteStaff = (id: string, name: string) => {
    if (id === currentUser?.id) {
      alert('คุณไม่สามารถลบบัญชีของตัวเองที่กำลังใช้งานอยู่ได้');
      return;
    }
    if (window.confirm(`คุณแน่ใจหรือไม่ที่จะลบรายชื่อบุคลากร: ${name}?`)) {
      deleteUser(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.department || !formData.phone) {
      setFormError('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    // Basic email validation
    if (!formData.email.includes('@')) {
      setFormError('รูปแบบอีเมลไม่ถูกต้อง');
      return;
    }

    if (editingStaff) {
      updateUser(editingStaff.id, formData);
    } else {
      // Check for duplicate email
      if (users.some(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
        setFormError('อีเมลนี้ถูกใช้งานในระบบแล้ว');
        return;
      }
      addUser(formData);
    }

    setIsModalOpen(false);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);
    
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">ทำเนียบบุคลากร</h1>
          <p className="text-slate-500 mt-1">รายชื่อ ข้อมูลติดต่อ และการจัดการสิทธิ์บุคลากรภายในโรงพยาบาล</p>
        </div>

        {isAuthorized && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors shadow-sm self-start sm:self-auto"
          >
            <Plus size={20} />
            <span>เพิ่มบุคลากร</span>
          </button>
        )}
      </div>

      {/* Info Notice about preset credentials */}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3 text-sm text-blue-800">
        <Info size={20} className="shrink-0 text-blue-600 mt-0.5" />
        <div>
          <span className="font-semibold">ข้อมูลการเข้าสู่ระบบ:</span> บุคลากรแต่ละสิทธิ์ใช้รหัสผ่านดังนี้ในการเข้าสู่ระบบ:
          <ul className="list-disc pl-5 mt-1.5 space-y-1 text-xs">
            <li><strong>Admin</strong>: <code className="bg-blue-100 px-1 py-0.5 rounded">TaksinAdmin2026</code></li>
            <li><strong>Manager</strong>: <code className="bg-blue-100 px-1 py-0.5 rounded">TaksinManager3000</code></li>
            <li><strong>Staff</strong>: <code className="bg-blue-100 px-1 py-0.5 rounded">TaksinStaff111</code></li>
          </ul>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="ค้นหาด้วยชื่อ, อีเมล, แผนก หรือเบอร์ติดต่อ..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm"
          />
        </div>
        <div>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm font-medium text-slate-700"
          >
            <option value="all">ทุกบทบาทสิทธิ์</option>
            <option value="Admin">Admin (ผู้ดูแลระบบ)</option>
            <option value="Manager">Manager (หัวหน้างาน)</option>
            <option value="Staff">Staff (เจ้าหน้าที่)</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((u, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.05, 0.3) }}
              key={u.id} 
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden flex flex-col group"
            >
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                  u.role === 'Admin' ? 'bg-red-100 text-red-700' : 
                  u.role === 'Manager' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {u.role}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                {u.imageUrl ? (
                  <img 
                    src={u.imageUrl} 
                    alt={u.name} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 shadow-sm shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-16 h-16 bg-green-50 text-green-700 rounded-full flex items-center justify-center font-bold text-xl border border-green-100 shrink-0 shadow-inner">
                    {u.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-slate-900 leading-tight truncate">{u.name}</h3>
                  <p className="text-sm text-green-600 font-semibold truncate flex items-center gap-1">
                    <Building size={14} />
                    <span>{u.department}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 flex-1">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                    <Mail size={16} />
                  </div>
                  <span className="truncate">{u.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                    <Phone size={16} />
                  </div>
                  <span>เบอร์ติดต่อ: {u.phone}</span>
                </div>
              </div>

              {/* Action Buttons for Authorized Admin/Managers */}
              {isAuthorized && (
                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEditModal(u)}
                    className="p-1.5 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="แก้ไขข้อมูล"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteStaff(u.id, u.name)}
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="ลบออก"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 font-medium">ไม่พบข้อมูลบุคลากรตามเงื่อนไขที่ค้นหา</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                <h3 className="font-bold text-lg text-slate-800">
                  {editingStaff ? 'แก้ไขข้อมูลบุคลากร' : 'เพิ่มบุคลากรใหม่'}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)} 
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

                <form onSubmit={handleSubmit} id="staff-form" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อ-นามสกุล *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
                        placeholder="เช่น ดร.สมชาย ใจดี"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">อีเมลผู้ใช้งาน *</label>
                      <input
                        type="email"
                        required
                        disabled={!!editingStaff} // Disable editing email since it is used as login ID
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 disabled:bg-slate-50 disabled:text-slate-400"
                        placeholder="เช่น somchai@taksin.hospital"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">กลุ่มงาน / แผนก *</label>
                      <input
                        type="text"
                        required
                        value={formData.department}
                        onChange={e => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
                        placeholder="เช่น เวชนิทัศน์, โสตทัศนศึกษา"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">เบอร์โทรศัพท์ / สายภายใน *</label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
                        placeholder="เช่น 1004"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">สิทธิ์การใช้งานของบทบาท *</label>
                    <select
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value as Role })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Staff">Staff (เจ้าหน้าที่ทั่วไป)</option>
                      <option value="Manager">Manager (หัวหน้างานโสตฯ)</option>
                      <option value="Admin">Admin (ผู้ดูแลระบบหลัก)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-slate-700">ที่อยู่ลิงก์รูปโปรไฟล์ (Image URL)</label>
                      <button
                        type="button"
                        onClick={() => setShowImageGuide(!showImageGuide)}
                        className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1 font-medium"
                      >
                        <HelpCircle size={14} />
                        <span>เพิ่มรูปอย่างไร?</span>
                      </button>
                    </div>

                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 text-xs font-mono"
                      placeholder="เช่น https://domain.com/avatar.jpg"
                    />

                    {/* Image Upload/Hosting Help Box */}
                    {showImageGuide && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-2 mt-2"
                      >
                        <p className="font-semibold text-slate-800">💡 วิธีการนำรูปภาพมาใส่ในระบบ:</p>
                        <ol className="list-decimal pl-4 space-y-1">
                          <li>ใช้ภาพถ่ายจาก <strong>อินทราเน็ตของโรงพยาบาล</strong> หรือระบบบุคลากรที่มี URL อยู่แล้ว</li>
                          <li>ฝากรูปฟรีกับเว็บรับฝากรูป เช่น <strong>Postimages, Imgur, หรือ imgbb</strong> แล้วคัดลอก "ลิงก์ตรง (Direct Link)" ที่ลงท้ายด้วย .jpg/.png</li>
                          <li>ใช้ภาพอวาตาร์ตัวเลือกพิเศษสำเร็จรูปด้านล่างนี้ได้ทันที</li>
                        </ol>
                      </motion.div>
                    )}

                    {/* Presets Grid */}
                    <div className="mt-3">
                      <p className="text-xs font-medium text-slate-500 mb-2">หรือคลิกเลือกอวาตาร์สำเร็จรูป:</p>
                      <div className="flex gap-2 flex-wrap">
                        {PRESET_AVATARS.map((avatar, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setFormData({ ...formData, imageUrl: avatar })}
                            className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                              formData.imageUrl === avatar ? 'border-green-600 ring-2 ring-green-100 scale-105' : 'border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            <img src={avatar} alt="Preset Avatar" className="w-full h-full object-cover" />
                          </button>
                        ))}
                        {formData.imageUrl && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, imageUrl: '' })}
                            className="text-[10px] text-red-500 hover:text-red-600 font-semibold px-2 border border-red-100 rounded-lg hover:bg-red-50"
                          >
                            ล้างรูปภาพ
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  form="staff-form"
                  className="px-5 py-2 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
                >
                  {editingStaff ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

