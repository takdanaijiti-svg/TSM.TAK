import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEquipment } from '../contexts/EquipmentContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Equipment } from '../types';
import { Search, Plus, Filter, LayoutGrid, List, Package } from 'lucide-react';
import { motion } from 'framer-motion';

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

export function Home() {
  const { equipment } = useEquipment();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredEquipment = equipment.filter(eq => {
    const matchesSearch = eq.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          eq.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' ? true : eq.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleAddToCart = (item: Equipment) => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(item, 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">รายการอุปกรณ์</h1>
          <p className="text-slate-500 mt-1">เรียกดูและเลือกอุปกรณ์หรือวัสดุสิ้นเปลืองที่ต้องการเบิก/ยืม</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="ค้นหาอุปกรณ์..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full md:w-64"
            />
          </div>
          
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="All">ทุกประเภท</option>
            <option value="Loanable">ยืม-คืน (Loanable)</option>
            <option value="Consumable">วัสดุสิ้นเปลือง (Consumable)</option>
          </select>

          <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {filteredEquipment.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <Package className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-900">ไม่พบรายการอุปกรณ์</h3>
          <p className="text-slate-500">ลองเปลี่ยนคำค้นหาหรือตัวกรองประเภท</p>
        </div>
      ) : (
        <motion.div 
          layout
          className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {filteredEquipment.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={item.id}
              className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex ${viewMode === 'list' ? 'flex-row items-center p-3.5 gap-4' : 'flex-col'}`}
            >
              {viewMode === 'grid' && (
                <div className="h-34 bg-slate-50 border-b border-slate-100 flex items-center justify-center relative overflow-hidden">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-300">
                      <Package size={28} />
                    </div>
                  )}
                </div>
              )}

              {viewMode === 'list' && (
                <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Package size={20} className="text-slate-300" />
                  )}
                </div>
              )}
              
              <div className={`p-4 flex-1 flex ${viewMode === 'list' ? 'flex-row items-center justify-between' : 'flex-col justify-between'}`}>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.type === 'Loanable' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                      {item.type === 'Loanable' ? 'ยืม-คืน' : 'เบิกจ่าย'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getCategoryBadgeStyle(item.category)}`}>{item.category}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 leading-tight mb-1 text-sm">{item.name}</h3>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${item.status === 'Available' ? 'bg-green-500' : item.status === 'Low Stock' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                      <span className="text-xs font-semibold text-slate-600">{item.availableUnits} / {item.totalUnits} ชิ้น</span>
                    </div>
                  </div>
                </div>

                <div className={viewMode === 'grid' ? "mt-3.5" : ""}>
                  <button 
                    onClick={() => handleAddToCart(item)}
                    disabled={item.availableUnits === 0}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
                  >
                    <Plus size={16} />
                    <span>เพิ่มลงตะกร้า</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
