import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200">
                H
              </div>
              <span className="font-bold text-xl text-slate-800">HealthStats</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              The AI-powered operating system for your biological data. Track, analyze, and optimize your life.
            </p>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="#" className="hover:text-indigo-600 transition-colors">Features</Link></li>
              <li><Link to="#" className="hover:text-indigo-600 transition-colors">Pricing</Link></li>
              <li><Link to="#" className="hover:text-indigo-600 transition-colors">API</Link></li>
              <li><Link to="#" className="hover:text-indigo-600 transition-colors">Integration</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="#" className="hover:text-indigo-600 transition-colors">About Us</Link></li>
              <li><Link to="#" className="hover:text-indigo-600 transition-colors">Careers</Link></li>
              <li><Link to="#" className="hover:text-indigo-600 transition-colors">Blog</Link></li>
              <li><Link to="#" className="hover:text-indigo-600 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-indigo-600 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} HealthStats Inc. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Twitter size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Github size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Linkedin size={20} /></a>
          </div>
        </div>
        
      </div>
    </footer>
  );
}