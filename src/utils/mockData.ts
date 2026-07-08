import { Equipment, User, RequestOrder, MaintenanceRecord } from '../types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Admin Taksin', email: 'admin@taksin.hospital', role: 'Admin', department: 'IT', phone: '1001' },
  { id: 'u2', name: 'Manager Taksin', email: 'manager@taksin.hospital', role: 'Manager', department: 'Audio-Visual', phone: '1002' },
  { id: 'u3', name: 'Staff Taksin', email: 'staff@taksin.hospital', role: 'Staff', department: 'General', phone: '1003' },
];

export const mockEquipment: Equipment[] = [
  // Hardware/Audio (Loanable)
  { id: 'e1', name: 'โปรเจคเตอร์ (Projector)', category: 'Hardware', type: 'Loanable', totalUnits: 3, availableUnits: 3, status: 'Available' },
  { id: 'e2', name: 'จอรับโปรเจคเตอร์เคลื่อนที่', category: 'Hardware', type: 'Loanable', totalUnits: 2, availableUnits: 2, status: 'Available' },
  { id: 'e3', name: 'โน้ตบุ๊ค (Notebook)', category: 'Hardware', type: 'Loanable', totalUnits: 5, availableUnits: 4, status: 'Available' },
  { id: 'e4', name: 'PC All in One', category: 'Hardware', type: 'Loanable', totalUnits: 2, availableUnits: 2, status: 'Available' },
  { id: 'e5', name: 'ชุดลำโพง', category: 'Audio', type: 'Loanable', totalUnits: 4, availableUnits: 4, status: 'Available' },
  { id: 'e6', name: 'ไมค์ลอย', category: 'Audio', type: 'Loanable', totalUnits: 6, availableUnits: 6, status: 'Available' },
  { id: 'e7', name: 'ไมค์ประชุม (Conference)', category: 'Audio', type: 'Loanable', totalUnits: 2, availableUnits: 2, status: 'Available' },
  
  // Cables/Accessories (Loanable)
  { id: 'e8', name: 'สายสัญญาณ HDMI', category: 'Cables', type: 'Loanable', totalUnits: 10, availableUnits: 10, status: 'Available' },
  { id: 'e9', name: 'Adapter iPad', category: 'Accessories', type: 'Loanable', totalUnits: 3, availableUnits: 3, status: 'Available' },
  { id: 'e10', name: 'ปลั๊กไฟพ่วง', category: 'Accessories', type: 'Loanable', totalUnits: 8, availableUnits: 8, status: 'Available' },
  
  // Office Supply (Consumable)
  { id: 'e11', name: 'กระดาษ A4 ธรรมดา (รีม)', category: 'Office Supply', type: 'Consumable', totalUnits: 100, availableUnits: 100, status: 'Available' },
  { id: 'e12', name: 'ถ่าน AA', category: 'Office Supply', type: 'Consumable', totalUnits: 50, availableUnits: 50, status: 'Available' },
  { id: 'e13', name: 'ถ่าน AAA', category: 'Office Supply', type: 'Consumable', totalUnits: 50, availableUnits: 50, status: 'Available' },
  { id: 'e14', name: 'กระดาษกาวสองหน้าบาง', category: 'Office Supply', type: 'Consumable', totalUnits: 20, availableUnits: 20, status: 'Available' },
  { id: 'e15', name: 'เทปใส', category: 'Office Supply', type: 'Consumable', totalUnits: 30, availableUnits: 30, status: 'Available' },
];

export const mockOrders: RequestOrder[] = [];
export const mockMaintenance: MaintenanceRecord[] = [];

