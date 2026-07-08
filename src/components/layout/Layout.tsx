import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useSettings } from '../../contexts/SettingsContext';
import { ShoppingCart, LogOut, LayoutDashboard, Package, KanbanSquare, Wrench, BarChart3, Users, Menu, Bell, PenTool, Settings as SettingsIcon, X, Check, Trash2, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SystemTutorial } from '../common/SystemTutorial';

export function Layout() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);

  const [notifications, setNotifications] = React.useState([
    {
      id: '1',
      title: 'ยินดีต้อนรับสู่ระบบ',
      desc: `ยินดีต้อนรับสู่ระบบบริหารจัดการอุปกรณ์และงานผลิตเวชนิทัศน์ ${settings.hospitalName || 'โรงพยาบาล'}`,
      time: 'เมื่อสักครู่',
      unread: true,
      type: 'info'
    },
    {
      id: '2',
      title: 'งานผลิตสื่อโสตฯ ใหม่',
      desc: 'งานผลิต "โครงการพัฒนาสื่อการสอนดิจิทัล" ของแผนกอายุรกรรม อยู่ระหว่างเตรียมการผลิต',
      time: '1 ชั่วโมงที่แล้ว',
      unread: true,
      type: 'job'
    },
    {
      id: '3',
      title: 'แจ้งเตือนกำหนดส่งคืนอุปกรณ์',
      desc: 'กรุณาเตรียมส่งคืนกล้องถ่ายภาพนิ่ง Sony Alpha 7 IV และชุดขาตั้งกล้องภายในวันพรุ่งนี้',
      time: '4 ชั่วโมงที่แล้ว',
      unread: true,
      type: 'alert'
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n));
  };

  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleLogout = () => {
    logout();
    setMobileSidebarOpen(false);
    navigate('/');
  };

  const navItems = [
    { name: 'อุปกรณ์ทั้งหมด', path: '/', icon: Package, roles: ['Admin', 'Manager', 'Staff', 'Public'] },
    { name: 'สั่งงานโสตฯ', path: '/service-request', icon: PenTool, roles: ['Admin', 'Manager', 'Staff', 'Public'] },
    { name: 'แดชบอร์ด', path: '/dashboard', icon: LayoutDashboard, roles: ['Admin', 'Manager', 'Staff', 'Public'] },
    { name: 'บุคลากร', path: '/staff', icon: Users, roles: ['Admin', 'Manager', 'Staff', 'Public'] },
    ...(user ? [
      { name: 'จัดการคำขอเบิก', path: '/kanban', icon: KanbanSquare, roles: ['Admin', 'Manager'] },
      { name: 'จัดการงานผลิต', path: '/job-kanban', icon: KanbanSquare, roles: ['Admin', 'Manager'] },
      { name: 'จัดการคลังสต็อก', path: '/inventory', icon: Package, roles: ['Admin', 'Manager', 'Staff'] },
      { name: 'แจ้งซ่อมอุปกรณ์', path: '/maintenance', icon: Wrench, roles: ['Admin', 'Manager'] },
      { name: 'รายงาน/สถิติ', path: '/analytics', icon: BarChart3, roles: ['Admin', 'Manager'] },
      { name: 'ตั้งค่าระบบ', path: '/settings', icon: SettingsIcon, roles: ['Admin'] },
    ] : [])
  ];

  const allowedNavItems = navItems.filter(item => 
    item.roles.includes('Public') || (user && item.roles.includes(user.role))
  );

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full bg-white text-slate-800">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-3 min-w-0"
          onClick={() => isMobile && setMobileSidebarOpen(false)}
        >
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded-lg bg-green-50 p-0.5 shrink-0 border border-slate-100" />
          ) : (
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M2 12h20"/></svg>
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-slate-800 leading-tight truncate">{settings.hospitalName}</h1>
            <p className="text-xs text-green-600 font-semibold tracking-wide truncate">{settings.appName}</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar">
        <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-3 mb-2">เมนูระบบ</div>
        {allowedNavItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setMobileSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive 
                  ? 'bg-green-50 text-green-700 font-semibold shadow-sm shadow-green-100' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <item.icon size={18} className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-green-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span className="truncate">{item.name}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-green-600"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-slate-200 shrink-0 bg-white">
        <SidebarContent />
      </aside>

      {/* Main Panel Wrapper */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Right Top Header (Top Bar) */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 h-16 shrink-0">
          <div className="h-full px-4 sm:px-6 flex items-center justify-between">
            {/* Left Section: Mobile Toggle & Mobile Logo */}
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 text-slate-600 hover:text-green-700 hover:bg-slate-100 rounded-lg transition-colors"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
              
              {/* Mobile Only Header Text */}
              <div className="lg:hidden flex items-center gap-2">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
                ) : (
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M2 12h20"/></svg>
                  </div>
                )}
                <div className="text-left">
                  <h1 className="text-sm font-bold text-slate-800 leading-tight truncate max-w-[120px] sm:max-w-[200px]">{settings.hospitalName}</h1>
                  <p className="text-[10px] text-green-600 font-medium tracking-wide truncate max-w-[120px] sm:max-w-[200px]">{settings.appName}</p>
                </div>
              </div>
            </div>

            {/* Right Section: Actions (Notifications, Cart, User avatar) */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Cart Button */}
              <Link to="/cart" className="relative p-2.5 text-slate-600 hover:text-green-700 hover:bg-slate-100 rounded-xl transition-all" title="รถเข็นเครื่องมือ">
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 flex items-center justify-center min-w-5 h-5 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </Link>

              {/* Notification Bell with interactive dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-2.5 rounded-xl transition-all relative ${showNotifications ? 'bg-green-50 text-green-700' : 'text-slate-600 hover:text-green-700 hover:bg-slate-100'}`}
                  title="การแจ้งเตือน"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <>
                      {/* Transparent backdrop for clicking outside to close */}
                      <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                      
                      {/* Dropdown Popover */}
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
                      >
                        {/* Header */}
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">การแจ้งเตือน</span>
                            {unreadCount > 0 && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-bold">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {notifications.length > 0 && (
                              <>
                                <button 
                                  onClick={handleMarkAllRead}
                                  className="text-xs text-green-600 hover:text-green-700 font-medium"
                                >
                                  อ่านทั้งหมด
                                </button>
                                <span className="text-slate-300">|</span>
                                <button 
                                  onClick={handleClearAll}
                                  className="text-xs text-slate-400 hover:text-red-600 font-medium flex items-center gap-1"
                                >
                                  ล้างทั้งหมด
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* List Area */}
                        <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-100">
                          {notifications.length > 0 ? (
                            notifications.map(n => (
                              <div 
                                key={n.id}
                                onClick={() => handleToggleRead(n.id)}
                                className={`p-4 flex gap-3 hover:bg-slate-50/80 cursor-pointer transition-colors relative group ${n.unread ? 'bg-green-50/20' : ''}`}
                              >
                                {/* Left Icon indicating category */}
                                <div className="shrink-0 mt-0.5">
                                  {n.type === 'alert' ? (
                                    <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 border border-amber-100">
                                      <AlertCircle size={16} />
                                    </div>
                                  ) : n.type === 'job' ? (
                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100">
                                      <PenTool size={16} />
                                    </div>
                                  ) : (
                                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600 border border-green-100">
                                      <Info size={16} />
                                    </div>
                                  )}
                                </div>

                                {/* Texts */}
                                <div className="flex-1 min-w-0 pr-4">
                                  <div className="flex items-center gap-1.5 mb-0.5">
                                    <span className={`text-sm ${n.unread ? 'font-bold text-slate-900' : 'text-slate-700 font-medium'}`}>{n.title}</span>
                                    {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-green-600 shrink-0"></span>}
                                  </div>
                                  <p className="text-xs text-slate-500 leading-relaxed break-all">{n.desc}</p>
                                  <span className="text-[10px] text-slate-400 mt-1.5 block">{n.time}</span>
                                </div>

                                {/* Delete Button on Hover */}
                                <button 
                                  onClick={(e) => handleDeleteNotification(n.id, e)}
                                  className="absolute right-3 top-4 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                  title="ลบ"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="p-8 text-center flex flex-col items-center justify-center">
                              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-3 border border-slate-100">
                                <Bell size={20} className="text-slate-300" />
                              </div>
                              <p className="text-sm font-medium text-slate-700">ไม่มีการแจ้งเตือนใหม่</p>
                              <p className="text-xs text-slate-400 mt-1">คุณได้รับการอัปเดตข้อมูลทั้งหมดเรียบร้อยแล้ว</p>
                            </div>
                          )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                            <span className="text-[10px] text-slate-400">คลิกที่รายการเพื่อสลับสถานะ "อ่านแล้ว/ยังไม่ได้อ่าน"</span>
                          </div>
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Login/Logout Section back in original location */}
              {user ? (
                <div className="flex items-center gap-3 sm:gap-4 border-l border-slate-200 pl-4 shrink-0">
                  <div className="hidden sm:block text-right">
                    <div className="text-sm font-semibold text-slate-800 leading-tight">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.role}</div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                    title="ออกจากระบบ"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="border-l border-slate-200 pl-4 shrink-0">
                  <Link to="/login" className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors shadow-sm whitespace-nowrap">
                    เข้าสู่ระบบ
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer (Sidebar) */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950 z-50 lg:hidden"
            />

            {/* Drawer Container */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden shadow-2xl flex flex-col h-full"
            >
              {/* Close Button on Sidebar */}
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
              
              <SidebarContent isMobile={true} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <SystemTutorial />
    </div>
  );
}
