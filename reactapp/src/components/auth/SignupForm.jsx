import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { STYLES } from "../../styles/constants";
import { Button, Card, Input } from "../common";
import { LockIcon, EyeIcon, XIcon } from "../ui/Icons";
import Navbar from "../layout/Navbar";

const EyeSlashIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    password: "",
    confirmPassword: "",
    role: "USER",
    adminCode: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  // Password validation
  const passwordRequirements = [
    { test: (pwd) => pwd.length >= 8, text: "At least 8 characters" },
    { test: (pwd) => /[A-Z]/.test(pwd), text: "One uppercase letter" },
    { test: (pwd) => /[a-z]/.test(pwd), text: "One lowercase letter" },
    { test: (pwd) => /\d/.test(pwd), text: "One number" },
    { test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), text: "One special character" }
  ];

  const isPasswordValid = passwordRequirements.every(req => req.test(formData.password));
  const doPasswordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== "";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!isPasswordValid) {
      setError("Password does not meet requirements");
      setLoading(false);
      return;
    }

    if (!doPasswordsMatch) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError("Please accept the Terms of Service");
      setLoading(false);
      return;
    }

    // Validate admin code if admin role is selected
    if (formData.role === 'ADMIN' && formData.adminCode !== 'SECUREVAULT2024') {
      setError("Invalid admin access code");
      setLoading(false);
      return;
    }

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    console.log('Signup form data:', {
      name: fullName,
      email: formData.email,
      role: formData.role,
      phone: formData.phone,
      company: formData.company,
      jobTitle: formData.jobTitle,
      adminCode: formData.adminCode
    });
    
    const result = await signup(fullName, formData.email, formData.password, formData.role, {
      phone: formData.phone,
      company: formData.company,
      jobTitle: formData.jobTitle,
      adminCode: formData.adminCode
    });
    
    console.log('Signup result:', result);
    
    if (result.success) {
      navigate("/login", { 
        state: { message: "Account created successfully! Please sign in." }
      });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleGoogleSignup = () => {
    // Google OAuth implementation would go here
    console.log('Google signup clicked');
  };

  return (
    <div className={STYLES.page}>
      <Navbar />
      <div className={`${STYLES.flexCenter} min-h-screen p-4 pt-20`}>
        <div className="w-full max-w-lg">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-blue-600 rounded-full mb-4">
              <LockIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className={STYLES.heading}>SecureVault</h1>
            <p className={STYLES.bodyText}>Secure Document Management</p>
          </div>

          {/* Signup Form */}
          <Card className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Create Account</h2>
            <p className="text-gray-600 mt-1 text-sm">Join thousands of users securing their documents</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              <div className="flex items-center">
                <XIcon className="w-4 h-4 mr-2" />
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                name="firstName"
                label="First Name *"
                placeholder="John"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              <Input
                type="text"
                name="lastName"
                label="Last Name *"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>

            <Input
              type="email"
              name="email"
              label="Email Address *"
              placeholder="john.doe@company.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <Input
              type="tel"
              name="phone"
              label="Phone Number"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={handleInputChange}
            />

            {/* Company & Job Title */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  name="company"
                  placeholder="Acme Corp"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-transparent transition duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  placeholder="Manager"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-transparent transition duration-200"
                />
              </div>
            </div>

            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
              <select
                name="role"
                value={formData.role || 'USER'}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-transparent transition duration-200"
              >
                <option value="USER">Standard User</option>
                <option value="ADMIN">Administrator</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Standard users can manage their own files. Administrators can manage all users and system settings.
              </p>
            </div>

            {/* Admin Access Code - Only show if ADMIN is selected */}
            {formData.role === 'ADMIN' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Access Code *</label>
                <input
                  type="password"
                  name="adminCode"
                  placeholder="Enter admin access code"
                  value={formData.adminCode || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-transparent transition duration-200"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Contact your system administrator for the admin access code.
                </p>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-transparent transition duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-3 space-y-2">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center text-sm">
                      {req.test(formData.password) ? (
                        <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <XIcon className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className={req.test(formData.password) ? "text-green-600" : "text-red-600"}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-transparent transition duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {formData.confirmPassword && (
                <div className="mt-2 flex items-center text-sm">
                  {doPasswordsMatch ? (
                    <>
                      <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <XIcon className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-red-600">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Terms and Marketing */}
            <div className="space-y-3">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
                <span className="ml-3 text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </span>
              </label>
              
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={acceptMarketing}
                  onChange={(e) => setAcceptMarketing(e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                />
                <span className="ml-3 text-sm text-gray-600">
                  I'd like to receive product updates and security tips via email
                </span>
              </label>
            </div>



            <Button
              type="submit"
              disabled={loading || !isPasswordValid || !doPasswordsMatch || !acceptTerms}
              loading={loading}
              className="w-full"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignup}
              className="w-full"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate("/login")}
                className="font-medium text-blue-600 hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6 text-xs text-gray-500">
            <p>© 2024 SecureVault. All rights reserved.</p>
            <div className="flex justify-center space-x-4 mt-2">
              <a href="#" className="hover:text-gray-700">Privacy Policy</a>
              <a href="#" className="hover:text-gray-700">Terms of Service</a>
              <a href="#" className="hover:text-gray-700">Support</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Section */}
      <section className="py-16 px-0 relative overflow-hidden" style={{background: '#1e293b'}}>
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
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
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
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-sky-400 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323C6.001 8.198 7.152 7.708 8.449 7.708s2.448.49 3.323 1.416c.875.926 1.365 2.077 1.365 3.374s-.49 2.448-1.365 3.323c-.875.875-2.026 1.167-3.323 1.167zm7.718 0c-1.297 0-2.448-.49-3.323-1.297-.875-.807-1.365-1.958-1.365-3.255s.49-2.448 1.365-3.323c.875-.875 2.026-1.365 3.323-1.365s2.448.49 3.323 1.365c.875.875 1.365 2.026 1.365 3.323s-.49 2.448-1.365 3.255c-.875.807-2.026 1.297-3.323 1.297z"/>
                    </svg>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-300 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
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