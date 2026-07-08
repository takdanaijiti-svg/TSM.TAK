import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJobs } from '../contexts/JobContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { JobCategory } from '../types';
import { Upload, X, CheckCircle2, ChevronRight, Image as ImageIcon, Briefcase, Plus, Type, Layers } from 'lucide-react';

const CATEGORIES: Record<JobCategory, string[]> = {
  'ผลิตป้าย': [
    'ป้ายสติ๊กเกอร์', 'ป้ายฟิวเจอร์บอร์ด', 'ป้ายไวนิล', 'ป้ายอะคริลิค',
    'ป้ายโฟม', 'ป้ายพลาสวูด', 'ป้ายผ้า', 'ป้ายชื่อตั้งโต๊ะ (วิทยากร/ประชุม)', 'ป้ายกระดาษ'
  ],
  'Computer Graphic': [
    'ออกแบบป้าย', 'ออกแบบไวนิล', 'ออกแบบปกรายงาน', 'ออกแบบแผ่นพับ',
    'ออกแบบภาพพลิก', 'ออกแบบโลโก้', 'ออกแบบโปสเตอร์', 'ออกแบบเกียรติบัตร',
    'ออกแบบสแตนดี้', 'ออกแบบ Banner', 'ออกแบบพื้นหลัง Powerpoint', 'ออกแบบ One Page', 'แต่งภาพ (รีทัช)'
  ],
  'งานอื่นๆ': [
    'งานสติ๊กเกอร์', 'เคลือบบัตรทุกขนาด', 'เคลือบสติ๊กเกอร์ใส', 'ปริ๊นเกียรติบัตร',
    'ปริ๊นรูปภาพ (กระดาษ Photo)', 'ปริ้นแผ่นพับ', 'ปรืนงานทั่วไป', 'บัตรเจ้าหน้าที่',
    'ติดตั้ง ตรวจเช็ค ระบบภาพและเสียง (หน้างาน)', 'พ่นสี', 'ตัดต่อคลิป Present',
    'ติดตั้งอุปกรณ์การประชุม (หน้างาน)', 'บันทึก VDO หน้าจอคอมฯ', 'ออกรหัสลิ้งค์ประชุมออนไลน์',
    'ดาวโหลดไฟล์ (VDO) จากอินเตอร์เนต', 'ดาวโหลดไฟล์ (เสียง) จากอินเตอร์เนต', 'เรียงเนื้อหารายงาน'
  ]
};

export function ServiceRequest() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const { createJob } = useJobs();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<JobCategory | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [formData, setFormData] = useState({
    userName: user?.name || '',
    userDepartment: user?.department || '',
    userPhone: user?.phone || '',
    subType: '',
    topic: '',
    size: '',
    quantity: 1,
    details: '',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
  });

  const [files, setFiles] = useState<File[]>([]);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (user && !formData.userName) {
      setFormData(prev => ({
        ...prev,
        userName: user.name,
        userDepartment: user.department,
        userPhone: user.phone
      }));
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const maxFiles = category === 'งานอื่นๆ' ? 10 : 1;
      
      if (files.length + newFiles.length > maxFiles) {
        alert(`สามารถอัปโหลดได้สูงสุด ${maxFiles} ไฟล์`);
        return;
      }

      const validFiles = newFiles.filter((f: any) => f.size <= 10 * 1024 * 1024);
      if (validFiles.length < newFiles.length) {
        alert('บางไฟล์มีขนาดเกิน 10MB');
      }
      
      setFiles([...files, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const executeSubmit = () => {
    if (!category || !formData.subType) return;

    createJob({
      category,
      userName: formData.userName,
      userDepartment: formData.userDepartment,
      userPhone: formData.userPhone,
      subType: formData.subType,
      topic: formData.topic,
      size: formData.size,
      quantity: formData.quantity,
      details: formData.details,
      dueDate: formData.dueDate,
      attachments: files.map(f => f.name), 
    });
    
    setSuccess(true);
    setShowLoginModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    executeSubmit();
  };

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginForm.email, loginForm.password);
      // Wait for state to update, or just manually call executeSubmit
      // Since login is async but sets context, we can just defer execution
      setTimeout(() => {
        executeSubmit();
      }, 100);
    } catch (err) {
      setLoginError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl text-center border border-slate-100"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">สั่งงานสำเร็จ</h2>
        <p className="text-slate-600 mb-8">คำสั่งงานของคุณถูกส่งไปยังเจ้าหน้าที่แล้ว คุณสามารถติดตามสถานะได้ที่หน้าแดชบอร์ด</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
        >
          ไปที่แดชบอร์ด
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">สั่งทำสื่อ/ป้าย</h1>
        <p className="text-slate-500 mt-2">เลือกประเภทงานที่ต้องการให้กลุ่มงานโสตทัศนศึกษาดำเนินการ</p>
      </div>

      {!user && (
         <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
           <div>
             <h3 className="font-semibold text-amber-800">เข้าสู่ระบบเพื่อสั่งงาน</h3>
             <p className="text-sm text-amber-700">คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถส่งคำสั่งงานได้</p>
           </div>
           <button onClick={() => navigate('/login')} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700">
             เข้าสู่ระบบ
           </button>
         </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Layers className="text-green-600" /> 
              เลือกประเภทงาน
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {(Object.keys(CATEGORIES) as JobCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setFormData({ ...formData, subType: '' });
                    setStep(2);
                  }}
                  className="p-6 text-left border-2 border-slate-100 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group relative"
                >
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                    {cat === 'ผลิตป้าย' && <Briefcase className="text-slate-600 group-hover:text-green-600" />}
                    {cat === 'Computer Graphic' && <ImageIcon className="text-slate-600 group-hover:text-green-600" />}
                    {cat === 'งานอื่นๆ' && <Type className="text-slate-600 group-hover:text-green-600" />}
                  </div>
                  <h3 className="font-bold text-slate-800">{cat}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {cat === 'ผลิตป้าย' && 'เน้นงาน "ผลิต" เป็นหลัก ไม่รวมกับงานออกแบบ'}
                    {cat === 'Computer Graphic' && 'เน้นงาน "ออกแบบ" เป็นหลัก ไม่รวมกับงานผลิต'}
                    {cat === 'งานอื่นๆ' && 'งานบริการอื่นๆ ทั่วไป'}
                  </p>
                  <ChevronRight size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-green-500" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && category && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-6">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
              <button onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-800 text-sm font-medium">
                กลับ
              </button>
              <h2 className="text-lg font-bold text-slate-800">รายละเอียดงาน: {category}</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-slate-800 mb-2">ข้อมูลผู้สั่งงาน</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อ-นามสกุล *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.userName}
                    onChange={e => setFormData({ ...formData, userName: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">หน่วยงาน *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.userDepartment}
                    onChange={e => setFormData({ ...formData, userDepartment: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">เบอร์โทรศัพท์ *</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.userPhone}
                    onChange={e => setFormData({ ...formData, userPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">ประเภทงานย่อย *</label>
                  <select 
                    required
                    value={formData.subType}
                    onChange={e => setFormData({ ...formData, subType: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">เลือกงาน</option>
                    {CATEGORIES[category].map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">เรื่อง / ข้อความ *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.topic}
                    onChange={e => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
                    placeholder="เช่น ป้ายงานประชุมวิชาการ"
                  />
                </div>

                {category !== 'งานอื่นๆ' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">ขนาด</label>
                    <input 
                      type="text" 
                      value={formData.size}
                      onChange={e => setFormData({ ...formData, size: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
                      placeholder="กว้าง x ยาว (เช่น 1x2 เมตร)"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">จำนวน *</label>
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">วันที่ต้องการรับงาน *</label>
                  <input 
                    type="date" 
                    required
                    value={formData.dueDate}
                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  ข้อความ / รายละเอียดเพิ่มเติม
                </label>
                <textarea 
                  rows={3}
                  value={formData.details}
                  onChange={e => setFormData({ ...formData, details: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
                  placeholder="ใส่คำอธิบายหรือแจ้งรายละเอียดของงานเพิ่มเติม..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  แนบไฟล์ตัวอย่าง
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  (แบบที่ต้องการ, ป้ายเดิม/ป้ายเก่า, ตำแหน่ง/สถานที่/พื้นผิวที่ต้องการติดป้าย ฯลฯ)<br/>
                  อัปโหลดไฟล์ที่รองรับสูงสุด {category === 'งานอื่นๆ' ? '10' : '1'} รายการ ขนาดสูงสุด 10 MB ต่อไฟล์
                </p>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-slate-400" />
                      <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">คลิกเพื่ออัปโหลด</span> หรือลากไฟล์มาวาง</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      multiple={category === 'งานอื่นๆ'}
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
                        <span className="text-sm text-slate-600 truncate max-w-[80%]">{file.name}</span>
                        <button type="button" onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700 p-1">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setStep(1)} className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-medium">
                  ย้อนกลับ
                </button>
                <button 
                  type="submit" 
                  disabled={!user}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus size={18} />
                  ยืนยันการสั่งงาน
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800">เข้าสู่ระบบเพื่อยืนยันการสั่งงาน</h3>
                <button onClick={() => setShowLoginModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <form onSubmit={handleInlineLogin} className="space-y-4">
                  {loginError && (
                    <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                      {loginError}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">อีเมล</label>
                    <input 
                      type="email" 
                      required
                      value={loginForm.email}
                      onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">รหัสผ่าน</label>
                    <input 
                      type="password" 
                      required
                      value={loginForm.password}
                      onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700">
                    เข้าสู่ระบบ
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
