'use client'
import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ClerkLoaded, useUser } from '@clerk/nextjs'

export default function CheckoutPage() {
  return (
    <React.Suspense fallback={<div className="pt-32 pb-24 text-center">Loading Checkout...</div>}>
      <CheckoutContent />
    </React.Suspense>
  )
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const planId = searchParams.get('planId')
  const period = searchParams.get('period') || 'monthly'
  const { isLoaded, isSignedIn } = useUser()

  if (!planId) {
    return (
      <div className="pt-32 pb-24 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Invalid Link</h1>
        <p className="text-gray-400">No Plan ID was provided.</p>
      </div>
    )
  }

  return (
    <div className="pt-32 pb-24 max-w-2xl mx-auto px-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Subscription</h1>
      
      <div className="glassmorphism p-8 rounded-custom shadow-neon-blue border border-white/10">
        <ClerkLoaded>
          {isLoaded && isSignedIn && (
            <FakeCheckoutForm planId={planId} period={period} />
          )}
          {isLoaded && !isSignedIn && (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">You must be signed in to checkout.</p>
            </div>
          )}
        </ClerkLoaded>
      </div>
    </div>
  )
}

function FakeCheckoutForm({ planId, period }: { planId: string, period: string }) {
  const router = useRouter()
  const { user } = useUser()
  const [isProcessing, setIsProcessing] = React.useState(false)

  // Determine pricing based on planId and period for display
  const isPro = planId.includes('QDgJIKa7s')
  const isYearly = period === 'year' || period === 'yearly'
  
  let price = isPro ? (isYearly ? 162.00 : 18.99) : (isYearly ? 239.88 : 22.99)
  let planName = isPro ? 'Pro Plan' : 'Ultra Plan'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return
    setIsProcessing(true)

    const now = Date.now()
    let currentPeriodEnd = now
    
    if (isYearly) {
      const date = new Date(now)
      date.setFullYear(date.getFullYear() + 1)
      currentPeriodEnd = date.getTime()
    } else {
      const date = new Date(now)
      date.setMonth(date.getMonth() + 1)
      currentPeriodEnd = date.getTime()
    }

    const newInvoice = {
      id: `inv_${Math.random().toString(36).substring(2, 11)}`,
      date: now,
      amount: price,
      status: 'paid'
    }

    const existingMetadata = user.unsafeMetadata || {}
    const history = Array.isArray(existingMetadata.history) ? existingMetadata.history : []

    try {
      await user.update({
        unsafeMetadata: {
          ...existingMetadata,
          plan: isPro ? 'pro' : 'ultra',
          period: isYearly ? 'yearly' : 'monthly',
          status: 'active',
          currentPeriodEnd,
          history: [newInvoice, ...history]
        }
      })
      
      // Redirect to the success page
      router.push(`/checkout/success?plan=${encodeURIComponent(planName)}&period=${isYearly ? 'yearly' : 'monthly'}`)
    } catch (error) {
      console.error('Failed to update subscription:', error)
      setIsProcessing(false)
    }
  }

  return (
    <div className="checkout-container flex flex-col gap-8">
      <div className="bg-black/40 p-6 rounded-custom border border-white/10">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="flex justify-between items-center text-lg">
          <span className="text-gray-300">{planName}</span>
          <span className="font-extrabold text-primary text-2xl">
            {`$${price.toFixed(2)}`}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {isYearly ? 'Billed annually' : 'Billed monthly'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        <div className="p-4 bg-white/5 rounded-custom border border-white/10 flex flex-col gap-4">
          <p className="text-sm text-gray-400 mb-2">Simulated Payment Gateway (No real charges will be made)</p>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Card Number</label>
            <input 
              type="text" 
              required
              placeholder="0000 0000 0000 0000" 
              className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-primary"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">Expiry Date</label>
              <input 
                type="text" 
                required
                placeholder="MM/YY" 
                className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">CVC</label>
              <input 
                type="text" 
                required
                placeholder="123" 
                className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name on Card</label>
            <input 
              type="text" 
              required
              placeholder="John Doe" 
              className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-primary text-white py-3 rounded-custom font-bold hover:bg-blue-600 transition-all shadow-neon-blue disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing Payment...' : 'Mock Purchase (Fake)'}
        </button>
      </form>
    </div>
  )
}
