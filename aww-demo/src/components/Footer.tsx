import { motion } from 'framer-motion';
import { ArrowRight, Mail, Phone, MapPin as LocationIcon, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

interface FooterProps {
  onPageChange: (page: string) => void;
}

export function Footer({ onPageChange }: FooterProps) {
  return (
    <footer className="bg-gradient-to-br from-[#004080] via-[#0056b3] to-[#f7941D] text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-white/5 to-transparent rounded-full translate-x-40 translate-y-40"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-[#f7941D]/5 to-[#004080]/5 rounded-full -translate-x-32 -translate-y-32"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#f7941D] to-[#F79520] rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">A Woman's Worth</h3>
                  <p className="text-gray-400 text-sm">Empowering Women Since 2020</p>
                </div>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-lg">
                Empowering women to recognize their inherent worth and embrace their unlimited potential 
                through community support, mentorship, and shared stories of transformation.
              </p>
              <div className="flex space-x-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <Facebook size={20} />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:from-pink-600 hover:to-purple-700 transition-colors shadow-lg"
                >
                  <Instagram size={20} />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-800 transition-colors shadow-lg"
                >
                  <Linkedin size={20} />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors shadow-lg"
                >
                  <Twitter size={20} />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Our Stories', page: 'stories' },
                { label: 'Upcoming Events', page: 'events' },
                { label: 'Support Store', page: 'store' },
                { label: 'Make a Donation', page: 'donate' },
                { label: 'Event Gallery', page: 'event-gallery' },
                { label: 'My Profile', page: 'profile' },
              ].map((link, index) => (
                <li key={index}>
                  <motion.button
                    onClick={() => onPageChange(link.page)}
                    className="text-gray-300 hover:text-[#f7941D] transition-all duration-300 hover:translate-x-2 flex items-center group"
                    whileHover={{ x: 4 }}
                  >
                    <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </motion.button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold mb-6 text-white">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#f7941D]/20 rounded-lg flex items-center justify-center">
                  <Mail size={16} className="text-[#f7941D]" />
                </div>
                <div>
                  <p className="text-gray-300">info@awomansWorth.org</p>
                  <p className="text-gray-500 text-sm">We'd love to hear from you</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#f7941D]/20 rounded-lg flex items-center justify-center">
                  <Phone size={16} className="text-[#f7941D]" />
                </div>
                <div>
                  <p className="text-gray-300">(555) 123-4567</p>
                  <p className="text-gray-500 text-sm">Mon-Fri, 9AM-5PM EST</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-[#f7941D]/20 rounded-lg flex items-center justify-center mt-1">
                  <LocationIcon size={16} className="text-[#f7941D]" />
                </div>
                <div>
                  <p className="text-gray-300">123 Empowerment Street</p>
                  <p className="text-gray-300">Suite 200</p>
                  <p className="text-gray-300">Hope City, HC 12345</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-white/20 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
            &copy; 2025 A Woman's Worth. All rights reserved. Made with ❤️ for empowering women everywhere.
          </p>
          <div className="flex space-x-6 text-sm items-center">
            <button className="text-gray-400 hover:text-[#f7941D] transition-colors">Privacy Policy</button>
            <button className="text-gray-400 hover:text-[#f7941D] transition-colors">Terms of Service</button>
            <button className="text-gray-400 hover:text-[#f7941D] transition-colors">Accessibility</button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
