import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from './AuthContext';
import awwLogo from 'figma:asset/82ca8155b3fa21379e7aaa03596e0c5c6a9a7948.png';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        
        // Show admin notification if logging in as admin
        if (email === 'admin@aww.com') {
          toast.success('👑 Admin Access Granted!', {
            description: 'You now have access to the Admin Dashboard in the navbar.',
            duration: 5000,
          });
        } else {
          toast.success('Welcome back!', {
            description: 'You have successfully signed in.',
          });
        }
      } else {
        if (!firstName || !lastName) {
          setError('Please enter your first and last name');
          setIsLoading(false);
          return;
        }
        await signUp(email, password, firstName, lastName);
        toast.success('Account created!', {
          description: 'Welcome to A Woman\'s Worth!',
        });
      }
      
      // Success - close modal
      onClose();
      resetForm();
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setError('');
    setMode('signin');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-[#f7941D] to-[#F79520] p-6 text-white relative">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                >
                  <X size={20} />
                </button>
                
                <div className="flex flex-col items-center">
                  <img src={awwLogo} alt="AWW Logo" className="h-16 mb-3" />
                  <h2 className="text-2xl font-bold">
                    {mode === 'signin' ? 'Welcome Back!' : 'Join Our Community'}
                  </h2>
                  <p className="text-white text-opacity-90 mt-1">
                    {mode === 'signin' 
                      ? 'Sign in to access your account' 
                      : 'Create an account to get started'}
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Admin credentials hint */}
                {mode === 'signin' && (
                  <div className="bg-gradient-to-r from-[#004080] to-[#0056b3] text-white px-4 py-3 rounded-lg">
                    <p className="font-bold text-sm mb-1">👑 Admin Access</p>
                    <p className="text-xs opacity-90">Email: admin@aww.com</p>
                    <p className="text-xs opacity-90">Password: AWW2025!Admin</p>
                  </div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg"
                  >
                    {error}
                  </motion.div>
                )}

                {mode === 'signup' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-gray-700">
                        First Name
                      </Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="Jane"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="pl-10"
                          required={mode === 'signup'}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-gray-700">
                        Last Name
                      </Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="pl-10"
                          required={mode === 'signup'}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="email" className="text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                  {mode === 'signup' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 6 characters
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#f7941D] to-[#F79520] hover:from-[#F79520] hover:to-[#f7941D] text-white py-6 transition-all duration-300"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      {mode === 'signin' ? (
                        <>
                          <LogIn size={18} className="mr-2" />
                          Sign In
                        </>
                      ) : (
                        <>
                          <UserPlus size={18} className="mr-2" />
                          Create Account
                        </>
                      )}
                    </>
                  )}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'signin' ? 'signup' : 'signin');
                    setError('');
                  }}
                  className="w-full text-[#f7941D] hover:text-[#F79520] font-medium transition-colors"
                >
                  {mode === 'signin' ? 'Create an account' : 'Sign in instead'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
