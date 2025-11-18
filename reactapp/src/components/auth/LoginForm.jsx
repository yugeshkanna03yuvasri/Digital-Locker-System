import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { STYLES } from "../../styles/constants";
import Button from "../common/Button";
import Input from "../common/Input";
import Card from "../common/Card";
import { LockIcon, EyeIcon } from "../ui/Icons";
import Navbar from "../layout/Navbar";

const EyeSlashIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
  </svg>
);

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(email, password);
    
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    // Google OAuth implementation would go here
    console.log('Google login clicked');
  };

  return (
    <div className={STYLES.page}>
      <Navbar />
      <div className={`${STYLES.flexCenter} min-h-screen p-4 pt-20`}>
        <div className="w-full max-w-md">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-blue-600 rounded-full mb-4">
              <LockIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className={STYLES.heading}>SecureVault</h1>
            <p className={STYLES.bodyText}>Secure Document Management</p>
          </div>

          {/* Login Form */}
          <Card className="p-8">
            <div className="text-center mb-6">
              <h2 className={STYLES.subheading}>Welcome Back</h2>
              <p className="text-sm text-gray-600 mt-1">Sign in to your account</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div>
                <label className={STYLES.label}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={STYLES.input}
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
              </div>

              <div className={STYLES.flexBetween}>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                className="w-full"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
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

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate("/register")}
                  className="font-medium text-blue-600 hover:underline"
                >
                  Create account
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
