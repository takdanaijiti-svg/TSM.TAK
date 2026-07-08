import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useEquipment } from '../contexts/EquipmentContext';
import { Trash2, ShoppingBag, ArrowRight, Calendar, FileText, CheckSquare, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, itemCount } = useCart();
  const { createOrder } = useEquipment();
  const navigate = useNavigate();

  // Form State
  const [pickupDate, setPickupDate] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [note, setNote] = useState('');
  const [agreed, setAgreed] = useState(false);

  const hasLoanable = cart.some(item => item.equipment.type === 'Loanable');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    if (!pickupDate) return alert('กรุณาระบุวันที่ต้องการรับของ');
    if (hasLoanable && !expectedReturnDate) return alert('กรุณาระบุวันที่คาดว่าจะคืนสำหรับรายการยืม');
    if (!agreed) return alert('กรุณายอมรับเงื่อนไขความรับผิดชอบ');

    createOrder(cart, hasLoanable ? expectedReturnDate : undefined, note, pickupDate);
    clearCart();
    navigate('/dashboard');
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">ตะกร้าว่างเปล่า</h2>
        <p className="text-slate-500 mb-8">คุณยังไม่ได้เลือกรายการใดๆ ลงในตะกร้า</p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors"
        >
          กลับไปเลือกอุปกรณ์
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">ยืนยันรายการเบิก/ยืม</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center justify-between">
              <span>รายการทั้งหมด ({itemCount} ชิ้น)</span>
              <button 
                onClick={clearCart}
                className="text-sm text-red-500 hover:text-red-700 font-medium px-3 py-1 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                ล้างตะกร้า
              </button>
            </h2>
            
            <div className="space-y-4">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    key={item.equipmentId}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-slate-100 last:border-0"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${item.equipment.type === 'Loanable' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                          {item.equipment.type === 'Loanable' ? 'ยืม-คืน' : 'เบิกจ่าย'}
                        </span>
                        <span className="text-xs text-slate-500">{item.equipment.category}</span>
                      </div>
                      <h3 className="font-semibold text-slate-800">{item.equipment.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">คงเหลือในคลัง: {item.equipment.availableUnits}</p>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-auto">
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.equipmentId, item.quantity - 1)}
                          className="px-3 py-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center font-medium text-slate-800">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.equipmentId, item.quantity + 1)}
                          className="px-3 py-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.equipmentId)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <FileText size={20} className="text-green-600" />
              รายละเอียดคำขอ
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <Calendar size={14} /> วันที่ต้องการรับของ <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date"
                  value={pickupDate}
                  onChange={e => setPickupDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  required
                />
              </div>

              {hasLoanable && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <Calendar size={14} /> วันที่คาดว่าจะคืน <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date"
                    value={expectedReturnDate}
                    onChange={e => setExpectedReturnDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    required
                  />
                  <p className="text-[10px] text-slate-500">*คุณมีรายการประเภทยืม-คืนในตะกร้า</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">หมายเหตุ / ชื่องาน</label>
                <textarea 
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm min-h-[80px] resize-none"
                  placeholder="เช่น ใช้สำหรับงานประชุมประจำเดือน..."
                />
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={agreed}
                      onChange={e => setAgreed(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-green-600 peer-checked:border-green-600 transition-colors"></div>
                    <CheckSquare size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-xs text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">
                    ข้าพเจ้ายอมรับเงื่อนไขความรับผิดชอบ และจะดูแลรักษาอุปกรณ์ให้คงสภาพเดิม หากเกิดความเสียหาย ข้าพเจ้ายินดีรับผิดชอบตามระเบียบของโรงพยาบาล <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>

              <button 
                type="submit"
                disabled={!agreed}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                ยืนยันคำขอ
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
