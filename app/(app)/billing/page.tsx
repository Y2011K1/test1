'use client'

import React, { useEffect, useState } from 'react';
import { useUser, RedirectToSignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function BillingPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isCanceling, setIsCanceling] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Auto-Renewal Simulation Logic
  useEffect(() => {
    if (!user || !isLoaded) return;

    const metadata: any = user.unsafeMetadata || {};
    const status = metadata.status;
    const currentPeriodEnd = metadata.currentPeriodEnd;
    const now = Date.now();

    // If the subscription period has expired
    if (status && currentPeriodEnd && now > currentPeriodEnd) {
      const plan = metadata.plan;
      const period = metadata.period;
      const history = Array.isArray(metadata.history) ? metadata.history : [];
      
      // If it's active (and not canceled), "charge" them and renew
      if (status === 'active') {
        const price = plan === 'pro' ? (period === 'yearly' ? 162.00 : 18.99) : (period === 'yearly' ? 239.88 : 22.99);
        
        const renewalInvoice = {
            id: `inv_renew_${Math.random().toString(36).substring(2, 11)}`,
            date: now,
            amount: price,
            status: 'paid'
        };

        const newPeriodEnd = new Date(currentPeriodEnd);
        if (period === 'yearly') {
            newPeriodEnd.setFullYear(newPeriodEnd.getFullYear() + 1);
        } else {
            newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);
        }

        user.update({
            unsafeMetadata: {
                ...metadata,
                status: 'active',
                currentPeriodEnd: newPeriodEnd.getTime(),
                history: [renewalInvoice, ...history]
            }
        }).then(() => {
            console.log("Subscription auto-renewed successfully");
        });
      }
    }
  }, [user, isLoaded]);

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center pt-24"><p className="text-gray-400">Loading...</p></div>;
  if (!isSignedIn) return <RedirectToSignIn />;

  const metadata = user.unsafeMetadata || {};
  const plan = metadata.plan as string | undefined;
  const period = metadata.period as string | undefined;
  const status = metadata.status as string | undefined;
  const currentPeriodEnd = metadata.currentPeriodEnd as number | undefined;
  const history = (metadata.history as Array<{ id: string, date: number, amount: number, status: string }>) || [];

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You will retain access until the end of your current billing period.")) return;
    
    setIsCanceling(true);
    try {
      await user.update({
        unsafeMetadata: {
          ...metadata,
          status: 'canceled'
        }
      });
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
    } finally {
      setIsCanceling(false);
    }
  };

  const handleDeletePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
        setDeleteError("Please enter your password to confirm.");
        return;
    }

    setIsDeleting(true);
    setDeleteError("");

    // Mock password verification success
    try {
        await user.update({
            unsafeMetadata: {} // Fully wipe all subscription data
        });
        setShowDeleteModal(false);
        setPassword("");
        window.location.href = "/#pricing"; // Force refresh to home pricing
    } catch (error) {
        setDeleteError("Failed to delete plan. Please try again.");
    } finally {
        setIsDeleting(false);
    }
  };

  const isActive = status === 'active';
  const planDisplayName = plan === 'pro' ? 'Pro Plan' : plan === 'ultra' ? 'Ultra Plan' : 'Free Plan';
  
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Billing & Subscription</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
        {/* Subscription Info Card */}
        <div className="md:col-span-2 space-y-8">
          <div className="glassmorphism p-8 rounded-custom border border-white/10 shadow-neon-blue">
            <h2 className="text-2xl font-bold mb-6">Current Plan</h2>
            
            {plan ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start border-b border-white/10 pb-6">
                  <div>
                    <h3 className="text-xl font-bold text-primary capitalize">{planDisplayName}</h3>
                    <p className="text-gray-400 capitalize">{period} billing</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      status === 'active' ? 'bg-green-500/20 text-green-400' : 
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {status}
                    </span>
                  </div>
                </div>

                <div className="py-2">
                  <p className="text-gray-300">
                    {status === 'active' && "Your subscription will auto-renew on:"}
                    {status === 'canceled' && "Your access will remain active until:"}
                  </p>
                  <p className="text-xl font-bold mt-1">
                    {currentPeriodEnd ? new Date(currentPeriodEnd).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                  </p>
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  {isActive && (
                    <button 
                      onClick={handleCancel}
                      disabled={isCanceling}
                      className="px-6 py-2 rounded-custom border border-red-500/50 text-red-400 hover:bg-red-500/10 font-bold transition-all disabled:opacity-50"
                    >
                      {isCanceling ? 'Canceling...' : 'Cancel Subscription'}
                    </button>
                  )}
                  
                  <button 
                    onClick={() => setShowDeleteModal(true)}
                    className="px-6 py-2 rounded-custom bg-red-600/10 border border-red-600/30 text-red-600 hover:bg-red-600 hover:text-white font-bold transition-all"
                  >
                    Delete Plan Completely
                  </button>

                  {(status === 'canceled' || !isActive) && (
                    <Link href="/#pricing">
                      <button className="px-6 py-2 rounded-custom bg-primary text-white font-bold hover:bg-blue-600 transition-all shadow-neon-blue">
                        Change / Resubscribe
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 mb-6">You are currently on the Free plan.</p>
                <Link href="/#pricing">
                  <button className="px-8 py-3 rounded-custom bg-primary text-white font-bold hover:bg-blue-600 transition-all shadow-neon-blue">
                    Upgrade Now
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Invoice History */}
          <div className="glassmorphism p-8 rounded-custom border border-white/10">
            <h2 className="text-2xl font-bold mb-6">Invoice History</h2>
            
            {history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-sm">
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium text-right">Invoice ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((invoice, idx) => (
                      <tr key={idx} className="border-b border-white/5 last:border-0 text-sm">
                        <td className="py-4 whitespace-nowrap">{new Date(invoice.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                        <td className="py-4">${invoice.amount.toFixed(2)}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 flex items-center w-max rounded text-xs uppercase font-bold ${invoice.status === 'paid' ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-gray-400'}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="py-4 text-right text-gray-500 font-mono text-xs">{invoice.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 italic">No previous invoices found.</p>
            )}
          </div>
        </div>

        {/* Sidebar Help */}
        <div className="space-y-6">
          <div className="glassmorphism p-6 rounded-custom border border-white/10 bg-white/5">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">Need Help?</h3>
            <p className="text-sm text-gray-400 mb-4">
              If you have any questions about your subscription or billing history, please contact our support team.
            </p>
            <button className="w-full py-2 rounded border border-white/20 hover:bg-white/10 transition-all text-sm font-bold">
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Password Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="glassmorphism max-w-md w-full p-8 rounded-custom border border-red-500/30 shadow-2xl relative">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                
                <h2 className="text-2xl font-bold mb-4 text-red-500">Security Check</h2>
                <p className="text-gray-400 mb-6 text-sm">
                    Deleting your plan is a permanent action. To proceed, please enter your account password to confirm your identity.
                </p>

                <form onSubmit={handleDeletePlan} className="space-y-4 text-white">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                        <input 
                            type="password" 
                            required
                            autoFocus
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Type anything to simulate verification"
                            className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-red-500"
                        />
                    </div>
                    
                    {deleteError && <p className="text-red-500 text-xs">{deleteError}</p>}

                    <button 
                      type="submit" 
                      disabled={isDeleting}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-custom font-bold transition-all disabled:opacity-50"
                    >
                      {isDeleting ? 'Verifying...' : 'Permanently Delete Plan'}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}

