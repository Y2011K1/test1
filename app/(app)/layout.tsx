import React from 'react'
import { SanityLive } from '@/sanity/lib/live'
import Navbar from '@/components/Navbar'

function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="pt-12 md:pt-16">
            <Navbar />
            {children}
            <SanityLive />
        </div>
    )
}

export default AppLayout