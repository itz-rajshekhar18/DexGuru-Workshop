'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import {
  Calendar, Clock, Timer, Video, Mail, Phone, Building2, MapPin, User,
  GraduationCap, BookOpen, Sparkles, Clipboard, FolderOpen, Target,
  CheckCircle, Users, Search, XCircle, BarChart3, FileText, TrendingUp,
  Monitor, MessageSquare, Download, FolderKanban, Cloud, UserCheck, 
  Lightbulb, Layers, Zap
} from 'lucide-react';
import { createPaymentOrder, verifyPayment } from '@/lib/api';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    school: '',
    city: '',
    subject: '',
    experience: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Matrix Rain Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const columns = Math.floor(canvas.width / 20);
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%&*+=<>[]{}!?';

    function draw() {
      if (!ctx || !canvas) return;
      
      ctx.fillStyle = 'rgba(17, 24, 39, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#fbbf24';
      ctx.font = '15px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 50);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.experience) {
      alert('Please fill in all required fields');
      return;
    }

    // Check if Razorpay is loaded
    if (!razorpayLoaded || typeof window.Razorpay === 'undefined') {
      alert('Payment gateway is loading. Please try again in a moment.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create payment order
      const orderResponse = await createPaymentOrder({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        school: formData.school,
        city: formData.city,
        subject: formData.subject,
        experience: formData.experience,
      });

      if (!orderResponse.success || !orderResponse.data) {
        throw new Error(orderResponse.message || 'Failed to create payment order');
      }

      const { razorpay_order_id, amount, currency, key_id, order_id } = orderResponse.data;

      // Configure Razorpay options
      const options: RazorpayOptions = {
        key: key_id,
        amount: amount,
        currency: currency,
        name: 'DexGuru AI Workshop',
        description: 'AI for Teachers Workshop Registration',
        order_id: razorpay_order_id,
        handler: async function (response: RazorpayResponse) {
          try {
            // Verify payment
            const verificationResponse = await verifyPayment({
              order_id: order_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verificationResponse.success) {
              setShowConfetti(true);
              alert('🎉 Payment Successful!\n\nWelcome to AI for Teachers Workshop!\nCheck your email for workshop details and resources.');
              
              // Reset form
              setFormData({
                name: '',
                email: '',
                phone: '',
                school: '',
                city: '',
                subject: '',
                experience: ''
              });
              
              setTimeout(() => setShowConfetti(false), 3000);
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support with your payment ID: ' + response.razorpay_payment_id);
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#fbbf24',
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
            alert('Payment cancelled. Please try again when ready.');
          },
        },
      };

      // Open Razorpay payment modal
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Razorpay Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
        onError={() => {
          console.error('Failed to load Razorpay script');
          alert('Payment gateway failed to load. Please refresh the page.');
        }}
      />
      
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Matrix Rain Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.3 }}
      />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-400/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-400/5 rounded-full filter blur-3xl animate-float"></div>
      </div>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 animate-confetti-fall rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                backgroundColor: ['#fbbf24', '#3b82f6', '#ffffff'][Math.floor(Math.random() * 3)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 2 + 3}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10">
        {/* Animated Sliding Banner Only */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-yellow-400/30 py-3 px-6 overflow-hidden relative">
          {/* Sliding Text Animation */}
          <div className="flex animate-slide-infinite">
            <div className="flex items-center gap-12 whitespace-nowrap">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center gap-12">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-yellow-400" size={16} />
                    <span className="text-white font-bold font-orbitron text-sm tracking-wider">AI-POWERED TIMETABLE SCHEDULING</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-blue-400" size={16} />
                    <span className="text-white font-bold font-orbitron text-sm tracking-wider">CUT PREP TIME BY 5+ HOURS/WEEK</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="text-green-400" size={16} />
                    <span className="text-white font-bold font-orbitron text-sm tracking-wider">FREE REUSABLE TEMPLATES</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="text-purple-400" size={16} />
                    <span className="text-white font-bold font-orbitron text-sm tracking-wider">LIVE 90-MIN HANDS-ON SESSION</span>
                  </div>
                  <span className="text-yellow-400 text-2xl">⚡</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* First Screen - Just Logo and Character */}
        <div className="container mx-auto px-6 relative flex items-center justify-center min-h-screen">
          {/* DexGuru Character Background - 50% opacity - LARGER */}
          <div className="absolute inset-0 flex items-center justify-center opacity-50 pointer-events-none">
            <Image
              src="/DexGuru-Char.PNG"
              alt="DexGuru Character"
              width={900}
              height={900}
              className="object-contain animate-float"
              priority
            />
          </div>

          {/* Just DexLabs Logo with Animated Frame - Moved Down */}
          <div className="relative z-20 text-center flex flex-col items-center mt-40">
            <div className="mb-8 relative">
              {/* Semi-Transparent Glowing Animated Frame - Yellow/Blue/Grey Theme */}
              <div className="relative p-8 rounded-3xl bg-gradient-to-br from-yellow-500/5 via-blue-500/5 to-gray-500/5 border-2 border-yellow-400/30 shadow-2xl animate-glow-border">
                {/* Corner Decorations - Mixed Colors */}
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-yellow-400/50 rounded-tl-2xl animate-pulse"></div>
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-400/50 rounded-tr-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-400/50 rounded-bl-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-yellow-400/50 rounded-br-2xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                
                {/* Side Accent Lines - Alternating Colors */}
                <div className="absolute top-1/2 -left-2 w-4 h-16 -translate-y-1/2 bg-gradient-to-r from-yellow-400/40 to-transparent animate-pulse"></div>
                <div className="absolute top-1/2 -right-2 w-4 h-16 -translate-y-1/2 bg-gradient-to-l from-blue-400/40 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                
                {/* Logo */}
                <div className="relative z-10 flex items-center justify-center">
                  <Image
                    src="/DexLabs.PNG"
                    alt="DexLabs"
                    width={400}
                    height={150}
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
            
            <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/50 px-6 py-3 rounded-full backdrop-blur-sm mb-16">
              <Sparkles className="text-yellow-400 animate-pulse" size={20} />
              <span className="text-yellow-400 font-bold font-space-grotesk tracking-wider text-sm">AI-POWERED TEACHING WORKSHOP</span>
            </div>
            
            {/* Scroll Indicator */}
            <div className="animate-bounce">
              <div className="w-6 h-10 border-2 border-yellow-400/50 rounded-full mx-auto flex items-start justify-center p-2">
                <div className="w-1.5 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-gray-400 text-xs mt-2 font-space-grotesk">Scroll Down</p>
            </div>
          </div>
        </div>

        {/* Workshop Details Box - Appears on Scroll */}
        <div className="container mx-auto px-6 py-20 relative">
          <div className="max-w-5xl mx-auto">
            {/* Contained Box with Workshop Details */}
            <div className="bg-gray-900/90 backdrop-blur-xl border-2 border-yellow-400/30 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-yellow-400/50"></div>
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-yellow-400/50"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-yellow-400/50"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-yellow-400/50"></div>

              <div className="relative z-10 text-center">
                {/* Main Heading */}
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-3 leading-tight font-orbitron">
                  TRANSFORM YOUR TEACHING WITH
                </h1>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-6 font-orbitron">
                  ARTIFICIAL INTELLIGENCE
                </h2>

                {/* Subheading */}
                <p className="text-sm md:text-base text-gray-300 mb-10 font-space-grotesk max-w-3xl mx-auto leading-relaxed">
                  Master AI tools for <span className="text-yellow-400 font-bold">lesson planning, homework creation, slide making</span>, and <span className="text-yellow-400 font-bold">timetable management</span> in just one session!
                </p>

                {/* Workshop Info Cards - 4 in a row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  {[
                    { icon: Calendar, label: 'DATE', value: 'June 14, 2026' },
                    { icon: Clock, label: 'TIME', value: '11:00 PM' },
                    { icon: Timer, label: 'DURATION', value: '3+ Hours' },
                    { icon: Video, label: 'PLATFORM', value: 'Zoom' }
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={i}
                        className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 p-4 rounded-xl hover:border-yellow-400/50 transition-all duration-300"
                      >
                        <div className="bg-yellow-400/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <Icon className="text-yellow-400" size={22} />
                        </div>
                        <p className="text-yellow-400 text-[10px] mb-1 font-bold font-space-grotesk uppercase tracking-wider">{item.label}</p>
                        <p className="text-white font-bold font-orbitron text-sm">{item.value}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Price Tag */}
                <div className="inline-block bg-gray-800/80 backdrop-blur-sm border-2 border-yellow-400 rounded-2xl px-10 py-6 mb-8">
                  <p className="text-gray-400 line-through text-lg font-space-grotesk">₹1,487</p>
                  <p className="text-6xl md:text-7xl font-black bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent font-orbitron">
                    ₹99
                  </p>
                  <p className="text-blue-400 font-bold text-sm font-space-grotesk mt-2">LIMITED TIME OFFER! 🚀</p>
                </div>

                {/* CTA Button */}
                <div>
                  <a 
                    href="#register"
                    className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-12 py-4 rounded-xl text-lg font-black hover:shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-105 font-orbitron tracking-wide"
                  >
                    REGISTER NOW →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Teaching Problems Section */}
        <div className="container mx-auto px-6 py-20 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 font-orbitron">
                TEACHING PREP IS <span className="text-red-400">BROKEN</span>
              </h2>
              <p className="text-gray-400 text-lg font-space-grotesk max-w-2xl mx-auto">
                You became a teacher to teach, not to fight formatting tools until midnight.
              </p>
            </div>

            {/* Problem Tags */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {[
                { text: 'Lesson prep', color: 'bg-yellow-400/20 border-yellow-400/50 text-yellow-400' },
                { text: 'Tab-switching', color: 'bg-yellow-400/20 border-yellow-400/50 text-yellow-400' },
                { text: 'Repetitive content', color: 'bg-red-400/20 border-red-400/50 text-red-400' },
                { text: 'Copy-paste teaching', color: 'bg-red-400/20 border-red-400/50 text-red-400' },
                { text: 'Formatting slides', color: 'bg-orange-400/20 border-orange-400/50 text-orange-400' },
                { text: 'Wasted evenings', color: 'bg-orange-400/20 border-orange-400/50 text-orange-400' },
                { text: 'Low engagement', color: 'bg-red-400/20 border-red-400/50 text-red-400' },
                { text: 'Homework chaos', color: 'bg-red-400/20 border-red-400/50 text-red-400' },
                { text: 'Generic AI tools', color: 'bg-orange-400/20 border-orange-400/50 text-orange-400' },
                { text: 'Overloaded', color: 'bg-red-400/20 border-red-400/50 text-red-400' },
                { text: 'Manual attendance', color: 'bg-red-400/20 border-red-400/50 text-red-400' },
                { text: 'Syllabus tracking', color: 'bg-orange-400/20 border-orange-400/50 text-orange-400' },
                { text: 'No structure', color: 'bg-red-400/20 border-red-400/50 text-red-400' },
                { text: 'Burnout', color: 'bg-orange-400/20 border-orange-400/50 text-orange-400' }
              ].map((tag, i) => (
                <div
                  key={i}
                  className={`${tag.color} px-4 py-2 rounded-full border text-sm font-bold font-space-grotesk flex items-center gap-2`}
                >
                  <span className="text-red-400">✕</span>
                  {tag.text}
                </div>
              ))}
            </div>

            {/* AI Solutions Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: BookOpen,
                  title: 'AI Lesson Decks',
                  desc: 'Turn any chapter into a structured, teaching-ready deck with objectives, activities & assessments.',
                  color: 'from-blue-500 to-blue-600'
                },
                {
                  icon: FolderOpen,
                  title: 'Manage Classes',
                  desc: 'Track multiple classes, set reminders, and organise your semester in one view.',
                  color: 'from-yellow-400 to-yellow-500'
                },
                {
                  icon: Target,
                  title: 'Set Goals',
                  desc: 'Target syllabus milestones or revision deadlines and track progress.',
                  color: 'from-green-500 to-green-600'
                },
                {
                  icon: Clipboard,
                  title: 'Attendance',
                  desc: 'One-tap attendance tracking with instant reports & analytics.',
                  color: 'from-purple-500 to-purple-600'
                },
                {
                  icon: Clock,
                  title: 'Timetable Strategy',
                  desc: 'Personalised schedule planning that fits your teaching style and subject load.',
                  color: 'from-orange-500 to-orange-600'
                },
                {
                  icon: Search,
                  title: 'Find, Compare & Apply Tools',
                  desc: 'Discover the right AI features for your classroom. Compare and start using in minutes.',
                  color: 'from-pink-500 to-pink-600'
                }
              ].map((solution, i) => {
                const Icon = solution.icon;
                return (
                  <div
                    key={i}
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 p-6 rounded-2xl hover:border-yellow-400/50 transition-all duration-300 hover:scale-105"
                  >
                    <div className={`bg-gradient-to-r ${solution.color} w-16 h-16 rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className="text-white" size={32} />
                    </div>
                    <h3 className="text-xl font-black text-white mb-3 font-orbitron">{solution.title}</h3>
                    <p className="text-gray-400 text-sm font-space-grotesk leading-relaxed">{solution.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Workflow Transformation Comparison Table */}
        <div className="container mx-auto px-6 py-20 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-4">
              <div className="inline-block bg-orange-400/10 border border-orange-400/50 px-5 py-2 rounded-full mb-6">
                <span className="text-orange-400 font-bold font-space-grotesk tracking-wider text-xs uppercase">Workflow Transformation</span>
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-center mb-4 font-orbitron">
              HOW DEXGURU <span className="text-yellow-400">REDEFINES</span> YOUR DAY
            </h2>
            <p className="text-gray-400 text-center mb-12 font-space-grotesk max-w-3xl mx-auto">
              A side-by-side comparison of the traditional, manual teaching workflow versus the streamlined DexGuru approach.
            </p>

            {/* Comparison Table */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-700/50">
                <div className="bg-gray-800/80 p-4">
                  <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider font-space-grotesk">WORKFLOW / FEATURE</h3>
                </div>
                <div className="bg-gray-800/80 p-4">
                  <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider font-space-grotesk">THE OLD, MANUAL WAY</h3>
                </div>
                <div className="bg-gray-800/80 p-4">
                  <h3 className="text-yellow-400 font-bold text-xs uppercase tracking-wider font-space-grotesk">WITH DEXGURU</h3>
                </div>
              </div>

              {/* Table Rows */}
              {[
                {
                  icon: Clock,
                  feature: 'Time Savings',
                  old: 'Spending 10+ hours/week on attendance logging, homework checking, and lesson formatting.',
                  new: 'Save 5-10 hours every week on attendance, homework, and lesson planning.'
                },
                {
                  icon: BarChart3,
                  feature: 'Class Control',
                  old: 'Scattered spreadsheets, paper gradebooks, and switching between 4 different tabs.',
                  new: 'Manage all classes, subjects, timetables, and student records from one dashboard.'
                },
                {
                  icon: FileText,
                  feature: 'Resource Creation',
                  old: 'Staring at blank docs, scouring Google, and copying templates for worksheets.',
                  new: 'AI-powered lesson plans, worksheets, tests, and study materials in seconds.'
                },
                {
                  icon: TrendingUp,
                  feature: 'Progress Tracking',
                  old: 'Chasing lost homework logs and guessing syllabus completion rates manually.',
                  new: 'Track attendance, syllabus progress, homework completion, and student engagement.'
                },
                {
                  icon: BarChart3,
                  feature: 'Teacher Analytics',
                  old: 'Manually compiling test scores, missing performance drop-offs until it\'s too late.',
                  new: 'Smart teacher analytics to identify trends and improve classroom performance.'
                },
                {
                  icon: Monitor,
                  feature: 'Digital Whiteboard',
                  old: 'Rewriting notes on physical boards, lost sketches, and constant board wiping.',
                  new: 'Digital whiteboard with notes, summaries, revisions, and teaching tools.'
                },
                {
                  icon: MessageSquare,
                  feature: 'Communication',
                  old: 'Clunky parent WhatsApp groups, delayed emails, and lost message threads.',
                  new: 'Seamless communication with students, parents, and fellow teachers.'
                },
                {
                  icon: Download,
                  feature: 'Data Export',
                  old: 'Retyping paper logs into spreadsheets or manual copy-pasting for administration.',
                  new: 'Export attendance and reports in Excel/CSV for school records.'
                },
                {
                  icon: FolderKanban,
                  feature: 'Homework System',
                  old: 'Piles of paper notebooks, loose worksheets, and disorganized deadline calendars.',
                  new: 'Organized homework management with submission tracking and deadlines.'
                },
                {
                  icon: Cloud,
                  feature: 'Cloud Access',
                  old: 'Slides stuck on a classroom PC, carrying USB drives, and no home access.',
                  new: 'Secure cloud access from anywhere, anytime.'
                }
              ].map((row, i) => {
                const Icon = row.icon;
                return (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-700/50">
                    {/* Feature */}
                    <div className="bg-gray-800/60 p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-700 p-2 rounded-lg">
                          <Icon className="text-gray-400" size={18} />
                        </div>
                        <span className="text-white font-semibold text-sm font-space-grotesk">{row.feature}</span>
                      </div>
                    </div>

                    {/* Old Way */}
                    <div className="bg-gray-800/60 p-4">
                      <div className="flex items-start gap-2">
                        <XCircle className="text-red-400 flex-shrink-0 mt-0.5" size={16} />
                        <p className="text-gray-400 text-xs font-space-grotesk leading-relaxed">{row.old}</p>
                      </div>
                    </div>

                    {/* New Way */}
                    <div className="bg-gray-800/60 p-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={16} />
                        <p className="text-gray-300 text-xs font-space-grotesk leading-relaxed font-medium">{row.new}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA after table */}
            <div className="text-center mt-12">
              <p className="text-2xl text-yellow-400 font-black mb-6 font-orbitron">
                READY TO TRANSFORM YOUR TEACHING WORKFLOW?
              </p>
              <a 
                href="#register"
                className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-10 py-4 rounded-xl text-lg font-black hover:shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-105 font-orbitron tracking-wide"
              >
                JOIN THE WORKSHOP NOW →
              </a>
            </div>
          </div>
        </div>

        {/* Is This For You Section */}
        <div className="container mx-auto px-6 py-20 relative">
          <div className="max-w-7xl mx-auto">
            <div className="mb-4">
              <p className="text-orange-400 font-black text-xs uppercase tracking-widest mb-3 font-orbitron">IS THIS FOR YOU?</p>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-16 font-orbitron">
              This workshop is built for a <span className="text-yellow-400">specific teacher</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  tag: 'THE PREP-HEAVY TEACHER',
                  title: 'Fed up with manual lesson prep',
                  desc: 'Spends hours typing worksheets, planning syllabi, and formatting slides. Wants to save 5-10 hours every week.',
                  tagColor: 'text-orange-400 border-orange-400/50 bg-orange-400/10',
                  icon: UserCheck,
                  iconColor: 'from-orange-500 to-orange-600'
                },
                {
                  tag: 'THE AI-READY EDUCATOR',
                  title: 'Looking to grow using AI',
                  desc: 'Eager to integrate artificial intelligence in the classroom but wants practical, step-by-step skills rather than theoretical lectures.',
                  tagColor: 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10',
                  icon: Lightbulb,
                  iconColor: 'from-yellow-400 to-yellow-500'
                },
                {
                  tag: 'THE BUSY COORDINATOR',
                  title: 'Managing multiple classes',
                  desc: 'Responsible for multiple subjects, timetables, and student records. Needs a single dashboard to stay organized.',
                  tagColor: 'text-orange-400 border-orange-400/50 bg-orange-400/10',
                  icon: Layers,
                  iconColor: 'from-blue-500 to-blue-600'
                },
                {
                  tag: 'THE SPEED-FOCUSED TUTOR',
                  title: 'Needs templates fast',
                  desc: 'Wants premium lesson plans, worksheets, and study materials in seconds without formatting hassle.',
                  tagColor: 'text-orange-400 border-orange-400/50 bg-orange-400/10',
                  icon: Zap,
                  iconColor: 'from-purple-500 to-purple-600'
                }
              ].map((teacher, i) => {
                const Icon = teacher.icon;
                return (
                  <div
                    key={i}
                    className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105"
                  >
                    {/* Icon Container */}
                    <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl h-48 mb-6 flex items-center justify-center overflow-hidden">
                      <div className={`bg-gradient-to-r ${teacher.iconColor} w-24 h-24 rounded-full flex items-center justify-center`}>
                        <Icon className="text-white" size={48} />
                      </div>
                    </div>

                    <div className={`${teacher.tagColor} px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider mb-4 inline-block font-orbitron`}>
                      {teacher.tag}
                    </div>

                    <h3 className="text-xl font-black text-white mb-4 font-orbitron">{teacher.title}</h3>
                    <p className="text-gray-400 text-sm font-space-grotesk leading-relaxed">{teacher.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Compact Registration Form at Bottom */}
        <div id="register" className="bg-gray-900/95 backdrop-blur-lg py-12 px-6 relative border-t-2 border-yellow-400/30">
          <div className="absolute inset-0 tech-grid opacity-10"></div>
          
          <div className="container mx-auto max-w-2xl relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-white mb-3 font-orbitron tracking-tight">
                SECURE YOUR <span className="text-yellow-400 animate-neon-glow">SPOT</span>
              </h2>
              <p className="text-gray-400 font-space-grotesk">Register now - Limited seats available!</p>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-gray-300 text-xs font-bold mb-2 font-space-grotesk uppercase tracking-wide">
                  <User size={16} />
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-gray-800/70 border border-gray-700 rounded-lg text-white text-sm focus:border-yellow-400 focus:outline-none transition-all font-space-grotesk"
                  placeholder="Your name"
                  suppressHydrationWarning
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-gray-300 text-xs font-bold mb-2 font-space-grotesk uppercase tracking-wide">
                  <Mail size={16} />
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 bg-gray-800/70 border border-gray-700 rounded-lg text-white text-sm focus:border-yellow-400 focus:outline-none transition-all font-space-grotesk"
                  placeholder="your@email.com"
                  suppressHydrationWarning
                />
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-gray-300 text-xs font-bold mb-2 font-space-grotesk uppercase tracking-wide">
                  <Phone size={16} />
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 bg-gray-800/70 border border-gray-700 rounded-lg text-white text-sm focus:border-yellow-400 focus:outline-none transition-all font-space-grotesk"
                  placeholder="+91 9876543210"
                  suppressHydrationWarning
                />
              </div>

              {/* School */}
              <div>
                <label className="flex items-center gap-2 text-gray-300 text-xs font-bold mb-2 font-space-grotesk uppercase tracking-wide">
                  <Building2 size={16} />
                  School
                </label>
                <input
                  type="text"
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  className="w-full p-3 bg-gray-800/70 border border-gray-700 rounded-lg text-white text-sm focus:border-yellow-400 focus:outline-none transition-all font-space-grotesk"
                  placeholder="Institution (optional)"
                  suppressHydrationWarning
                />
              </div>

              {/* City */}
              <div>
                <label className="flex items-center gap-2 text-gray-300 text-xs font-bold mb-2 font-space-grotesk uppercase tracking-wide">
                  <MapPin size={16} />
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-3 bg-gray-800/70 border border-gray-700 rounded-lg text-white text-sm focus:border-yellow-400 focus:outline-none transition-all font-space-grotesk"
                  placeholder="Your city (optional)"
                  suppressHydrationWarning
                />
              </div>

              {/* Subject */}
              <div>
                <label className="flex items-center gap-2 text-gray-300 text-xs font-bold mb-2 font-space-grotesk uppercase tracking-wide">
                  <BookOpen size={16} />
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full p-3 bg-gray-800/70 border border-gray-700 rounded-lg text-white text-sm focus:border-yellow-400 focus:outline-none transition-all font-space-grotesk"
                  placeholder="Subject taught (optional)"
                  suppressHydrationWarning
                />
              </div>

              {/* Experience */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-gray-300 text-xs font-bold mb-2 font-space-grotesk uppercase tracking-wide">
                  <GraduationCap size={16} />
                  Teaching Experience
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full p-3 bg-gray-800/70 border border-gray-700 rounded-lg text-white text-sm focus:border-yellow-400 focus:outline-none transition-all font-space-grotesk"
                  suppressHydrationWarning
                >
                  <option value="" className="bg-gray-800">Select experience</option>
                  <option value="0-2" className="bg-gray-800">0-2 years</option>
                  <option value="3-5" className="bg-gray-800">3-5 years</option>
                  <option value="6-10" className="bg-gray-800">6-10 years</option>
                  <option value="10+" className="bg-gray-800">10+ years</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full p-4 font-black bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl hover:shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed font-orbitron tracking-wider border-2 border-yellow-300 text-lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                      PROCESSING...
                    </span>
                  ) : (
                    'PAY ₹99 & REGISTER NOW 🚀'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer with DexGuru Logo */}
        <div className="bg-gradient-to-t from-gray-900 to-gray-800 border-t-2 border-yellow-400/30 py-8 px-6 relative">
          <div className="absolute inset-0 tech-grid opacity-10"></div>
          
          <div className="container mx-auto text-center relative z-10">
            {/* DexGuru Logo */}
            <div className="flex justify-center mb-6 animate-fade-in">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-yellow-400/20">
                <Image
                  src="/DexGuru-Logo.jpeg"
                  alt="DexGuru Logo"
                  width={200}
                  height={80}
                  className="object-contain"
                />
              </div>
            </div>
            
            <p className="text-gray-400 mb-4 font-space-grotesk tracking-wide text-sm">
              Empowering teachers with <span className="text-yellow-400">AI-powered tools</span> for modern education
            </p>
            <div className="flex items-center justify-center gap-6 text-gray-500 text-xs font-space-grotesk">
              <span>© 2026 DexGuru</span>
              <span className="text-yellow-400">|</span>
              <span>All Rights Reserved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
