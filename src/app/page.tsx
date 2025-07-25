import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card } from '@/components/ui/card'
import { BarChart3, DollarSign, PieChart, TrendingUp, Menu, User, Wifi, Battery, Signal } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 opacity-50"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>

      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <nav className="flex justify-between items-center backdrop-blur-sm bg-white/5 rounded-2xl px-6 py-3 border border-white/10">
          <div className="text-2xl font-bold text-white">💰 Spendly</div>
          <div className="hidden md:flex items-center space-x-8">
            <span className="text-gray-300 hover:text-white cursor-pointer">Features</span>
            <span className="text-gray-300 hover:text-white cursor-pointer">Use Cases</span>
            <span className="text-gray-300 hover:text-white cursor-pointer">Integrations</span>
            <span className="text-gray-300 hover:text-white cursor-pointer">Pricing</span>
            <span className="text-gray-300 hover:text-white cursor-pointer">Docs</span>
            <span className="text-gray-300 hover:text-white cursor-pointer">Blogs</span>
          </div>
          <Link href="/dashboard">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full">
              Get Started Free
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Track Your
              <br />
              <span className="text-gray-400">Spending</span>
              <br />
              <span className="text-gray-500">Effortlessly</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Manage your expenses with ease using our
              <br />
              intuitive, real-time tracker.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full text-lg">
                Start Tracking Now
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-full text-lg">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Mobile App Preview */}
          <div className="relative flex justify-center">
            <div className="relative">
              {/* Phone Frame */}
              <div className="w-80 h-[600px] bg-gradient-to-b from-slate-800 to-slate-900 rounded-[3rem] p-2 shadow-2xl border-2 border-slate-600">
                <div className="w-full h-full bg-gradient-to-b from-slate-900 to-slate-800 rounded-[2.5rem] overflow-hidden">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center px-6 py-3 text-white text-sm">
                    <span className="font-semibold">9:41</span>
                    <div className="flex items-center space-x-1">
                      <Signal className="w-4 h-4" />
                      <Wifi className="w-4 h-4" />
                      <Battery className="w-4 h-4" />
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="flex justify-between items-center px-6 py-4">
                    <Menu className="w-6 h-6 text-white" />
                    <h2 className="text-white font-semibold text-lg">Home</h2>
                    <User className="w-6 h-6 text-white" />
                  </div>

                  {/* Main Content */}
                  <div className="px-6 space-y-6">
                    {/* Net Worth Card */}
                    <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <div className="text-gray-400 text-sm mb-2">Total net worth</div>
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-white text-3xl font-bold">$324,750</span>
                        <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-xs">+2.8%</span>
                      </div>
                      <div className="text-gray-400 text-sm mb-4">
                        You've increased your net worth by <span className="text-white">$8,950</span>
                        <br />
                        this month. Great job!
                      </div>

                      {/* Time Filters */}
                      <div className="flex space-x-2 mb-4">
                        <span className="bg-slate-600/50 text-gray-300 px-3 py-1 rounded-full text-xs">Week</span>
                        <span className="bg-slate-600/50 text-gray-300 px-3 py-1 rounded-full text-xs">Month</span>
                        <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs">Year</span>
                      </div>

                      {/* Chart Area */}
                      <div className="relative h-32 mb-4">
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-emerald-500/20 to-transparent rounded-lg"></div>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <div className="text-white text-xs mt-1">$33,200</div>
                        </div>
                        <svg className="w-full h-full" viewBox="0 0 200 80">
                          <path
                            d="M 20 60 Q 60 40 100 35 T 180 25"
                            stroke="#10b981"
                            strokeWidth="2"
                            fill="none"
                            className="drop-shadow-lg"
                          />
                        </svg>
                      </div>

                      {/* Week Days */}
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-8 border border-white/10">
              <div className="text-sm text-gray-400 mb-2">Total Users</div>
              <div className="text-4xl font-bold text-white mb-2">200k+</div>
            </div>
            <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-8 border border-white/10">
              <div className="text-sm text-gray-400 mb-2">Total Downloads</div>
              <div className="text-4xl font-bold text-white mb-2">2.5M+</div>
            </div>
            <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-8 border border-white/10">
              <div className="text-sm text-gray-400 mb-2">Average Savings</div>
              <div className="text-4xl font-bold text-white mb-2">53%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-300">Everything you need to master your finances</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 text-center border border-white/10 hover:bg-white/10 transition-all duration-300">
            <BarChart3 className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="font-semibold mb-2 text-white">Smart Analytics</h3>
            <p className="text-gray-300 text-sm">AI-powered insights into your spending patterns</p>
          </div>
          <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 text-center border border-white/10 hover:bg-white/10 transition-all duration-300">
            <DollarSign className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="font-semibold mb-2 text-white">Automated Tracking</h3>
            <p className="text-gray-300 text-sm">Automatically categorize and track expenses</p>
          </div>
          <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 text-center border border-white/10 hover:bg-white/10 transition-all duration-300">
            <PieChart className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="font-semibold mb-2 text-white">Custom Budgets</h3>
            <p className="text-gray-300 text-sm">Set personalized budgets and spending limits</p>
          </div>
          <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 text-center border border-white/10 hover:bg-white/10 transition-all duration-300">
            <TrendingUp className="h-12 w-12 text-orange-400 mx-auto mb-4" />
            <h3 className="font-semibold mb-2 text-white">Goal Tracking</h3>
            <p className="text-gray-300 text-sm">Track savings goals and financial milestones</p>
          </div>
        </div>
      </section>
    </div>
  )
}