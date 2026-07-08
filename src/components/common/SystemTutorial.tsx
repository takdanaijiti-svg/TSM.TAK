import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, X, ArrowRight, ShoppingCart, Calendar, CheckSquare, 
  FileText, ListTodo, ClipboardCheck, Sparkles, LogIn, ChevronRight, ChevronLeft, Lightbulb
} from 'lucide-react';

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  tips: string[];
}

export function SystemTutorial() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'borrow' | 'media' | 'general'>('borrow');
  const [stepIndex, setStepIndex] = useState(0);

  const borrowSteps: TutorialStep[] = [
    {
      title: '1. เลือกของใส่ตะกร้า',
      description: 'ไปที่หน้าหลัก เลือกอุปกรณ์ครุภัณฑ์ที่ต้องการยืม แล้วคลิกปุ่ม "หยิบใส่ตะกร้า" (ระบุจำนวนที่ต้องการ)',
      icon: <ShoppingCart className="text-emerald-600" size={32} />,
      tips: [
        'วัสดุสิ้นเปลือง (เบิกหมดไป) จะไม่ต้องคืน',
        'ครุภัณฑ์ (ยืม-คืน) ต้องระบุวันส่งคืนด้วย',
        'หากยอดคงเหลือไม่พอปุ่มหยิบจะถูกปิดใช้งาน'
      ]
    },
    {
      title: '2. ไปที่หน้าตะกร้าของเล่น',
      description: 'กดไอคอน "ตะกร้าสีเขียว" ที่ด้านบนขวา เพื่อเปิดหน้ารายการสั่งยืมทั้งหมดที่คุณเลือกไว้',
      icon: <Calendar className="text-emerald-600" size={32} />,
      tips: [
        'คุณสามารถเพิ่ม-ลดจำนวน หรือลบรายการที่ไม่ต้องการออกได้ในหน้านี้',
        'ตรวจสอบความถูกต้องก่อนทำขั้นตอนถัดไป'
      ]
    },
    {
      title: '3. ระบุรายละเอียดผู้ยืม',
      description: 'เลือกวันนัดรับของ วันกำหนดส่งคืน กรอกวัตถุประสงค์ และข้อมูลติดต่อให้ครบถ้วนเพื่อส่งคำขอเข้าสู่ระบบ',
      icon: <FileText className="text-emerald-600" size={32} />,
      tips: [
        'ระบบจำเป็นต้องระบุวัตถุประสงค์เพื่อนำไปประกอบรายงาน',
        'กรุณาตรวจสอบเบอร์ติดต่อกลับให้ถูกต้อง'
      ]
    },
    {
      title: '4. ติดตามสถานะคำขอ',
      description: 'หลังจากส่งคำขอแล้ว สามารถติดตามได้ที่กระดานตรวจสอบ (Kanban) ว่าเจ้าหน้าที่อนุมัติคำยืมเรียบร้อยหรือยัง',
      icon: <CheckSquare className="text-emerald-600" size={32} />,
      tips: [
        'สถานะจะมี: รอนัดรับ ➔ กำลังใช้งาน ➔ คืนแล้ว ➔ เลยกำหนดส่งคืน',
        'หากเลยกำหนดระบบจะขึ้นแจ้งเตือนสีแดงทันที!'
      ]
    }
  ];

  const mediaSteps: TutorialStep[] = [
    {
      title: '1. เข้าเมนู "ส่งคำขอผลิตสื่อ"',
      description: 'กดที่ปุ่ม "ส่งคำขอผลิตสื่อ" ที่เมนูด้านซ้าย เพื่อเริ่มต้นสร้างคำสั่งงานผลิตใหม่ให้กับเจ้าหน้าที่โสตเวชนิทัศน์',
      icon: <ListTodo className="text-blue-600" size={32} />,
      tips: [
        'ต้องเข้าสู่ระบบก่อนจึงจะสามารถเปิดใช้งานฟังก์ชั่นนี้ได้',
        'เลือกประเภทงานให้ตรงจุด (เช่น วิดีโอสั้น, ภาพถ่ายนิ่ง, แผ่นพับ)'
      ]
    },
    {
      title: '2. กรอกสเปกงาน & แนบไฟล์',
      description: 'ระบุหัวข้อโครงการ วัตถุประสงค์สั้นๆ รายละเอียดข้อกำหนด ขนาด และแนบลิงก์ตัวอย่างหรือไฟล์ร่างประกอบงาน',
      icon: <FileText className="text-blue-600" size={32} />,
      tips: [
        'หากมีตัวอย่างรูปแบบแนวดีไซน์ที่ชอบ สามารถแนบลิงก์ไดรฟ์หรือรูปภาพอ้างอิงได้เลย',
        'กำหนดวันกำหนดส่งงานให้เหมาะสมกับการผลิต'
      ]
    },
    {
      title: '3. บอร์ดติดตามงานผลิตโสตฯ',
      description: 'เมื่อส่งแบบแล้ว ระบบจะนำคำขอเข้าสู่กระดานคัมบังเจ้าหน้าที่ เพื่อแบ่งงานและอัปเดตสถานะการออกแบบ',
      icon: <ClipboardCheck className="text-blue-600" size={32} />,
      tips: [
        'คุณสามารถเข้าไปดูสถานะได้ทุกเมื่อ: เตรียมการ ➔ กำลังผลิต ➔ ตรวจสอบแก้ไของาน ➔ ส่งมอบเสร็จสมบูรณ์'
      ]
    }
  ];

  const generalSteps: TutorialStep[] = [
    {
      title: '🔑 การเข้าสู่ระบบด่วน',
      description: 'โรงพยาบาลมีสิทธิ์ผู้ใช้งานทั้งหมด 3 ระดับเพื่อการทดลองใช้งานที่สมบูรณ์แบบ',
      icon: <LogIn className="text-indigo-600" size={32} />,
      tips: [
        'Admin: สำหรับดูแลสต็อก, จัดการบุคลากร, และตั้งค่าโรงพยาบาล',
        'Manager: สำหรับอนุมัติรับ-คืนของ และมอบหมายงานผลิตโสตฯ',
        'Staff: เจ้าหน้าที่ทั่วไป สามารถยืมของและบันทึกรายงานสต็อกได้'
      ]
    },
    {
      title: '💡 วิธีเข้าใช้แต่ละสิทธิ์',
      description: 'ในหน้าทำเนียบบุคลากร จะมีกล่องสีฟ้าด้านบนแจ้งเตือนคู่มือพร้อมพาสเวิร์ดของแต่ละสิทธิ์ สามารถคัดลอกมาใช้ได้เลย!',
      icon: <Lightbulb className="text-indigo-600" size={32} />,
      tips: [
        'บัญชีแอดมินใช้: admin@taksin.hospital',
        'สิทธิ์ของหัวหน้างานใช้: manager@taksin.hospital',
        'สามารถเพิ่ม/ลบบุคลากรใหม่ได้เองในหน้า ทำเนียบบุคลากร'
      ]
    }
  ];

  const currentSteps = activeTab === 'borrow' ? borrowSteps : activeTab === 'media' ? mediaSteps : generalSteps;
  const currentStep = currentSteps[stepIndex] || currentSteps[0];

  const handleNext = () => {
    if (stepIndex < currentSteps.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const changeTab = (tab: 'borrow' | 'media' | 'general') => {
    setActiveTab(tab);
    setStepIndex(0);
  };

  return (
    <>
      {/* Floating Tutorial Help Button at the bottom-right */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          id="btn-tutorial-trigger"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all font-medium border border-green-500/30"
        >
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <HelpCircle size={14} className="relative text-white" />
          </span>
          <span className="text-sm">สอนใช้งานระบบ 📖</span>
        </motion.button>
      </div>

      {/* Tutorial Popup Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Click backdrop to close */}
            <div className="fixed inset-0 z-45 bg-slate-900/10 pointer-events-none" />

            <motion.div
              id="tutorial-popup-container"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-20 right-6 w-[360px] sm:w-[420px] bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden flex flex-col pointer-events-auto"
            >
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center">
                    <Sparkles size={16} className="animate-pulse" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-sm block">💡 คู่มือช่วยสอนใช้งานด่วน</span>
                    <span className="text-[10px] text-slate-500">เรียนรู้วิธียืม-คืน และสั่งงานโสตฯ ใน 1 นาที</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 p-1.5 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100 p-1 bg-slate-50">
                <button
                  onClick={() => changeTab('borrow')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'borrow' ? 'bg-white text-green-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  🛒 ยืม-คืนครุภัณฑ์
                </button>
                <button
                  onClick={() => changeTab('media')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'media' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  🎬 ขอผลิตสื่อโสตฯ
                </button>
                <button
                  onClick={() => changeTab('general')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'general' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  🔑 วิธีเข้าใช้งาน
                </button>
              </div>

              {/* Content Panel */}
              <div className="p-5 flex-1 flex flex-col justify-between min-h-[300px]">
                {/* Step Info */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 shadow-xs">
                      {currentStep.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm leading-tight">{currentStep.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{currentStep.description}</p>
                    </div>
                  </div>

                  {/* Pro tips with badge */}
                  <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 space-y-2">
                    <span className="inline-block text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-200/80 px-2 py-0.5 rounded-full">
                      คำแนะนำพิเศษ / ทริคแนะนำ
                    </span>
                    <ul className="space-y-1.5">
                      {currentStep.tips.map((tip, idx) => (
                        <li key={idx} className="text-[11px] text-slate-600 flex items-start gap-1.5 leading-relaxed">
                          <span className="text-green-500 shrink-0 mt-0.5">✔</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
                  {/* Step counter */}
                  <span className="text-xs text-slate-400 font-medium">
                    ขั้นตอนที่ {stepIndex + 1} จาก {currentSteps.length}
                  </span>

                  {/* Navigation buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrev}
                      disabled={stepIndex === 0}
                      className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    {stepIndex < currentSteps.length - 1 ? (
                      <button
                        onClick={handleNext}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-colors"
                      >
                        <span>ถัดไป</span>
                        <ChevronRight size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsOpen(false)}
                        className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-colors"
                      >
                        เข้าใจแล้ว! 🎉
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
