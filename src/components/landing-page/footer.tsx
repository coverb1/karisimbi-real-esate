"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h5 className="font-heading text-primary text-lg font-bold">KARISIMBI</h5>
            <p className="mt-3 text-sm text-slate-600">Perfect plots for your dream residence.</p>
          </div>

          <div>
            <h6 className="font-semibold text-slate-800 mb-3">Quick Links</h6>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-slate-600 hover:text-slate-800">Home</Link></li>
              <li><Link href="/about" className="text-slate-600 hover:text-slate-800">About</Link></li>
              <li><Link href="/properties" className="text-slate-600 hover:text-slate-800">Properties</Link></li>
              <li><Link href="/services" className="text-slate-600 hover:text-slate-800">Services</Link></li>
            </ul>
          </div>

          <div>
            <h6 className="font-semibold text-slate-800 mb-3">Services</h6>
            <ul className="space-y-2 text-sm">
              <li><Link href="/properties" className="text-slate-600 hover:text-slate-800">Buy Property</Link></li>
              <li><Link href="/sell-property" className="text-slate-600 hover:text-slate-800">Sell Property</Link></li>
              <li><Link href="/book-visit" className="text-slate-600 hover:text-slate-800">Property Visits</Link></li>
            </ul>
          </div>

          <div>
            <h6 className="font-semibold text-slate-800 mb-3">Contact</h6>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2"><Phone size={16} /> <span>+250 787 861 400</span></li>
              <li className="flex items-center gap-2"><Mail size={16} /> <span> karisimbirealestate@gmail.com</span></li>
              <li className="flex items-center gap-2"><MapPin size={16} /> <span>Kigali, Rwanda</span></li>
            </ul>

            <div className="mt-4 flex items-center gap-3 text-slate-600">
              <Link href="#" aria-label="Facebook" className="hover:text-slate-800"><Facebook size={18} /></Link>
              <Link href="#" aria-label="Twitter" className="hover:text-slate-800"><Twitter size={18} /></Link>
              <Link href="#" aria-label="Instagram" className="hover:text-slate-800"><Instagram size={18} /></Link>
              <Link href="#" aria-label="LinkedIn" className="hover:text-slate-800"><Linkedin size={18} /></Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500 flex items-center justify-between">
          <div>© 2026 Karisimbi Real Estate. All rights reserved.</div>
          <div className="flex items-center gap-4 text-slate-500">
            <Link href="#" className="hover:text-slate-700">Privacy</Link>
            <Link href="#" className="hover:text-slate-700">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
