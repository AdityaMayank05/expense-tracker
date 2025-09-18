'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import { usePathname } from 'next/navigation'
import { FinancialDataProvider } from '@/providers/FinancialDataProvider'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return (
    <html lang="en" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Set dark mode as default
              if (localStorage.getItem('darkMode') === null) {
                localStorage.setItem('darkMode', 'true');
              }
              if (localStorage.getItem('darkMode') === 'true') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            `
          }}
        />
      </head>
      <body className={inter.className}>
        <FinancialDataProvider>
          <div className="flex h-screen bg-background">
            {!isHomePage && <Sidebar />}
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </FinancialDataProvider>
      </body>
    </html>
  )
}
