import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
const DraggableComponent = Draggable as any;
import { useEquipment } from '../contexts/EquipmentContext';
import { RequestStatus, RequestOrder } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, Package, ArrowRightLeft, Search, Check, AlertTriangle, X } from 'lucide-react';
import { isPast, parseISO } from 'date-fns';

const COLUMNS: { id: RequestStatus; title: string; icon: React.ReactNode; color: string }[] = [
  { id: 'Pending', title: 'รออนุมัติ', icon: <Clock size={18} />, color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'Approved', title: 'อนุมัติแล้ว/รอรับ', icon: <CheckCircle size={18} />, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'In Use', title: 'กำลังใช้งาน', icon: <Package size={18} />, color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'Returned', title: 'คืนแล้ว/เสร็จสิ้น', icon: <ArrowRightLeft size={18} />, color: 'bg-green-100 text-green-800 border-green-200' },
];

export function KanbanBoard() {
  const { orders, updateOrderStatus, reportMaintenance } = useEquipment();
  const [searchTerm, setSearchTerm] = useState('');
  const [returnChecklistOrder, setReturnChecklistOrder] = useState<RequestOrder | null>(null);

  const filteredOrders = orders.filter(o => 
    o.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.userDepartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.status !== 'Rejected' && o.status !== 'Dispensed' // Hide rejected/dispensed from main kanban
  );

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId as RequestStatus;
    
    if (newStatus === 'Returned') {
      // Open checklist modal instead of immediately changing status
      const order = orders.find(o => o.id === draggableId);
      if (order && order.items.some(i => i.equipment.type === 'Loanable')) {
         setReturnChecklistOrder(order);
         return;
      }
    }

    updateOrderStatus(draggableId, newStatus);
  };

  const handleReturnComplete = (damagedItems: string[], issues: Record<string, string>) => {
    if (!returnChecklistOrder) return;
    
    // Create maintenance records for damaged items
    damagedItems.forEach(eqId => {
       reportMaintenance(eqId, issues[eqId] || 'ชำรุดจากการยืม');
    });

    updateOrderStatus(returnChecklistOrder.id, 'Returned');
    setReturnChecklistOrder(null);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">กระดานจัดการคำขอ (Kanban)</h1>
          <p className="text-slate-500 mt-1">ลากและวางเพื่อเปลี่ยนสถานะคำขอเบิก/ยืม</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อ, หน่วยงาน..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
          />
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full min-h-[600px] min-w-[1000px]">
            {COLUMNS.map(col => {
              const columnOrders = filteredOrders.filter(o => o.status === col.id);
              
              return (
                <div key={col.id} className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col">
                  <div className={`p-4 border-b flex items-center justify-between rounded-t-2xl ${col.color}`}>
                    <div className="flex items-center gap-2 font-bold">
                      {col.icon}
                      {col.title}
                    </div>
                    <span className="bg-white/50 text-slate-900 px-2.5 py-0.5 rounded-full text-xs font-bold">
                      {columnOrders.length}
                    </span>
                  </div>
                  
                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef} 
                        {...provided.droppableProps}
                        className={`flex-1 p-4 space-y-4 overflow-y-auto ${snapshot.isDraggingOver ? 'bg-slate-100/50' : ''}`}
                      >
                        {columnOrders.map((order, index) => (
                          <DraggableComponent key={order.id} draggableId={order.id} index={index}>
                            {(provided: any, snapshot: any) => {
                               const isOverdue = order.expectedReturnDate && order.status === 'In Use' && isPast(parseISO(order.expectedReturnDate));
                               
                               return (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-white p-4 rounded-xl shadow-sm border ${isOverdue ? 'border-red-300 ring-1 ring-red-500' : 'border-slate-200'} ${snapshot.isDragging ? 'shadow-lg ring-2 ring-green-500 rotate-2' : 'hover:shadow-md'} transition-shadow`}
                                >
                                  <div className="flex justify-between items-start mb-3">
                                    <div>
                                      <h4 className="font-bold text-slate-900">{order.userName}</h4>
                                      <p className="text-xs text-slate-500">{order.userDepartment}</p>
                                    </div>
                                    {isOverdue && (
                                      <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded uppercase">Overdue</span>
                                    )}
                                  </div>
                                  
                                  <div className="space-y-2 mb-3">
                                    {order.items.map((item, i) => (
                                      <div key={i} className="text-sm text-slate-700 flex justify-between bg-slate-50 p-2 rounded">
                                        <span className="truncate pr-2">{item.equipment.name}</span>
                                        <span className="font-medium whitespace-nowrap">x{item.quantity}</span>
                                      </div>
                                    ))}
                                  </div>
                                  
                                  <div className="text-xs text-slate-500 flex justify-between items-center pt-2 border-t border-slate-100">
                                    <span>รับ: {new Date(order.pickupDate).toLocaleDateString('th-TH')}</span>
                                    {order.expectedReturnDate && (
                                      <span className={isOverdue ? 'text-red-600 font-bold' : ''}>
                                        คืน: {new Date(order.expectedReturnDate).toLocaleDateString('th-TH')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                               )
                            }}
                          </DraggableComponent>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {/* Return Checklist Modal */}
      <AnimatePresence>
        {returnChecklistOrder && (
          <ReturnChecklistModal 
            order={returnChecklistOrder}
            onClose={() => setReturnChecklistOrder(null)}
            onConfirm={handleReturnComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ReturnChecklistModal({ order, onClose, onConfirm }: { order: RequestOrder, onClose: () => void, onConfirm: (damaged: string[], issues: Record<string, string>) => void }) {
  const [damagedItems, setDamagedItems] = useState<string[]>([]);
  const [issues, setIssues] = useState<Record<string, string>>({});

  const loanableItems = order.items.filter(i => i.equipment.type === 'Loanable');

  const toggleDamaged = (id: string) => {
    setDamagedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleConfirm = () => {
    onConfirm(damagedItems, issues);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-green-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle className="text-green-600" />
            ตรวจสอบสภาพอุปกรณ์คืน
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100/50">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <p className="text-sm text-slate-600">กรุณาตรวจสอบสภาพอุปกรณ์ก่อนรับคืนเข้าคลัง หากมีอุปกรณ์ชำรุด ให้เลือกที่กล่องข้อความเพื่อแจ้งซ่อมทันที</p>
          
          <div className="space-y-4">
            {loanableItems.map(item => {
              const isDamaged = damagedItems.includes(item.equipmentId);
              return (
                <div key={item.equipmentId} className={`p-4 rounded-xl border ${isDamaged ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white'} transition-colors`}>
                  <div className="flex items-start gap-4">
                    <button 
                      onClick={() => toggleDamaged(item.equipmentId)}
                      className={`mt-1 flex-shrink-0 w-6 h-6 rounded border flex items-center justify-center transition-colors ${isDamaged ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300 text-transparent hover:border-slate-400'}`}
                    >
                      <AlertTriangle size={14} />
                    </button>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">{item.equipment.name}</h4>
                      <p className="text-xs text-slate-500 mb-2">จำนวนคืน: {item.quantity}</p>
                      
                      {isDamaged && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                          <input 
                            type="text" 
                            placeholder="ระบุอาการชำรุด..."
                            value={issues[item.equipmentId] || ''}
                            onChange={e => setIssues({ ...issues, [item.equipmentId]: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors"
          >
            ยกเลิก
          </button>
          <button 
            onClick={handleConfirm}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
          >
            <Check size={18} />
            ยืนยันการรับคืน
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
