import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  CloudUpload,
  LockKeyhole,
  Mail,
  Phone,
  Menu,
  X,
  DatabaseZap,
  Fingerprint,
  FileLock2,
  ScanSearch,
  Users,
  User,
  Briefcase,
  ArrowRight,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Clock,
  Globe,
  Shield as ShieldIcon,
  CheckCircle,
  Send,
  Play,
  Pause,
  Volume2,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { COLORS, STYLES } from "../../styles/constants";
import { Button, Card } from "../common";
import Navbar from "./Navbar";

// Unified Features Section Component
const UnifiedFeaturesSection = ({ isDarkMode }) => {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Unbreakable Security',
      subtitle: 'Military-Grade Protection',
      description: 'Your data is secured with AES-256 encryption, ensuring your digital identity is locked and protected at all times.',
      gradient: 'linear-gradient(135deg, #0052D4, #4364F7, #6FB1FC)',
      highlight: 'AES-256'
    },
    {
      icon: ScanSearch,
      title: 'Effortless Functionality',
      subtitle: 'Simple 4-Step Process',
      description: 'Quickly upload, organize, and retrieve documents using our intuitive, AI-enhanced categorization system.',
      gradient: 'linear-gradient(135deg, #4fd1c5, #81e6d9)',
      highlight: 'AI-enhanced'
    },
    {
      icon: CloudUpload,
      title: 'Universal Accessibility',
      subtitle: 'Access Your Vault Anywhere',
      description: 'Retrieve your files instantly from any device, anytime you need them, without compromising on security or speed.',
      gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
      highlight: 'instantly'
    }
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="py-24 relative overflow-hidden"
      style={{
        background: isDarkMode ? 'linear-gradient(180deg, #1f2937, #374151)' : 'linear-gradient(180deg, #f3f4f6, #e0e7ff)',
        padding: '100px 0'
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Enhanced Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 
            className="text-6xl font-extrabold mb-8"
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 800,
              color: '#1a1a1a',
              textAlign: 'center',
              textShadow: '0 4px 8px rgba(0,0,0,0.1)',
              lineHeight: 1.2
            }}
          >
            Why Choose SecureVault?
          </h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg leading-relaxed max-w-4xl mx-auto mb-16"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              color: '#334155',
              fontSize: '1.1rem',
              textAlign: 'center',
              maxWidth: '900px',
              margin: '0 auto 60px',
              lineHeight: 1.7
            }}
          >
            SecureVault delivers the essential trifecta: Protection, Simplicity, and Access. Our comprehensive platform offers enterprise-grade protection with a consumer-friendly design, ensuring your documents are safe and always instantly accessible.
          </motion.p>
        </motion.div>

        {/* Enhanced 3-Column Layout with Visual Hierarchy */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isSecurityCard = index === 0;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  ease: [0.175, 0.885, 0.32, 1.275]
                }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: '0 0 30px rgba(114, 9, 183, 0.4)'
                }}
                className="relative rounded-2xl transition-all duration-500 ease-out group cursor-pointer overflow-hidden"
                style={{
                  padding: '25px 20px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
                }}
              >
                {/* Dynamic Animated Background */}
                <motion.div 
                  className="absolute inset-0"
                  animate={{
                    background: [
                      'linear-gradient(135deg, #3a0ca3, #7209b7, #8b5cf6)',
                      'linear-gradient(135deg, #7209b7, #8b5cf6, #a855f7)',
                      'linear-gradient(135deg, #8b5cf6, #a855f7, #3a0ca3)'
                    ]
                  }}
                  transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                />
                {/* Floating Particles */}
                <div className="absolute inset-0">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white/20 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, -15, 0],
                        opacity: [0.2, 0.6, 0.2],
                        scale: [1, 1.3, 1]
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2
                      }}
                    />
                  ))}
                </div>
                {/* Animated Gradient Overlay */}
                <motion.div 
                  className="absolute inset-0"
                  animate={{
                    background: [
                      'radial-gradient(circle at 20% 80%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)',
                      'radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
                      'radial-gradient(circle at 40% 40%, rgba(114, 9, 183, 0.3) 0%, transparent 50%)'
                    ]
                  }}
                  transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
                />
                {/* Glowing background effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)'
                  }}
                />
                
                <motion.div 
                  className="relative z-10 text-center"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="mb-6 flex justify-center"
                    whileHover={{ 
                      rotate: [0, -10, 10, 0],
                      scale: 1.1
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon 
                      className="w-20 h-20 transition-all duration-300"
                      style={{ 
                        color: '#E0E7FF',
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
                      }}
                    />
                  </motion.div>
                  
                  <motion.h3 
                    className="font-bold mb-4 text-3xl"
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: 800,
                      textShadow: '2px 3px 8px rgba(0, 0, 0, 0.3)',
                      color: 'white',
                      fontFamily: 'Poppins, sans-serif'
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {feature.title}
                  </motion.h3>
                  
                  <p 
                    className="font-medium mb-4 text-base"
                    style={{
                      color: '#E0E7FF',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    {feature.subtitle}
                  </p>
                  
                  <motion.div
                    className="relative"
                    whileHover={{ y: -2 }}
                  >
                    <p 
                      className="leading-relaxed text-lg"
                      style={{
                        color: '#E0E7FF',
                        fontSize: '1.1rem',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      {feature.description.replace(feature.highlight, '')}
                      <span 
                        className="font-bold"
                        style={{ color: '#E0E7FF' }}
                      >
                        {feature.highlight}
                      </span>
                      {feature.description.split(feature.highlight)[1]}
                    </p>
                    
                    {/* Animated underline */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-white/30"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.4 }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};

// Enhanced Feature Cards Section
const EnhancedFeatureCards = ({ isDarkMode }) => {
  return (
    <section className={`py-24 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="space-y-24">
          {/* How It Works Section */}
          <motion.div 
            id="functionality"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl overflow-hidden shadow-2xl relative"
          >
            {/* Dynamic Animated Background */}
            <motion.div 
              className="absolute inset-0"
              animate={{
                background: [
                  'linear-gradient(135deg, #3b82f6, #60a5fa, #93c5fd)',
                  'linear-gradient(135deg, #60a5fa, #93c5fd, #bfdbfe)',
                  'linear-gradient(135deg, #93c5fd, #bfdbfe, #3b82f6)'
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
            />
            {/* Floating Particles */}
            <div className="absolute inset-0">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/20 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.2, 0.6, 0.2],
                    scale: [1, 1.3, 1]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
            {/* Animated Gradient Overlay */}
            <motion.div 
              className="absolute inset-0"
              animate={{
                background: [
                  'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 40% 40%, rgba(30, 58, 138, 0.3) 0%, transparent 50%)'
                ]
              }}
              transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] relative z-10">
              <div className="p-12 flex flex-col justify-center">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-4xl font-bold mb-4" style={{ color: COLORS.black, fontFamily: 'Inter, sans-serif' }}>
                      How It Works
                    </h2>
                    <p className="text-lg leading-relaxed" style={{ color: COLORS.black, fontFamily: 'Lato, sans-serif' }}>
                      Transform your document security with our revolutionary 4-step process. Experience military-grade protection with consumer-friendly simplicity.
                    </p>
                  </div>
                  <button className="inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors w-fit" style={{ backgroundColor: COLORS.primary, color: COLORS.white }}>
                    More about secure storage
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="relative p-8">
                <div className="relative h-full rounded-2xl overflow-hidden">
                  <img src="https://media.istockphoto.com/id/1552881556/photo/tablet-designer-and-serious-woman-research-in-business-startup-office-at-night-on-deadline.webp?a=1&b=1&s=612x612&w=0&k=20&c=BcvnTOdxmot9qj2oF8meLUOVuBh7HBnrSQ93NqFzAFA=" alt="Professional working on tablet in office" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10" />
                  <AutoAnimatedHowItWorksCards />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Security Section */}
          <motion.div 
            id="security"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl overflow-hidden shadow-2xl relative"
          >
            {/* Dynamic Animated Background */}
            <motion.div 
              className="absolute inset-0"
              animate={{
                background: [
                  'linear-gradient(135deg, #f97316, #fb923c, #fdba74)',
                  'linear-gradient(135deg, #fb923c, #fdba74, #fed7aa)',
                  'linear-gradient(135deg, #fdba74, #fed7aa, #f97316)'
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
            />
            {/* Floating Particles */}
            <div className="absolute inset-0">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/20 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.2, 0.6, 0.2],
                    scale: [1, 1.3, 1]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
            {/* Animated Gradient Overlay */}
            <motion.div 
              className="absolute inset-0"
              animate={{
                background: [
                  'radial-gradient(circle at 20% 80%, rgba(249, 115, 22, 0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 20%, rgba(234, 88, 12, 0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 40% 40%, rgba(194, 65, 12, 0.3) 0%, transparent 50%)'
                ]
              }}
              transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] relative z-10">
              <div className="relative p-8">
                <div className="relative h-full rounded-2xl overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop&crop=center" alt="Security and encryption" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
                  <AutoAnimatedSecurityCards />
                </div>
              </div>
              <div className="p-12 flex flex-col justify-center">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-4xl font-bold mb-4" style={{ color: COLORS.black, fontFamily: 'Inter, sans-serif' }}>
                      Your Security is Our Priority
                    </h2>
                    <p className="text-lg leading-relaxed" style={{ color: COLORS.black, fontFamily: 'Lato, sans-serif' }}>
                      Military-grade protection meets user-friendly design. Experience uncompromising security without sacrificing convenience.
                    </p>
                  </div>
                  <button className="inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors w-fit" style={{ backgroundColor: COLORS.primary, color: COLORS.white }}>
                    Learn about our security
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Accessibility Section */}
          <motion.div 
            id="accessibility"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl overflow-hidden shadow-2xl relative"
          >
            {/* Dynamic Animated Background */}
            <motion.div 
              className="absolute inset-0"
              animate={{
                background: [
                  'linear-gradient(135deg, #a855f7, #c084fc, #ddd6fe)',
                  'linear-gradient(135deg, #c084fc, #ddd6fe, #ede9fe)',
                  'linear-gradient(135deg, #ddd6fe, #ede9fe, #a855f7)'
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
            />
            {/* Floating Particles */}
            <div className="absolute inset-0">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/20 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.2, 0.6, 0.2],
                    scale: [1, 1.3, 1]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
            {/* Animated Gradient Overlay */}
            <motion.div 
              className="absolute inset-0"
              animate={{
                background: [
                  'radial-gradient(circle at 20% 80%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 40% 40%, rgba(124, 45, 146, 0.3) 0%, transparent 50%)'
                ]
              }}
              transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] relative z-10">
              <div className="p-12 flex flex-col justify-center">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-4xl font-bold mb-4" style={{ color: COLORS.black, fontFamily: 'Inter, sans-serif' }}>
                      A Secure Vault for Everyone
                    </h2>
                    <p className="text-lg leading-relaxed" style={{ color: COLORS.black, fontFamily: 'Lato, sans-serif' }}>
                      Whether you're an individual, freelancer, or part of an admin team, our secure vault adapts to your needs with enterprise-grade protection.
                    </p>
                  </div>
                  <button className="inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors w-fit" style={{ backgroundColor: COLORS.primary, color: COLORS.white }}>
                    Choose your plan
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="relative p-8">
                <div className="relative h-full rounded-2xl overflow-hidden">
                  <img src="https://media.istockphoto.com/id/1291751221/photo/the-sales-department-scores-again.webp?a=1&b=1&s=612x612&w=0&k=20&c=eLEEzx6Bt0-Y3Cj2QKudklHo9sBd4vzXO4Fvt9eLzjk=" alt="Digital Security Lock" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10" />
                  <AutoAnimatedVaultCards />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Card-only components for unified section
const AutoAnimatedHowItWorksCards = () => {
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [animationPhase, setAnimationPhase] = useState('clumpy');

  const steps = [
    { icon: User, title: "Create Account", description: "Sign up with secure credentials and verification", color: "#0061FF" },
    { icon: CloudUpload, title: "Upload & Encrypt", description: "Drag and drop files into secure portal with AES-256", color: "#0061FF" },
    { icon: ScanSearch, title: "Organize & Find", description: "AI-powered categorization with lightning-fast search", color: "#0061FF" },
    { icon: FileLock2, title: "Access & Control", description: "Access from any device with biometric authentication", color: "#0061FF" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (animationPhase === 'clumpy') {
        setVisibleSteps([0, 1, 2, 3]);
        setTimeout(() => setAnimationPhase('expanding'), 1000);
      } else if (animationPhase === 'expanding') {
        setVisibleSteps(prev => {
          if (prev.length === steps.length) {
            setTimeout(() => setAnimationPhase('shrinking'), 3000);
            return prev;
          }
          return prev;
        });
      } else {
        setAnimationPhase('clumpy');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [animationPhase, steps.length]);

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ marginTop: '120px' }}>
      <div className="relative">
        {visibleSteps.map((stepIndex, displayIndex) => {
          const step = steps[stepIndex];
          const Icon = step.icon;
          const isClumpy = animationPhase === 'clumpy' || animationPhase === 'shrinking';
          
          return (
            <motion.div
              key={`${stepIndex}-${displayIndex}`}
              initial={{ opacity: 0.8 }}
              animate={{ 
                opacity: isClumpy ? (displayIndex === 0 ? 1 : 0.85 - (displayIndex * 0.15)) : 1,
                y: isClumpy ? displayIndex * 8 : displayIndex * -120,
                x: 0, rotate: 0,
                scale: isClumpy ? 1 - (displayIndex * 0.04) : 1,
                zIndex: isClumpy ? steps.length - displayIndex : displayIndex
              }}
              transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
              className="absolute bg-white rounded-xl p-4 shadow-lg"
              style={{ 
                backgroundColor: COLORS.white, border: `1px solid #E5E7EB`,
                width: '320px', left: '-160px',
                pointerEvents: isClumpy && displayIndex > 0 ? 'none' : 'auto'
              }}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: `${step.color}15` }}>
                  <Icon className="w-5 h-5" style={{ color: step.color }} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-base mb-1" style={{ color: COLORS.black, fontFamily: 'Inter, sans-serif' }}>
                    {step.title}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: COLORS.darkGray, fontFamily: 'Lato, sans-serif' }}>
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const AutoAnimatedSecurityCards = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const steps = [
    { icon: ShieldCheck, title: "End-to-End Encryption", description: "AES-256 military-grade encryption ensures only you can access your files. Zero-knowledge architecture means even we can't see your data.", details: "• Advanced encryption algorithms\n• Client-side encryption keys\n• Secure key management\n• No backdoors or master keys", color: "#0061FF" },
    { icon: Fingerprint, title: "Multi-Factor Authentication", description: "Biometric authentication, SMS codes, and authenticator apps provide multiple layers of security for your account.", details: "• Fingerprint & Face ID support\n• SMS & Email verification\n• TOTP authenticator apps\n• Hardware security keys", color: "#0061FF" },
    { icon: DatabaseZap, title: "Real-time Monitoring", description: "24/7 threat detection and anomaly monitoring protect your data from unauthorized access attempts and breaches.", details: "• AI-powered threat detection\n• Suspicious activity alerts\n• Login attempt monitoring\n• Automated security responses", color: "#0061FF" },
    { icon: LockKeyhole, title: "Compliance & Auditing", description: "SOC 2, GDPR, and HIPAA compliant infrastructure with regular third-party security audits and certifications.", details: "• SOC 2 Type II certified\n• GDPR & HIPAA compliant\n• Regular security audits\n• Penetration testing", color: "#0061FF" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard(prev => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative" style={{ perspective: '1000px' }}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentCard;
          
          return (
            <motion.div
              key={index}
              initial={{ rotateY: 0, opacity: 0 }}
              animate={{ 
                rotateY: isActive ? 0 : index < currentCard ? -180 : 180,
                opacity: isActive ? 1 : 0.3, scale: isActive ? 1 : 0.8,
                zIndex: isActive ? 10 : index
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute bg-white rounded-xl p-6 shadow-xl"
              style={{ 
                backgroundColor: COLORS.white, border: `1px solid #E5E7EB`,
                width: '420px', height: '320px', left: '-210px', top: '-160px',
                transformStyle: 'preserve-3d'
              }}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="p-3 rounded-lg flex-shrink-0" style={{ backgroundColor: `${step.color}15` }}>
                    <Icon className="w-6 h-6" style={{ color: step.color }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-xl mb-3" style={{ color: COLORS.black, fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                      {step.title}
                    </h4>
                    <p className="text-base leading-relaxed mb-4 font-medium" style={{ color: COLORS.black, fontFamily: 'Lato, sans-serif', fontWeight: 500 }}>
                      {step.description}
                    </p>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm leading-relaxed whitespace-pre-line font-medium" style={{ color: COLORS.black, fontFamily: 'Lato, sans-serif', fontWeight: 500 }}>
                    {step.details}
                  </div>
                </div>
                <div className="flex justify-center mt-3">
                  <div className="flex space-x-1">
                    {steps.map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: i === currentCard ? step.color : '#E5E7EB' }} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const AutoAnimatedVaultCards = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const steps = [
    { icon: User, title: "For Individuals", description: "Secure personal documents with biometric vault protection", color: "#0061FF" },
    { icon: Briefcase, title: "For Freelancers", description: "Store client contracts and invoices in organized workspace", color: "#0061FF" },
    { icon: Users, title: "For Admin Teams", description: "Manage company documents with robust admin controls", color: "#0061FF" }
  ];

  useEffect(() => {
    const showCards = () => {
      setVisibleCards([]);
      steps.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards(prev => [...prev, index]);
        }, index * 600);
      });
      
      setTimeout(() => {
        steps.forEach((_, index) => {
          setTimeout(() => {
            setVisibleCards(prev => prev.filter(i => i !== index));
          }, index * 400);
        });
        setTimeout(() => showCards(), steps.length * 400 + 1000);
      }, steps.length * 600 + 2000);
    };
    showCards();
  }, [steps.length]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isVisible = visibleCards.includes(index);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ 
                opacity: isVisible ? 1 : 0,
                y: isVisible ? index * -110 : 20,
                scale: isVisible ? 1 : 0.95
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute bg-white rounded-xl p-4 shadow-lg"
              style={{ 
                backgroundColor: COLORS.white, border: `1px solid #E5E7EB`,
                width: '320px', left: '-160px', top: '100px',
                display: isVisible ? 'block' : 'none'
              }}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: `${step.color}15` }}>
                  <Icon className="w-5 h-5" style={{ color: step.color }} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-base mb-1" style={{ color: COLORS.black, fontFamily: 'Inter, sans-serif' }}>
                    {step.title}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: COLORS.darkGray, fontFamily: 'Lato, sans-serif' }}>
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Auto-Animated Security Features Component
const AutoAnimatedSecurityFeatures = () => {
  const [currentCard, setCurrentCard] = useState(0);

  const steps = [
    {
      icon: ShieldCheck,
      title: "End-to-End Encryption",
      description: "AES-256 military-grade encryption ensures only you can access your files. Zero-knowledge architecture means even we can't see your data.",
      details: "• Advanced encryption algorithms\n• Client-side encryption keys\n• Secure key management\n• No backdoors or master keys",
      color: "#0061FF"
    },
    {
      icon: Fingerprint,
      title: "Multi-Factor Authentication",
      description: "Biometric authentication, SMS codes, and authenticator apps provide multiple layers of security for your account.",
      details: "• Fingerprint & Face ID support\n• SMS & Email verification\n• TOTP authenticator apps\n• Hardware security keys",
      color: "#0061FF"
    },
    {
      icon: DatabaseZap,
      title: "Real-time Monitoring",
      description: "24/7 threat detection and anomaly monitoring protect your data from unauthorized access attempts and breaches.",
      details: "• AI-powered threat detection\n• Suspicious activity alerts\n• Login attempt monitoring\n• Automated security responses",
      color: "#0061FF"
    },
    {
      icon: LockKeyhole,
      title: "Compliance & Auditing",
      description: "SOC 2, GDPR, and HIPAA compliant infrastructure with regular third-party security audits and certifications.",
      details: "• SOC 2 Type II certified\n• GDPR & HIPAA compliant\n• Regular security audits\n• Penetration testing",
      color: "#0061FF"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard(prev => (prev + 1) % steps.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl overflow-hidden shadow-2xl"
          style={{ backgroundColor: '#FFE5CC' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            {/* Left Column - Image with Cards */}
            <div className="relative p-8">
              <div className="relative h-full rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop&crop=center"
                  alt="Security and encryption"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
                
                {/* Flip Card Animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative" style={{ perspective: '1000px' }}>
                    {steps.map((step, index) => {
                      const Icon = step.icon;
                      const isActive = index === currentCard;
                      
                      return (
                        <motion.div
                          key={index}
                          initial={{ rotateY: 0, opacity: 0 }}
                          animate={{ 
                            rotateY: isActive ? 0 : index < currentCard ? -180 : 180,
                            opacity: isActive ? 1 : 0.3,
                            scale: isActive ? 1 : 0.8,
                            zIndex: isActive ? 10 : index
                          }}
                          transition={{ 
                            duration: 0.8,
                            ease: "easeInOut"
                          }}
                          className="absolute bg-white rounded-xl p-6 shadow-xl"
                          style={{ 
                            backgroundColor: COLORS.white,
                            border: `1px solid #E5E7EB`,
                            width: '420px',
                            height: '320px',
                            left: '-210px',
                            top: '-160px',
                            transformStyle: 'preserve-3d'
                          }}
                        >
                          <div className="flex flex-col h-full">
                            <div className="flex items-start space-x-3 mb-4">
                              <div 
                                className="p-3 rounded-lg flex-shrink-0"
                                style={{ backgroundColor: `${step.color}15` }}
                              >
                                <Icon 
                                  className="w-6 h-6" 
                                  style={{ color: step.color }} 
                                />
                              </div>
                              <div className="flex-1">
                                <h4 
                                  className="font-bold text-xl mb-3"
                                  style={{ color: COLORS.black, fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
                                >
                                  {step.title}
                                </h4>
                                <p 
                                  className="text-base leading-relaxed mb-4 font-medium"
                                  style={{ color: COLORS.black, fontFamily: 'Lato, sans-serif', fontWeight: 500 }}
                                >
                                  {step.description}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <div 
                                className="text-sm leading-relaxed whitespace-pre-line font-medium"
                                style={{ color: COLORS.black, fontFamily: 'Lato, sans-serif', fontWeight: 500 }}
                              >
                                {step.details}
                              </div>
                            </div>
                            
                            {/* Card indicator */}
                            <div className="flex justify-center mt-3">
                              <div className="flex space-x-1">
                                {steps.map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-2 h-2 rounded-full"
                                    style={{ 
                                      backgroundColor: i === currentCard ? step.color : '#E5E7EB'
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Content */}
            <div className="p-12 flex flex-col justify-center">
              <div className="space-y-8">
                <div>
                  <h2 
                    className="text-4xl font-bold mb-4"
                    style={{ color: COLORS.black, fontFamily: 'Inter, sans-serif' }}
                  >
                    Your Security is Our Priority
                  </h2>
                  <p 
                    className="text-lg leading-relaxed"
                    style={{ color: COLORS.black, fontFamily: 'Lato, sans-serif' }}
                  >
                    Military-grade protection meets user-friendly design. Experience uncompromising security without sacrificing convenience.
                  </p>
                </div>
                
                <button 
                  className="inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors w-fit"
                  style={{ backgroundColor: COLORS.primary, color: COLORS.white }}
                >
                  Learn about our security
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Auto-Animated Secure Vault Component
const AutoAnimatedSecureVault = () => {
  const [visibleCards, setVisibleCards] = useState([]);

  const steps = [
    {
      icon: User,
      title: "For Individuals",
      description: "Secure personal documents with biometric vault protection",
      color: "#0061FF"
    },
    {
      icon: Briefcase,
      title: "For Freelancers",
      description: "Store client contracts and invoices in organized workspace",
      color: "#0061FF"
    },
    {
      icon: Users,
      title: "For Admin Teams",
      description: "Manage company documents with robust admin controls",
      color: "#0061FF"
    }
  ];

  useEffect(() => {
    const showCards = () => {
      setVisibleCards([]);
      steps.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards(prev => [...prev, index]);
        }, index * 600);
      });
      
      setTimeout(() => {
        steps.forEach((_, index) => {
          setTimeout(() => {
            setVisibleCards(prev => prev.filter(i => i !== index));
          }, index * 400);
        });
        
        setTimeout(() => showCards(), steps.length * 400 + 1000);
      }, steps.length * 600 + 2000);
    };

    showCards();
  }, [steps.length]);

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl overflow-hidden shadow-2xl"
          style={{ backgroundColor: '#E9D5FF' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            {/* Left Column - Content */}
            <div className="p-12 flex flex-col justify-center">
              <div className="space-y-8">
                <div>
                  <h2 
                    className="text-4xl font-bold mb-4"
                    style={{ color: COLORS.black, fontFamily: 'Inter, sans-serif' }}
                  >
                    A Secure Vault for Everyone
                  </h2>
                  <p 
                    className="text-lg leading-relaxed"
                    style={{ color: COLORS.black, fontFamily: 'Lato, sans-serif' }}
                  >
                    Whether you're an individual, freelancer, or part of an admin team, our secure vault adapts to your needs with enterprise-grade protection.
                  </p>
                </div>
                
                <button 
                  className="inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors w-fit"
                  style={{ backgroundColor: COLORS.primary, color: COLORS.white }}
                >
                  Choose your plan
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Right Column - Image with Cards */}
            <div className="relative p-8">
              <div className="relative h-full rounded-2xl overflow-hidden">
                <img
                  src="https://media.istockphoto.com/id/1291751221/photo/the-sales-department-scores-again.webp?a=1&b=1&s=612x612&w=0&k=20&c=eLEEzx6Bt0-Y3Cj2QKudklHo9sBd4vzXO4Fvt9eLzjk="
                  alt="Digital Security Lock"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {steps.map((step, index) => {
                      const Icon = step.icon;
                      const isVisible = visibleCards.includes(index);
                      
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ 
                            opacity: isVisible ? 1 : 0,
                            y: isVisible ? index * -110 : 20,
                            scale: isVisible ? 1 : 0.95
                          }}
                          transition={{ 
                            duration: 0.4,
                            ease: "easeOut"
                          }}
                          className="absolute bg-white rounded-xl p-4 shadow-lg"
                          style={{ 
                            backgroundColor: COLORS.white,
                            border: `1px solid #E5E7EB`,
                            width: '320px',
                            left: '-160px',
                            top: '100px',
                            display: isVisible ? 'block' : 'none'
                          }}
                        >
                          <div className="flex items-start space-x-3">
                            <div 
                              className="p-2 rounded-lg flex-shrink-0"
                              style={{ backgroundColor: `${step.color}15` }}
                            >
                              <Icon 
                                className="w-5 h-5" 
                                style={{ color: step.color }} 
                              />
                            </div>
                            <div className="flex-1">
                              <h4 
                                className="font-bold text-base mb-1"
                                style={{ color: COLORS.black, fontFamily: 'Inter, sans-serif' }}
                              >
                                {step.title}
                              </h4>
                              <p 
                                className="text-sm leading-relaxed"
                                style={{ color: COLORS.darkGray, fontFamily: 'Lato, sans-serif' }}
                              >
                                {step.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Auto-Animated How It Works Component
const AutoAnimatedHowItWorks = () => {
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [animationPhase, setAnimationPhase] = useState('clumpy'); // 'clumpy', 'expanding', 'shrinking'

  const steps = [
    {
      icon: User,
      title: "Create Account",
      description: "Sign up with secure\ncredentials and verification",
      color: "#0061FF"
    },
    {
      icon: CloudUpload,
      title: "Upload & Encrypt",
      description: "Drag and drop files into\nsecure portal with AES-256",
      color: "#0061FF"
    },
    {
      icon: ScanSearch,
      title: "Organize & Find",
      description: "AI-powered categorization\nwith lightning-fast search",
      color: "#0061FF"
    },
    {
      icon: FileLock2,
      title: "Access & Control",
      description: "Access from any device with\nbiometric authentication",
      color: "#0061FF"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (animationPhase === 'clumpy') {
        setVisibleSteps([0, 1, 2, 3]);
        setTimeout(() => setAnimationPhase('expanding'), 1000);
      } else if (animationPhase === 'expanding') {
        setVisibleSteps(prev => {
          if (prev.length === steps.length) {
            setTimeout(() => setAnimationPhase('shrinking'), 3000);
            return prev;
          }
          return prev;
        });
      } else {
        setAnimationPhase('clumpy');
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [animationPhase, steps.length]);

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Container */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl overflow-hidden shadow-2xl"
          style={{ backgroundColor: '#E3F2FD' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            
            {/* Left Column - Content */}
            <div className="p-12 flex flex-col justify-center">
              <div className="space-y-8">
                {/* Section Title */}
                <div>
                  <h2 
                    className="text-4xl font-bold mb-4"
                    style={{ color: COLORS.black, fontFamily: 'Inter, sans-serif' }}
                  >
                    How It Works
                  </h2>
                  <p 
                    className="text-lg leading-relaxed"
                    style={{ color: COLORS.black, fontFamily: 'Lato, sans-serif' }}
                  >
                    Transform your document security with our revolutionary 4-step process. Experience military-grade protection with consumer-friendly simplicity.
                  </p>
                </div>
                
                {/* Action Button */}
                <button 
                  className="inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors w-fit"
                  style={{ backgroundColor: COLORS.primary, color: COLORS.white }}
                >
                  More about secure storage
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Right Column - Image with Centered Stacking Steps */}
            <div className="relative p-8">
              <div className="relative h-full rounded-2xl overflow-hidden">
                <img
                  src="https://media.istockphoto.com/id/1552881556/photo/tablet-designer-and-serious-woman-research-in-business-startup-office-at-night-on-deadline.webp?a=1&b=1&s=612x612&w=0&k=20&c=BcvnTOdxmot9qj2oF8meLUOVuBh7HBnrSQ93NqFzAFA="
                  alt="Professional working on tablet in office"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10" />
                
                {/* Centered Stacking Step Cards */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ marginTop: '120px' }}>
                  <div className="relative">
                    {visibleSteps.map((stepIndex, displayIndex) => {
                      const step = steps[stepIndex];
                      const Icon = step.icon;
                      const isClumpy = animationPhase === 'clumpy' || animationPhase === 'shrinking';
                      
                      return (
                        <motion.div
                          key={`${stepIndex}-${displayIndex}`}
                          initial={{ opacity: 0.8 }}
                          animate={{ 
                            opacity: isClumpy ? (displayIndex === 0 ? 1 : 0.85 - (displayIndex * 0.15)) : 1,
                            y: isClumpy ? displayIndex * 8 : displayIndex * -120,
                            x: 0,
                            rotate: 0,
                            scale: isClumpy ? 1 - (displayIndex * 0.04) : 1,
                            zIndex: isClumpy ? steps.length - displayIndex : displayIndex
                          }}
                          transition={{ 
                            duration: 0.8,
                            type: "spring",
                            stiffness: 80
                          }}
                          className="absolute bg-white rounded-xl p-4 shadow-lg"
                          style={{ 
                            backgroundColor: COLORS.white,
                            border: `1px solid #E5E7EB`,
                            width: '320px',
                            left: '-160px',
                            pointerEvents: isClumpy && displayIndex > 0 ? 'none' : 'auto'
                          }}
                        >
                          <div className="flex items-start space-x-3">
                            <div 
                              className="p-2 rounded-lg flex-shrink-0"
                              style={{ backgroundColor: `${step.color}15` }}
                            >
                              <Icon 
                                className="w-5 h-5" 
                                style={{ color: step.color }} 
                              />
                            </div>
                            <div className="flex-1">
                              <h4 
                                className="font-bold text-base mb-1"
                                style={{ color: COLORS.black, fontFamily: 'Inter, sans-serif' }}
                              >
                                {step.title}
                              </h4>
                              <p 
                                className="text-sm leading-relaxed"
                                style={{ color: COLORS.darkGray, fontFamily: 'Lato, sans-serif' }}
                              >
                                {step.description.replace('\n', ' ')}
                              </p>
                            </div>
                          </div>

                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Flip Card Stack Component
const FlipCardStack = () => {
  const cards = [
    {
      icon: User,
      title: "For Individuals",
      description: "• Secure personal documents\n• Biometric vault protection\n• Prevent unauthorized access"
    },
    {
      icon: Briefcase,
      title: "For Freelancers",
      description: "• Store client contracts & invoices\n• Organized workspace\n• Secure client portals"
    },
    {
      icon: Users,
      title: "For Admin Teams",
      description: "• Manage company documents\n• Robust admin controls\n• Team permission management"
    }
  ];

  return (
    <div className="w-full px-6">
      <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
        {cards.map((card, index) => {
          const Icon = card.icon;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
              className="p-6 rounded-lg border flex flex-col items-center text-center"
              style={{backgroundColor: COLORS.white, borderColor: COLORS.mediumGray + '40', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}
            >
              <Icon className="w-12 h-12 mb-4" style={{color: COLORS.primary}} />
              <h3 className="text-lg font-bold mb-3" style={{color: COLORS.black, fontFamily: 'Inter, sans-serif', fontWeight: 700}}>{card.title}</h3>
              <div className="leading-relaxed text-sm whitespace-pre-line" style={{color: COLORS.mediumGray, fontFamily: 'Lato, sans-serif'}}>
                {card.description}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// HERO SLIDE COMPONENT (Enhanced with Innovative Animations)
const HeroCarousel = ({ isAuthenticated, handleDashboardNavigation, navigate, scrollToSection }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const slides = [
    {
      title: "Your Digital",
      highlight: "Fortress",
      description:
        "SecureVault protects your most important files with next-generation encryption, powered by AI and cloud security.",
      image: "/videos/Image1.png",
      alt: "Cyber fortress and digital protection",
      gradient: "from-gray-50 via-gray-100 to-blue-50",
      accentColor: "from-indigo-800 via-purple-800 to-gray-900"
    },
    {
      title: "Bank-Grade",
      highlight: "Encryption",
      description:
        "We use cutting-edge AES-256 encryption to keep your digital identity locked and protected at all times.",
      image: "/videos/Image2.png",
      alt: "Encryption and cyber lock",
      gradient: "from-gray-50 via-gray-100 to-gray-200",
      accentColor: "from-indigo-800 via-purple-800 to-gray-900"
    },
    {
      title: "Access",
      highlight: "Anywhere",
      description:
        "Access your documents securely from any device. Sync instantly with cloud backups and smart categorization.",
      image: "/videos/Image3.png",
      alt: "Access documents globally",
      gradient: "from-blue-50 via-indigo-50 to-purple-50",
      accentColor: "from-indigo-800 via-purple-800 to-gray-900"
    },
    { 
      title: "Smart",
      highlight: "Organization",
      description: "Effortless organization, instant access. AI-powered search puts every document at your fingertips.", 
      image: "/videos/Image4.png",
      alt: "Document organization and filing",
      gradient: "from-slate-50 via-slate-100 to-gray-100",
      accentColor: "from-indigo-800 via-purple-800 to-gray-900"
    }
  ];

  // Auto-play
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isAutoPlay, slides.length]);

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden" style={{ marginTop: 0, paddingTop: 0 }}>
      {/* Enhanced Dynamic Background */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at top left, #3b82f6 10%, #1e3a8a 90%)',
            'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
            'radial-gradient(circle at bottom right, #2563eb 10%, #1e40af 90%)'
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      >
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
        
        {/* Parallax Background Elements */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.1) 0%, transparent 50%)`
          }}
        />
        
        {/* Animated Gradient Overlay */}
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 40%, rgba(119, 255, 198, 0.3) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        />
      </motion.div>

      {/* Content Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center min-h-[90vh]">
          
          {/* Text Content - Better Centered */}
          <motion.div
            key={`text-${currentSlide}`}
            initial={{ opacity: 0, x: -80, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -80, rotateY: -15 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-6 text-left lg:pl-8"
          >
            {/* Animated Title */}
            <motion.div className="mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                className="text-4xl lg:text-6xl xl:text-7xl font-black leading-tight mb-4" 
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <motion.span 
                  className="drop-shadow-lg"
                  style={{ 
                    fontWeight: 800,
                    fontSize: '3rem',
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                  }}
                >
                  {currentSlideData.title} {currentSlideData.highlight}
                </motion.span>
              </motion.h1>
            </motion.div>
            
            {/* Enhanced Description */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-xl lg:text-2xl leading-relaxed mb-10 font-medium max-w-2xl"
              style={{ 
                color: '#E0E7FF', 
                fontFamily: 'Inter, sans-serif', 
                fontWeight: 600, 
                lineHeight: 1.6, 
                fontSize: '1.2rem',
                maxWidth: '550px',
                textShadow: '1px 1px 3px rgba(0,0,0,0.6)'
              }}
            >
              {currentSlideData.description}
            </motion.p>

            {/* Enhanced Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 lg:gap-6"
            >
              {isAuthenticated ? (
                <motion.button
                  onClick={handleDashboardNavigation}
                  className="group relative bg-white text-gray-900 font-bold py-4 px-8 lg:py-5 lg:px-10 rounded-2xl transition-all duration-300 shadow-2xl overflow-hidden"
                  style={{fontFamily: 'Inter, sans-serif', fontSize: '1.1rem'}}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Go to Dashboard <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              ) : (
                <>
                  <motion.button
                    onClick={() => navigate("/register")}
                    className="group relative bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 lg:py-5 lg:px-10 rounded-2xl transition-all duration-300 shadow-2xl overflow-hidden"
                    style={{fontFamily: 'Inter, sans-serif', fontSize: '1.1rem'}}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Start Protecting My Files <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                  <motion.button
                    onClick={() => scrollToSection("features")}
                    className="font-bold py-4 px-8 lg:py-5 lg:px-10 rounded-2xl border-2 border-white bg-white text-gray-900 hover:bg-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.1rem' }}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn More
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Enhanced Image Cards - Larger and More Attractive */}
          <motion.div 
            initial={{ opacity: 0, x: 80, rotateY: 15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="lg:col-span-6 relative flex justify-center items-start pt-4 px-8 pl-16"
          >
            <div className="relative w-full max-w-lg mx-auto" style={{ marginBottom: '120px' }}>
              {/* Background Cards for Depth */}
              {slides.map((slide, index) => {
                const offset = index - currentSlide;
                const isActive = index === currentSlide;
                
                return (
                  <motion.div
                    key={index}
                    className="absolute inset-0"
                    animate={{
                      x: offset * 30 + 20,
                      y: offset * 20 - 80,
                      scale: isActive ? 1 : 0.85 - Math.abs(offset) * 0.1,
                      opacity: isActive ? 1 : 0.3 - Math.abs(offset) * 0.1,
                      zIndex: isActive ? 10 : 10 - Math.abs(offset),
                      rotateY: offset * 5,
                      rotateX: offset * 2
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <motion.div
                      className="relative overflow-hidden rounded-3xl border-0"
                      style={{ 
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                        borderRadius: '20px'
                      }}
                      whileHover={isActive ? { 
                        y: -10, 
                        rotateX: 5, 
                        rotateY: 5,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                      } : {}}
                      transition={{ duration: 0.3 }}
                      animate={{
                        y: [0, -10, 0]
                      }}
                    >
                      {/* Glowing Border Effect */}
                      <motion.div
                        className="absolute inset-0 rounded-3xl"
                        animate={isActive ? {
                          boxShadow: [
                            '0 0 20px rgba(59, 130, 246, 0.3)',
                            '0 0 40px rgba(59, 130, 246, 0.5)',
                            '0 0 20px rgba(59, 130, 246, 0.3)'
                          ]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      
                      {/* Direct Image as Card */}
                      <motion.img
                        src={slide.image}
                        alt={slide.alt}
                        className="w-full h-80 lg:h-96 object-cover rounded-3xl"
                        animate={isActive ? {
                          scale: [1, 1.05, 1]
                        } : {}}
                        transition={{ duration: 6, repeat: Infinity }}
                      />
                      
                      {/* Image Overlay with Title */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-3xl flex items-end justify-center p-6"
                        animate={isActive ? {
                          opacity: [0.8, 1, 0.8]
                        } : {}}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        <motion.h3 
                          className="text-lg lg:text-xl font-bold text-white text-center"
                          animate={isActive ? {
                            scale: [1, 1.02, 1]
                          } : {}}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          {slide.title} <span className="text-cyan-300">{slide.highlight}</span>
                        </motion.h3>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex space-x-4">
          {slides.map((slide, index) => (
            <motion.button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`relative w-4 h-4 rounded-full transition-all duration-300 overflow-hidden ${
                currentSlide === index 
                  ? 'bg-gray-800 shadow-lg' 
                  : 'bg-gray-800/30 hover:bg-gray-800/50'
              }`}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
            >
              {currentSlide === index && (
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${slide.accentColor} rounded-full`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Slide Counter */}
      <motion.div 
        className="absolute top-8 right-8 z-30 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <span className="text-gray-900 font-bold">
          {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
      </motion.div>
    </section>
  );
};

// MAIN HOME PAGE COMPONENT
export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { isDarkMode } = useTheme();
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDashboardNavigation = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (user?.role === "ADMIN") navigate("/admin-dashboard");
    else navigate("/dashboard");
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setContactForm({ name: '', email: '', message: '' });
      alert('Message sent successfully!');
    }, 1000);
  };

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  return (
    <div className={`${STYLES.page} flex flex-col font-inter transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`} style={{ margin: 0, padding: 0, width: '100vw', overflowX: 'hidden' }}>
      <Navbar />

      {/* HERO SLIDE SECTION */}
      <div className="hero" style={{ minHeight: '90vh' }}>
        <HeroCarousel
          isAuthenticated={isAuthenticated}
          handleDashboardNavigation={handleDashboardNavigation}
          navigate={navigate}
          scrollToSection={scrollToSection}
        />
      </div>
      
      {/* UNIFIED FEATURES SECTION */}
      <div id="features">
        <UnifiedFeaturesSection isDarkMode={isDarkMode} />
      </div>
      
      {/* FEATURE CARDS SECTION */}
      <EnhancedFeatureCards isDarkMode={isDarkMode} />
      
      <section id="contact" className="py-16 px-0 relative overflow-hidden" style={{background: '#1e293b'}}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* ABOUT US */}
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">ABOUT US</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Our Story</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Careers</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Security Features</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Enterprise Solutions</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Data Protection</a></li>
              </ul>
            </div>

            {/* CUSTOMER CARE */}
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">CUSTOMER CARE</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Security Assessment</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Terms and Conditions</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Data Recovery</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Account Security</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">FAQs</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Support Policy</a></li>
              </ul>
            </div>

            {/* OFFERS & REWARDS */}
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">OFFERS & REWARDS</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Premium Membership</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Referral Program</a></li>
              </ul>
            </div>

            {/* GET IN TOUCH */}
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">GET IN TOUCH</h4>
              <div className="space-y-3">
                <p className="text-gray-300 text-sm">WhatsApp us at: 7090970909</p>
                <p className="text-gray-300 text-sm">Call: +91-9129912991</p>
                <p className="text-gray-300 text-sm">Email: support@securevault.com</p>
              </div>
            </div>

            {/* SIGN UP FOR NEWSLETTER */}
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">SIGN UP FOR OUR NEWSLETTER</h4>
              <div className="mb-4">
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Enter email address" 
                    className="flex-1 px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-400 text-xs mb-6">
                For security tips, feature updates, exclusive offers and discounts
              </p>
              
              {/* FOLLOW US */}
              <div className="mb-6">
                <h5 className="font-bold text-white mb-3 text-sm uppercase tracking-wide">FOLLOW US</h5>
                <div className="flex gap-3">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-sky-400 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-300 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
              
              {/* DOWNLOAD APP */}
              <div>
                <h5 className="font-bold text-white mb-3 text-sm uppercase tracking-wide">Download App!</h5>
                <div className="flex gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-10" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-gray-600 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <span className="text-gray-400 text-sm">© 2025, SecureVault. All rights reserved.</span>
            </div>
            <div className="flex gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6 opacity-70" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-70" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="American Express" className="h-6 opacity-70" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Google_Pay_%28GPay%29_Logo.svg" alt="Google Pay" className="h-6 opacity-70" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/PayPal_2014_logo.svg" alt="PayPal" className="h-6 opacity-70" />
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}