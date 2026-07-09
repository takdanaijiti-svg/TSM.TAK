import { Equipment, User, RequestOrder, MaintenanceRecord } from '../types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Admin Taksin', email: 'admin@taksin.hospital', role: 'Admin', department: 'IT', phone: '1001' },
  { id: 'u2', name: 'Manager Taksin', email: 'manager@taksin.hospital', role: 'Manager', department: 'Audio-Visual', phone: '1002' },
  { id: 'u3', name: 'Staff Taksin', email: 'staff@taksin.hospital', role: 'Staff', department: 'General', phone: '1003' },
];

export const mockEquipment: Equipment[] = [
  // Hardware/Audio (Loanable)
  { id: 'e1', name: 'โปรเจคเตอร์ (Projector)', category: 'Hardware', type: 'Loanable', totalUnits: 3, availableUnits: 3, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80&w=300' },
  { id: 'e2', name: 'จอรับโปรเจคเตอร์เคลื่อนที่', category: 'Hardware', type: 'Loanable', totalUnits: 2, availableUnits: 2, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=300' },
  { id: 'e3', name: 'โน้ตบุ๊ค (Notebook)', category: 'Hardware', type: 'Loanable', totalUnits: 5, availableUnits: 4, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&q=80&w=300' },
  { id: 'e4', name: 'PC All in One', category: 'Hardware', type: 'Loanable', totalUnits: 2, availableUnits: 2, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=300' },
  { id: 'e5', name: 'ชุดลำโพง', category: 'Audio', type: 'Loanable', totalUnits: 4, availableUnits: 4, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=300' },
  { id: 'e6', name: 'ไมค์ลอย', category: 'Audio', type: 'Loanable', totalUnits: 6, availableUnits: 6, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1512495039889-52a3b799c9bc?auto=format&fit=crop&q=80&w=300' },
  { id: 'e7', name: 'ไมค์ประชุม (Conference)', category: 'Audio', type: 'Loanable', totalUnits: 2, availableUnits: 2, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=300' },
  
  // Cables/Accessories (Loanable)
  { id: 'e8', name: 'สายสัญญาณ HDMI', category: 'Cables', type: 'Loanable', totalUnits: 10, availableUnits: 10, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&q=80&w=300' },
  { id: 'e9', name: 'Adapter iPad', category: 'Accessories', type: 'Loanable', totalUnits: 3, availableUnits: 3, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=300' },
  { id: 'e10', name: 'ปลั๊กไฟพ่วง', category: 'Accessories', type: 'Loanable', totalUnits: 8, availableUnits: 8, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1558244661-d248897f7bc4?auto=format&fit=crop&q=80&w=300' },
  
  // Office Supply (Consumable)
  { id: 'e11', name: 'กระดาษ A4 ธรรมดา (รีม)', category: 'Office Supply', type: 'Consumable', totalUnits: 100, availableUnits: 100, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=300' },
  { id: 'e12', name: 'ถ่าน AA', category: 'Office Supply', type: 'Consumable', totalUnits: 50, availableUnits: 50, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=300' },
  { id: 'e13', name: 'ถ่าน AAA', category: 'Office Supply', type: 'Consumable', totalUnits: 50, availableUnits: 50, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&q=80&w=300' },
  { id: 'e14', name: 'กระดาษกาวสองหน้าบาง', category: 'Office Supply', type: 'Consumable', totalUnits: 20, availableUnits: 20, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1603513492128-ba7bc9b3e143?auto=format&fit=crop&q=80&w=300' },
  { id: 'e15', name: 'เทปใส', category: 'Office Supply', type: 'Consumable', totalUnits: 30, availableUnits: 30, status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=300' },
];

export const mockOrders: RequestOrder[] = [];
export const mockMaintenance: MaintenanceRecord[] = [];

