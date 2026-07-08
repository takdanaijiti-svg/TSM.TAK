import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Save, Image as ImageIcon, Type, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function Settings() {
  const { settings, updateSettings } = useSettings();
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">ตั้งค่าระบบ</h1>
        <p className="text-slate-500 mt-1">ปรับแต่งข้อมูลทั่วไปของแอปพลิเคชัน</p>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1">
              <Building2 size={16} className="text-slate-400" />
              ชื่อหน่วยงานหลัก (Hospital Name)
            </label>
            <input 
              type="text" 
              value={formData.hospitalName}
              onChange={e => setFormData({ ...formData, hospitalName: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1">
              <Type size={16} className="text-slate-400" />
              ชื่อระบบ (App Name)
            </label>
            <input 
              type="text" 
              value={formData.appName}
              onChange={e => setFormData({ ...formData, appName: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1">
              <ImageIcon size={16} className="text-slate-400" />
              โลโก้ (URL รูปภาพ)
            </label>
            <input 
              type="url" 
              value={formData.logoUrl}
              onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              placeholder="https://example.com/logo.png"
            />
            {formData.logoUrl && (
              <div className="mt-3">
                <p className="text-xs text-slate-500 mb-2">ตัวอย่างโลโก้:</p>
                <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center p-2">
                  <img src={formData.logoUrl} alt="Preview" className="max-w-full max-h-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button 
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors shadow-sm"
          >
            <Save size={18} />
            บันทึกการตั้งค่า
          </button>
        </div>
      </motion.form>
    </div>
  );
}
