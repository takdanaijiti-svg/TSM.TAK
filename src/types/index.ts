export type Role = 'Admin' | 'Manager' | 'Staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  phone: string;
  imageUrl?: string;
}

export type EquipmentType = 'Loanable' | 'Consumable';

export interface Equipment {
  id: string;
  name: string;
  category: string;
  type: EquipmentType;
  totalUnits: number;
  availableUnits: number;
  status: 'Available' | 'Low Stock' | 'Out of Stock' | 'Maintenance';
  imageUrl?: string;
  description?: string;
}

export type RequestStatus = 'Pending' | 'Approved' | 'In Use' | 'Returned' | 'Dispensed' | 'Rejected';

export interface RequestItem {
  equipmentId: string;
  quantity: number;
  equipment: Equipment; 
}

export interface RequestOrder {
  id: string;
  userId: string;
  userName: string;
  userDepartment: string;
  userPhone: string;
  items: RequestItem[];
  requestDate: string;
  pickupDate: string;
  expectedReturnDate?: string;
  actualReturnDate?: string;
  note?: string;
  status: RequestStatus;
  auditLog: AuditLogEntry[];
}

export interface AuditLogEntry {
  id: string;
  date: string;
  action: string;
  performedBy: string;
  note?: string;
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  reportedDate: string;
  reportedBy: string;
  issueDescription: string;
  status: 'In Progress' | 'Completed';
  completedDate?: string;
}

export interface AppSettings {
  appName: string;
  hospitalName: string;
  logoUrl: string;
}

export type JobCategory = 'ผลิตป้าย' | 'Computer Graphic' | 'งานอื่นๆ';
export type JobStatus = 'Pending' | 'In Progress' | 'Completed' | 'Delivered' | 'Rejected';

export interface JobRequest {
  id: string;
  userId: string;
  userName: string;
  userDepartment: string;
  userPhone: string;
  requestDate: string;
  dueDate: string;
  category: JobCategory;
  subType: string;
  topic?: string;
  size?: string;
  quantity: number;
  details?: string;
  attachments?: string[];
  status: JobStatus;
  completedAt?: string;
  deliveryNote?: string;
  completedAttachment?: string;
}
