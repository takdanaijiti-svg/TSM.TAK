import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { mockUsers } from '../utils/mockData';
import { useSound } from '../hooks/useSound';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  addUser: (newUser: Omit<User, 'id'>) => void;
  deleteUser: (id: string) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const playSound = useSound();

  useEffect(() => {
    // Load all users from localStorage or initialize with mockUsers
    const storedUsersList = localStorage.getItem('taksin_users_list');
    if (storedUsersList) {
      setUsers(JSON.parse(storedUsersList));
    } else {
      setUsers(mockUsers);
      localStorage.setItem('taksin_users_list', JSON.stringify(mockUsers));
    }

    const storedUser = localStorage.getItem('taksin_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Save users list whenever it changes
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('taksin_users_list', JSON.stringify(users));
    }
  }, [users]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Simple mock authentication looking at dynamic users list
    const foundUser = users.find(u => u.email === email);
    
    // Check dummy passwords based on role
    let isValid = false;
    if (foundUser) {
      if (foundUser.role === 'Admin' && password === 'TaksinAdmin2026') isValid = true;
      if (foundUser.role === 'Manager' && password === 'TaksinManager3000') isValid = true;
      if (foundUser.role === 'Staff' && password === 'TaksinStaff111') isValid = true;
    }

    setLoading(false);
    if (isValid && foundUser) {
      setUser(foundUser);
      localStorage.setItem('taksin_user', JSON.stringify(foundUser));
      playSound('success');
      return true;
    }
    
    playSound('error');
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taksin_user');
    playSound('click');
  };

  const addUser = (newUserParams: Omit<User, 'id'>) => {
    const newUser: User = {
      ...newUserParams,
      id: Math.random().toString(36).substring(2, 9),
    };
    setUsers(prev => [...prev, newUser]);
    playSound('success');
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    // If deleted user was currently logged in, logout
    if (user && user.id === id) {
      logout();
    }
    playSound('warning');
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    // If current logged-in user got updated, update their session too
    if (user && user.id === id) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('taksin_user', JSON.stringify(updatedUser));
    }
    playSound('success');
  };

  return (
    <AuthContext.Provider value={{ user, users, login, logout, loading, addUser, deleteUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
