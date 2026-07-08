import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Equipment, RequestOrder, MaintenanceRecord, RequestStatus, AuditLogEntry, RequestItem } from '../types';
import { mockEquipment, mockOrders, mockMaintenance } from '../utils/mockData';
import { useAuth } from './AuthContext';
import { useSound } from '../hooks/useSound';

// Define the context shape
interface EquipmentContextType {
  equipment: Equipment[];
  orders: RequestOrder[];
  maintenance: MaintenanceRecord[];
  addEquipment: (item: Omit<Equipment, 'id' | 'availableUnits' | 'status'>) => void;
  updateEquipment: (id: string, updates: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  adjustAvailableQuantity: (id: string, delta: number) => void;
  createOrder: (items: RequestItem[], expectedReturnDate: string | undefined, note: string, pickupDate: string) => void;
  updateOrderStatus: (orderId: string, newStatus: RequestStatus) => void;
  reportMaintenance: (equipmentId: string, issue: string) => void;
  completeMaintenance: (maintenanceId: string) => void;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

// Simple ID generator since we didn't install uuid
const generateId = () => Math.random().toString(36).substring(2, 9);

export function EquipmentProvider({ children }: { children: ReactNode }) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [orders, setOrders] = useState<RequestOrder[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
  const { user } = useAuth();
  const playSound = useSound();

  // Load initial data
  useEffect(() => {
    const storedEq = localStorage.getItem('taksin_equipment');
    const storedOrders = localStorage.getItem('taksin_orders');
    const storedMaint = localStorage.getItem('taksin_maintenance');

    if (storedEq) setEquipment(JSON.parse(storedEq));
    else {
      setEquipment(mockEquipment);
      localStorage.setItem('taksin_equipment', JSON.stringify(mockEquipment));
    }

    if (storedOrders) setOrders(JSON.parse(storedOrders));
    else {
      setOrders(mockOrders);
      localStorage.setItem('taksin_orders', JSON.stringify(mockOrders));
    }

    if (storedMaint) setMaintenance(JSON.parse(storedMaint));
    else {
      setMaintenance(mockMaintenance);
      localStorage.setItem('taksin_maintenance', JSON.stringify(mockMaintenance));
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (equipment.length > 0) localStorage.setItem('taksin_equipment', JSON.stringify(equipment));
  }, [equipment]);

  useEffect(() => {
    if (orders.length > 0) localStorage.setItem('taksin_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (maintenance.length > 0) localStorage.setItem('taksin_maintenance', JSON.stringify(maintenance));
  }, [maintenance]);

  const addEquipment = (item: Omit<Equipment, 'id' | 'availableUnits' | 'status'>) => {
    const newEq: Equipment = {
      ...item,
      id: generateId(),
      availableUnits: item.totalUnits,
      status: item.totalUnits > 0 ? 'Available' : 'Out of Stock'
    };
    setEquipment(prev => [...prev, newEq]);
    playSound('success');
  };

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    setEquipment(prev => prev.map(eq => {
      if (eq.id === id) {
        const updated = { ...eq, ...updates };
        // Ensure availableUnits does not exceed totalUnits
        if (updated.totalUnits !== undefined && updated.availableUnits > updated.totalUnits) {
          updated.availableUnits = updated.totalUnits;
        }
        if (updated.availableUnits <= 0) updated.status = 'Out of Stock';
        else if (updated.availableUnits < updated.totalUnits * 0.2) updated.status = 'Low Stock';
        else updated.status = 'Available';
        return updated;
      }
      return eq;
    }));
    playSound('success');
  };

  const deleteEquipment = (id: string) => {
    setEquipment(prev => prev.filter(eq => eq.id !== id));
    playSound('warning');
  };

  const adjustAvailableQuantity = (id: string, delta: number) => {
    setEquipment(prev => prev.map(eq => {
      if (eq.id === id) {
        let newAvail = eq.availableUnits + delta;
        if (newAvail < 0) newAvail = 0;
        if (newAvail > eq.totalUnits) newAvail = eq.totalUnits;
        
        let newStatus = eq.status;
        if (newAvail === 0) newStatus = 'Out of Stock';
        else if (newAvail < eq.totalUnits * 0.2) newStatus = 'Low Stock';
        else newStatus = 'Available';

        return { ...eq, availableUnits: newAvail, status: newStatus };
      }
      return eq;
    }));
  };

  const createOrder = (items: RequestItem[], expectedReturnDate: string | undefined, note: string, pickupDate: string) => {
    if (!user) return;
    
    // Deduct stock tentatively
    items.forEach(item => {
      adjustAvailableQuantity(item.equipmentId, -item.quantity);
    });

    const newOrder: RequestOrder = {
      id: generateId(),
      userId: user.id,
      userName: user.name,
      userDepartment: user.department,
      userPhone: user.phone,
      items,
      requestDate: new Date().toISOString(),
      pickupDate,
      expectedReturnDate,
      note,
      status: 'Pending',
      auditLog: [{
        id: generateId(),
        date: new Date().toISOString(),
        action: 'Created Request',
        performedBy: user.name
      }]
    };
    
    setOrders(prev => [newOrder, ...prev]);
    playSound('success');
  };

  const updateOrderStatus = (orderId: string, newStatus: RequestStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status: newStatus };
        
        updatedOrder.auditLog = [
          ...order.auditLog,
          {
            id: generateId(),
            date: new Date().toISOString(),
            action: `Status changed to ${newStatus}`,
            performedBy: user ? user.name : 'System'
          }
        ];

        // Handle stock returning if Rejected or Returned
        if (newStatus === 'Rejected') {
           order.items.forEach(item => {
             adjustAvailableQuantity(item.equipmentId, item.quantity);
           });
        }
        
        if (newStatus === 'Returned') {
           updatedOrder.actualReturnDate = new Date().toISOString();
           // Only return Loanable items to stock
           order.items.forEach(item => {
             if (item.equipment.type === 'Loanable') {
               adjustAvailableQuantity(item.equipmentId, item.quantity);
             }
           });
        }

        if (newStatus === 'Dispensed') {
           // For consumable only orders, mark as dispensed
        }

        return updatedOrder;
      }
      return order;
    }));
    playSound('click');
  };

  const reportMaintenance = (equipmentId: string, issue: string) => {
    const eq = equipment.find(e => e.id === equipmentId);
    if (!eq) return;

    // Deduct from available (assume 1 unit goes to maintenance)
    adjustAvailableQuantity(equipmentId, -1);

    const newRecord: MaintenanceRecord = {
      id: generateId(),
      equipmentId,
      equipmentName: eq.name,
      reportedDate: new Date().toISOString(),
      reportedBy: user ? user.name : 'Unknown',
      issueDescription: issue,
      status: 'In Progress'
    };

    setMaintenance(prev => [newRecord, ...prev]);
    playSound('warning');
  };

  const completeMaintenance = (maintenanceId: string) => {
    setMaintenance(prev => prev.map(m => {
      if (m.id === maintenanceId) {
        // Return 1 unit to available
        adjustAvailableQuantity(m.equipmentId, 1);
        return { ...m, status: 'Completed', completedDate: new Date().toISOString() };
      }
      return m;
    }));
    playSound('success');
  };

  return (
    <EquipmentContext.Provider value={{
      equipment, orders, maintenance,
      addEquipment, updateEquipment, deleteEquipment, adjustAvailableQuantity,
      createOrder, updateOrderStatus, reportMaintenance, completeMaintenance
    }}>
      {children}
    </EquipmentContext.Provider>
  );
}

export function useEquipment() {
  const context = useContext(EquipmentContext);
  if (context === undefined) {
    throw new Error('useEquipment must be used within an EquipmentProvider');
  }
  return context;
}
