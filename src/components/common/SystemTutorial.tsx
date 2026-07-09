import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, X, ShoppingCart, Calendar, CheckSquare, 
  FileText, ListTodo, ClipboardCheck, Sparkles, LogIn, ChevronRight, ChevronLeft, Lightbulb, Play, BookOpen
} from 'lucide-react';

interface TutorialStep {
  title: string;
  subtitle: string;
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
      title: 'หยิบใส่ตะกร้า',
      subtitle: 'ขั้นตอนที่ 1: เลือกอุปกรณ์ที่ต้องการยืม',
      description: 'ไปที่ หน้าหลัก (เมนูด้านซ้าย) เพื่อเลือกอุปกรณ์ที่ต้องการยืม แล้วกดปุ่ม "หยิบใส่ตะกร้า" สีเขียวตามจำนวนที่ท่านต้องการใช้งานจริง',
      icon: <ShoppingCart className="text-emerald-600" size={38} />,
      tips: [
        'ประเภท "ยืม-คืน" (ครุภัณฑ์): เมื่อหมดความจำเป็นจะต้องส่งคืน เช่น โน้ตบุ๊ค, ลำโพง, โปรเจคเตอร์',
        'ประเภท "เบิกจ่าย" (วัสดุหมดไป): ไม่ต้องนำมาคืนระบบ เช่น ถ่าน AA, กระดาษ A4, เทปใส',
        'หากอุปกรณ์ใดสต็อกหมดหรือจำนวนไม่พอ ปุ่มหยิบจะเปลี่ยนเป็นปิดใช้งานทันที'
      ]
    },
    {
      title: 'ตรวจสอบตะกร้า',
      subtitle: 'ขั้นตอนที่ 2: เปิดตะกร้าและตรวจของ',
      description: 'คลิกที่ปุ่ม "ตะกร้าสีเขียว 🛒" บริเวณมุมขวาบนของแถบเมนูด้านบน เพื่อเปิดดูรายการที่ท่านเลือกหยิบสะสมไว้',
      icon: <Calendar className="text-emerald-600" size={38} />,
      tips: [
        'ท่านสามารถปรับเพิ่ม-ลดจำนวน หรือคลิกไอคอนถังขยะเพื่อลบรายการออกจากตะกร้าได้ตามสบาย',
        'ระบบจะคอยแจ้งเตือนและตรวจสอบสต็อกให้เรียลไทม์ไม่ให้เกิดการยืมเกินโควตา'
      ]
    },
    {
      title: 'กรอกรายละเอียดคำขอ',
      subtitle: 'ขั้นตอนที่ 3: ระบุข้อมูลการยืมและวันรับส่ง',
      description: 'กรอกข้อมูลสำคัญลงในฟอร์มของตะกร้า เช่น วันที่นัดรับอุปกรณ์, วันกำหนดส่งคืนครุภัณฑ์, สถานที่ใช้งาน และวัตถุประสงค์ในการยืม',
      icon: <FileText className="text-emerald-600" size={38} />,
      tips: [
        'กรุณาระบุวัตถุประสงค์สั้นๆ เพื่อให้แอดมินหรือหัวหน้างานอนุมัติคำขอได้ง่ายขึ้น',
        'ระบุเบอร์โทรศัพท์ติดต่อของท่าน เพื่อความสะดวกในกรณีจำเป็นเร่งด่วน'
      ]
    },
    {
      title: 'ติดตามและรับของ',
      subtitle: 'ขั้นตอนที่ 4: ตรวจสอบสถานะและส่งคืน',
      description: 'เมื่อส่งคำขอแล้ว สามารถติดตามผลได้ที่หน้า "กระดานตรวจสอบ (Kanban)" เพื่อดูสถานะการอนุมัติและการรับของ',
      icon: <CheckSquare className="text-emerald-600" size={38} />,
      tips: [
        'สถานะการยืม: รอนัดรับ ➔ กำลังใช้งาน ➔ คืนแล้ว ➔ เลยกำหนดส่งคืน',
        'หากใกล้เลยกำหนดหรือเกินเวลาที่ตั้งไว้ ระบบจะแสดงแท็กแจ้งเตือนสีแดงทันทีเพื่อแจ้งเตือนให้ส่งคืน'
      ]
    }
  ];

  const mediaSteps: TutorialStep[] = [
    {
      title: 'เปิดหน้าส่งคำขอ',
      subtitle: 'ขั้นตอนที่ 1: เข้าเมนูยื่นคำขอผลิตสื่อใหม่',
      description: 'คลิกเมนู "ส่งคำขอผลิตสื่อ" ที่แถบเมนูด้านซ้าย เพื่อกรอกรายละเอียดความต้องการผลิตงานสื่อมัลติมีเดียต่างๆ',
      icon: <ListTodo className="text-blue-600" size={38} />,
      tips: [
        'ฟังก์ชันนี้สำหรับให้บุคลากรโรงพยาบาล สั่งงานออกแบบหรือผลิตสื่อกับกลุ่มโสตฯ โดยตรง',
        'กรุณาตรวจสอบว่าท่านเข้าสู่ระบบแล้วก่อนกรอกแบบฟอร์ม'
      ]
    },
    {
      title: 'ระบุสเปก & แนบไฟล์',
      subtitle: 'ขั้นตอนที่ 2: กรอกข้อกำหนดการดีไซน์',
      description: 'ระบุรายละเอียดงาน เช่น ชื่องาน/โครงการ, ขนาดผลงาน, รูปแบบโทนสีที่ต้องการ พร้อมแนบลิงก์แชร์ไฟล์อ้างอิง (เช่น Google Drive, Dropbox)',
      icon: <FileText className="text-blue-600" size={38} />,
      tips: [
        'การแนบลิงก์รูปภาพตัวอย่างหรือไฟล์ดราฟท์บอร์ด จะช่วยให้ช่างภาพ/ดีไซเนอร์ทำงานได้รวดเร็วและตรงใจยิ่งขึ้น',
        'กำหนดระยะเวลารับงานอย่างน้อย 3-5 วันทำการ เพื่อให้ได้ชิ้นงานที่ประณีตและสมบูรณ์'
      ]
    },
    {
      title: 'ติดตามสถานะงานผลิต',
      subtitle: 'ขั้นตอนที่ 3: ตรวจสอบขั้นตอนการผลิตโสตฯ',
      description: 'ส่งฟอร์มเสร็จสิ้น งานของท่านจะถูกส่งเข้าไปที่ "กระดานคัมบังงานผลิต" เพื่อให้หัวหน้าแผนกมอบหมายงานแก่เจ้าหน้าที่โสตฯ',
      icon: <ClipboardCheck className="text-blue-600" size={38} />,
      tips: [
        'ท่านสามารถเข้ามาตรวจสอบความคืบหน้าได้ตลอดเวลาตามสถานะขั้นตอน',
        'ขั้นตอนงานผลิต: เตรียมการผลิต ➔ กำลังผลิต/ออกแบบ ➔ รอตรวจแก้ไของาน ➔ ส่งมอบเสร็จสิ้น'
      ]
    }
  ];

  const generalSteps: TutorialStep[] = [
    {
      title: 'ระดับสิทธิ์ผู้ใช้',
      subtitle: 'ทำความเข้าใจบัญชีตัวอย่างเพื่อการทดสอบ',
      description: 'เพื่อให้ท่านเห็นภาพรวมระบบทั้งผู้ยืม, ผู้อนุมัติ และผู้ดูแลคลัง ระบบจึงมีผู้ใช้ 3 ระดับสิทธิ์ที่ตั้งค่าข้อมูลไว้ให้พร้อมใช้งานแล้ว',
      icon: <LogIn className="text-indigo-600" size={38} />,
      tips: [
        'สิทธิ์ Admin (ผู้ดูแลระบบ): สามารถปรับสต็อกอุปกรณ์ เพิ่ม/ลดครุภัณฑ์ ดูแลทำเนียบบุคลากร และปรับแก้ไขตั้งค่าทั่วไป',
        'สิทธิ์ Manager (หัวหน้าแผนก): มีสิทธิ์พิจารณาอนุมัติคำขอยืมของ ควบคุมงานผลิต และส่งซ่อมอุปกรณ์',
        'สิทธิ์ Staff (ผู้ใช้ทั่วไป): ยื่นคำขอยืม ตรวจสอบประวัติตัวเอง และดูรายงานสรุปสถิติต่างๆ'
      ]
    },
    {
      title: 'คัดลอกรหัสผ่าน',
      subtitle: 'วิธีการลงชื่อเข้าใช้งานสิทธิ์ต่างๆ',
      description: 'ในหน้า "ทำเนียบบุคลากร" (Staff Directory) จะมีกล่องประกาศสีฟ้าโดดเด่นด้านบน แสดงรหัสผ่านและอีเมลของแต่ละสิทธิ์การใช้งาน',
      icon: <Lightbulb className="text-indigo-600" size={38} />,
      tips: [
        'Admin: admin@taksin.hospital (รหัสผ่าน: admin123)',
        'Manager: manager@taksin.hospital (รหัสผ่าน: manager123)',
        'ท่านสามารถเปิด-ปิดสิทธิ์ หรือทดลองสลับบัญชีเพื่อทดสอบการอนุมัติรับ-คืนของ และการจัดคลังสินค้าได้อย่างอิสระ'
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
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white px-5 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all font-bold border border-emerald-500/30"
        >
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <HelpCircle size={15} className="relative text-white" />
          </span>
          <span className="text-sm tracking-wide">แนะนำการใช้งาน 📖</span>
        </motion.button>
      </div>

      {/* Tutorial Popup Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Click backdrop to close */}
            <div 
              className="fixed inset-0 z-45 bg-slate-900/40 backdrop-blur-xs transition-opacity"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              id="tutorial-popup-container"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="fixed inset-x-4 bottom-24 md:inset-x-auto md:right-6 md:bottom-24 w-auto md:w-[620px] bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden flex flex-col pointer-events-auto max-h-[80vh] md:max-h-none"
            >
              {/* Header */}
              <div className="p-5 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md">
                    <BookOpen size={20} className="animate-bounce" />
                  </div>
                  <div>
                    <span className="font-bold text-base block tracking-wide">คู่มือแนะนำการใช้งานระบบด่วน 💡</span>
                    <span className="text-xs text-green-100 font-light">เข้าใจง่าย รวดเร็ว พร้อมใช้งานจริงใน 1 นาที</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tabs with modern visual indicators */}
              <div className="flex border-b border-slate-100 p-1.5 bg-slate-50 gap-1 shrink-0">
                <button
                  onClick={() => changeTab('borrow')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'borrow' ? 'bg-white text-green-700 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>🛒 ยืม-คืนครุภัณฑ์</span>
                </button>
                <button
                  onClick={() => changeTab('media')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'media' ? 'bg-white text-blue-700 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>🎬 ส่งผลิตสื่อโสตฯ</span>
                </button>
                <button
                  onClick={() => changeTab('general')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'general' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>🔑 ระดับสิทธิ์ & การล็อกอิน</span>
                </button>
              </div>

              {/* Progress Stepper Line (ONLY shown if multiple steps exist) */}
              <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 w-full">
                  {currentSteps.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <button
                        onClick={() => setStepIndex(idx)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                          idx === stepIndex 
                            ? 'bg-emerald-600 text-white shadow-xs' 
                            : idx < stepIndex 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="hidden sm:inline text-[11px]">{step.title}</span>
                      </button>
                      {idx < currentSteps.length - 1 && (
                        <div className={`flex-1 h-[2px] ${idx < stepIndex ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Content Panel (Wider, beautifully padded, highly readable) */}
              <div className="p-6 flex-1 flex flex-col justify-between overflow-y-auto">
                {/* Step Info */}
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-16 h-16 bg-white border border-slate-200/60 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                      {currentStep.icon}
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                        {currentStep.subtitle}
                      </span>
                      <h4 className="font-bold text-slate-800 text-base leading-tight">
                        {currentStep.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed pt-1">
                        {currentStep.description}
                      </p>
                    </div>
                  </div>

                  {/* Tips and tricks with clean graphics */}
                  <div className="bg-gradient-to-b from-white to-slate-50/50 rounded-2xl p-4 border border-slate-200/60 space-y-3 shadow-xs">
                    <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                      <Sparkles size={14} className="text-amber-500 animate-spin" />
                      <span className="text-xs font-bold text-slate-700 tracking-wide">
                        ทริคแนะนำเพิ่มเติม & ข้อควรรู้
                      </span>
                    </div>
                    <ul className="space-y-2.5">
                      {currentStep.tips.map((tip, idx) => (
                        <li key={idx} className="text-[11.5px] text-slate-600 flex items-start gap-2 leading-relaxed">
                          <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
                  {/* Step counter */}
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-medium">
                      คู่มือหัวข้อ: <strong className="text-slate-800">{activeTab === 'borrow' ? 'ยืม-คืนครุภัณฑ์' : activeTab === 'media' ? 'ส่งผลิตสื่อโสตฯ' : 'การเข้าใช้งาน'}</strong>
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      ขั้นตอนที่ {stepIndex + 1} จากทั้งหมด {currentSteps.length} ขั้นตอน
                    </span>
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrev}
                      disabled={stepIndex === 0}
                      className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-transparent border border-slate-200"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {stepIndex < currentSteps.length - 1 ? (
                      <button
                        onClick={handleNext}
                        className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all"
                      >
                        <span>ถัดไป</span>
                        <ChevronRight size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsOpen(false)}
                        className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all flex items-center gap-1"
                      >
                        <span>เข้าใจแจ่มแจ้งแล้ว! 🎉</span>
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

