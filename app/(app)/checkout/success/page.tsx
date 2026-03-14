'use client'

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'Pro Plan';
  const period = searchParams.get('period') || 'monthly';

  return (
    <div className="pt-32 pb-24 max-w-2xl mx-auto px-4 min-h-screen flex flex-col items-center justify-center">
      <div className="glassmorphism p-12 rounded-custom shadow-neon-blue border border-white/10 text-center flex flex-col items-center">
        <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
        
        <h1 className="text-4xl font-bold mb-4">Subscription Confirmed!</h1>
        <p className="text-gray-400 text-lg mb-8">
          Thank you for subscribing to the <strong className="text-white">{plan}</strong> ({period}). 
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/#courses">
            <button className="px-8 py-3 rounded-custom bg-primary text-white font-bold shadow-neon-blue hover:scale-105 transition-all w-full sm:w-auto">
              Start Learning
            </button>
          </Link>
          <Link href="/billing">
            <button className="px-8 py-3 rounded-custom border border-white/20 text-white font-bold hover:bg-white/5 transition-all w-full sm:w-auto">
              View Billing Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
