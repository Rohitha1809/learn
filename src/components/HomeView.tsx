import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowUpRight, TrendingUp, Cpu, Server, ShieldCheck, Paintbrush, ArrowRight, Star, Users, Terminal } from 'lucide-react';

export default function HomeView() {
  const { setCurrentView, currentUser } = useApp();

  const featuredIntros = [
    {
      title: 'Web Development',
      slug: 'web-dev',
      cols: 'md:col-span-8',
      accent: 'border-l-4 border-[#4be277]',
      tags: ['RESONANCE', 'REACT'],
      desc: 'Master full-stack systems with architectures built for massive scale and resilience.',
      bg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvTYujwr6j7AimMrFYo28B1wz_RRwwJiCS3f-jixWiy5yZsFWXSywBG-5QGMi2cT0gnVCYYlzUul6j_t0kkBJ6rOAJMxKJtvoSNf-Zexd79JaXFYpqtr6aawmbS66uGWIPzpD0a37AR4W6BCnFYnpVXV_525HduIlAv9JSCXEnzYEzQbeAzDKPWIL2UCzpu_Qj6bk36GjpbBT9AT4Mq81UvMtPPCb25wAO1ozzt9H69E8cy1g6dcO-2Fy8PePyjUDjx-a-RBcmcaKW',
    },
    {
      title: 'AI & ML',
      slug: 'ai-ml',
      cols: 'md:col-span-4',
      accent: 'border-l-4 border-purple-400',
      tags: ['NEURAL'],
      desc: 'Deep dive into transformers, generative models, and high-speed data pipelines.',
      bg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvpMQvQ-DtHEGP7KJ4BaRRu06Ymu_gRgqbSeSBukxKiweUnnu9Y7t8skxiIgjf_luqqxFGRxBUhNhChiH048LY6Dm1x1IH2cFKrOGOTdEUaMKvQkSwdEekiSjgGLiMkY1JnCuim7suPpUisxNDS7gDrz1cbRMXqWxsc1rzs2bAGIR2OBLPtuthpi08mvEokoocxbG0B3xI5UwmUFqMKtgPiu2QOWpUpmTdPcVcUltFJOrawEtb6h20Iq31Ce9C5ysJ0wd7IC-uTDlK',
    },
    {
      title: 'Product Design',
      slug: 'product-design',
      cols: 'md:col-span-4',
      accent: 'border-l-4 border-blue-400',
      tags: ['VISUAL'],
      desc: 'Architecting interfaces that bridge the gap between human and machine.',
      bg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT0g1wB4I0mR7NmXKrQohXwA-aUPrLaipihQNqFGgFc7knx0S0D6pivT5ThP2-6nsYPzdlmITfTofmqv0WlDB61-Q1s_UPuB6HaYZ13ys9WtgBnFGqkq1pGxYepuC03xkIVogy61DYX_1QF3eSNwl1ll15pzt2MLi0KacDmhPwguGRJPuxoiv3QesU756b7UT50m3MauJ1DVV7n1kOezc76m6ImOMkDL26_1MEvN99Mem5cEFml4TqUp5UVTLzBEgAMDqfktPEGb8-',
    },
    {
      title: 'Cybersecurity',
      slug: 'cyber-security',
      cols: 'md:col-span-8',
      accent: 'border-l-4 border-rose-500',
      tags: ['SECURITY'],
      desc: 'Learn to defend the perimeter with advanced ethical hacking and systems hardening techniques.',
      bg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQljyxMyyfnMaUa0KzEPYtaLvjmIZxmpEeO4embBinRb59LOZ0DonbL7dffbCOrtz5qxQ-9HIo6NWQd3jGeBUSUlvJ1FDNkuhiba42Xgu-Hps_ja_d8KBG-Iq8oY5D_ct4uRNff5YlCgfPOrjbWVOhnYD-1gWrBUriXh2XGQXz8fnnhAKJh22oDWUZK1AGM4Mokl0Ylenwxcwyhsz8efplKYsMU-mnix2AV82i_7nidhArt-Lh9R4oASSS9GkHJqo6BJBswi_yAzHr',
    }
  ];

  const instructors = [
    {
      name: 'Alex Rivet',
      title: 'Full-Stack Maestro',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChBBPgrMA-HTnu9ZVuWIXbm3h3I2NjRPcmXzb_PuZe2Gxu_j9t5lMnTy3wvFkP2eSx9JkJEg_73YJXnu5YM25KZr9Z-mSjvjvWdbnY2vP68lBwe0feIHWYvIX5smgD-Zy-YdKuCu-upP_siEniw2EDJngCyeMxosrAr6s-EyZabS51QEs33vJX1E1lFwGHfaq1NMztGPXqEJ04z8DruupI_x2tZezhTO9hYHoXkWoaH8kR_8tPb8mPvXfuno8IyeBbZrl9a_pcVKJD',
      desc: 'Ex-FAANG engineer specializing in high-concurrency Node.js microservices.',
      enrolled: '12.4k',
      rating: '4.9'
    },
    {
      name: 'Dr. Sarah Chen',
      title: 'ML Specialist',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA44wsx6QhViZDvHSDfVUVjOvwKFGf7L35wG2KkRWnaXX53U-fMY7oMb-pIjbI9IS2gdy89ljLhez77GQVeVhcovCvIHUMQZ56KGh-L7pAH07DHTkaSyRqzC_VZs3rEBbKemzG_LPSHvuF7HjjF9rYn04dVTQtnRtt8Mr53zYIMqwPJYS-4DvKIcohy1oY0bMHurSIOagelkSnbK7sh9CLQZDqxLMNo_XzDKoY5jecguaTDbsQkbGZprMpsjgfFSwxeJnixJQPp_ciXU',
      desc: 'Lead Researcher focused on LLM fine-tuning and agentic architectures.',
      enrolled: '8.9k',
      rating: '5.0'
    },
    {
      name: 'Marcus Volt',
      title: 'Design Systems Lead',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4aSGZY1JpECXFEvDYUM55gHDGB6eNc4-Bn2U5MSPaTVS958ekZWUuUwdAPw1Epimm3mnQdRPILU2C0VH-UnGmouVuWoAAn34Yv82obhj0HTeFLZOY2ckoWLHa7syvHr1hVRea2Vll6CtXV0upPla2fZ2HAdPjKjRoPLg2QFmH_Ve1vxLnw-q38kMfAr4dxZ5K-OcIK3_nxQxcCFkRBs56HqpkNcGJkT0gxwDEraegDfjEHdTdzREoVJt7yEAgeFbuv7BW1u6mCInr',
      desc: 'Building scalable UI libraries for Fortune 500 tech products.',
      enrolled: '21k',
      rating: '4.8'
    },
    {
      name: 'Elena "Cipher" Ross',
      title: 'Ethical Hacker',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-8DjOTzBtQWsLDWH7wXhrRKDw9_eoifQoofvJfoTLcufg1pz8apxMXrv7BHNILdpDPobWlZ3f45FfIH5pShCfGDU7HzX3v6-o92qOvoYCIifHkSas0zDrDWjxAG1uDIrs9QY2nobdjLQOgYraR5YQGDA0_su_3dEGIH4YcG1gGXo4o6ZoFBp6Yoj6DJ4g_tSyza4e3wpFutQCgmnmI5Hc1l3PiKOC3-QTtcQgve8IvgcJYJhdRds7yo9F9YnGWZdSviKJ3Rbw3RCF',
      desc: 'Ex-Gov security consultant teaching defensive architecture and pen-testing.',
      enrolled: '15.2k',
      rating: '4.9'
    }
  ];

  return (
    <div className="text-[#dae2fd] animate-fade-in">
      
      {/* Hero Section */}
      <section className="relative min-h-[640px] flex items-center justify-center overflow-hidden px-4 md:px-12 py-16">
        
        {/* Glow Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(75,226,119,0.08)_0%,transparent_70%)] -z-10" />
        
        <div className="max-w-4xl text-center space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4be277]/10 border border-[#4be277]/20 text-[#4be277] font-mono text-xs uppercase tracking-widest">
            <TrendingUp className="w-4 h-4 text-[#4be277] animate-pulse" />
            Architecting the Future of Learning
          </div>

          <h1 className="font-sans text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight">
            Learn. Create. <span className="text-[#4be277] italic">Share.</span>
          </h1>

          <p className="font-sans text-base md:text-lg text-[#bccbb9] max-w-2xl mx-auto leading-relaxed">
            A dual-sided marketplace designed for high-performance learning and streamlined content creation. Master the industry's most demanding tech domains with precision.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button 
              onClick={() => setCurrentView('domains')}
              className="px-8 py-4 bg-[#4be277] text-[#003915] font-bold rounded-xl shadow-lg shadow-[#4be277]/20 hover:shadow-[#4be277]/40 hover:brightness-110 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              Start Learning
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setCurrentView('domains')}
              className="px-8 py-4 bg-transparent border border-[#bccbb9]/30 hover:border-[#4be277]/40 text-white font-bold rounded-xl hover:bg-[#171f33]/40 transition-all cursor-pointer active:scale-95"
            >
              Browse Domains
            </button>
          </div>
        </div>

        {/* Floating Decos */}
        <div className="absolute top-1/2 -left-24 w-64 h-64 bg-[#4be277]/5 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute bottom-0 -right-24 w-96 h-96 bg-blue-500/5 blur-[150px] rounded-full -z-10"></div>
      </section>

      {/* Featured Domains Bento Grid */}
      <section className="py-16 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="mb-12 text-left">
          <h2 className="font-sans text-3xl font-bold text-white tracking-tight">Featured Domains</h2>
          <div className="h-1 w-24 bg-[#4be277] mt-3 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {featuredIntros.map((item) => (
            <div 
              key={item.slug}
              onClick={() => { setCurrentView('domains'); }}
              className={`${item.cols} bg-[#131b2e]/60 group cursor-pointer overflow-hidden rounded-xl border border-[#3d4a3d]/20 relative p-8 min-h-[280px] flex flex-col justify-end transition-all duration-500 hover:-translate-y-2 hover:border-[#4be277]/40`}
            >
              <div 
                className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity duration-500 bg-cover bg-center -z-10"
                style={{ backgroundImage: `url(${item.bg})` }}
              />

              <div className="relative z-10 space-y-3">
                <div className="flex gap-2">
                  {item.tags.map(t => (
                    <span key={t} className="px-2.5 py-0.5 rounded bg-[#4be277]/10 text-[#4be277] font-mono text-[10px] tracking-widest font-bold">
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="font-sans text-2xl font-bold text-white group-hover:text-[#4be277] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[#bccbb9] text-xs leading-relaxed max-w-md">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Instructors */}
      <section className="py-20 bg-[#131b2e]/40 px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="text-left">
              <h2 className="font-sans text-3xl font-bold text-white tracking-tight">Top Instructors</h2>
              <p className="text-[#bccbb9] text-sm mt-2">Learn from creators who have shipped massive software systems at scale.</p>
            </div>
            <button 
              onClick={() => setCurrentView('domains')}
              className="flex items-center gap-2 text-[#4be277] font-semibold text-sm hover:underline cursor-pointer transition-all self-start md:self-auto"
            >
              View all authors <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructors.map((ins, i) => (
              <div 
                key={i}
                className="group relative p-6 rounded-xl bg-[#131b2e]/80 border border-[#3d4a3d]/20 transition-all duration-300 hover:bg-[#171f33]"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden mb-4 ring-2 ring-[#4be277]/20 ring-offset-4 ring-offset-[#0b1326]">
                  <img 
                    src={ins.avatar} 
                    alt={ins.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-sans text-lg font-bold text-white group-hover:text-[#4be277] transition-colors">
                  {ins.name}
                </h4>
                <p className="text-[#4be277] font-mono text-[10px] tracking-wider uppercase font-bold mt-1">
                  {ins.title}
                </p>
                <p className="text-[#bccbb9] text-xs mt-3 line-clamp-2 leading-relaxed">
                  {ins.desc}
                </p>
                
                <div className="mt-4 flex items-center gap-4 text-[#bccbb9] border-t border-[#3d4a3d]/25 pt-3">
                  <span className="flex items-center gap-1.5 font-mono text-xs">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    {ins.enrolled}
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-xs">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    {ins.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 px-4 md:px-12 text-center relative overflow-hidden max-w-7xl mx-auto">
        <div className="relative overflow-hidden p-12 rounded-2xl border border-[#4be277]/20 bg-[linear-gradient(135deg,rgba(11,19,38,0.9),rgba(19,27,46,0.6))]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(75,226,119,0.05)_0%,transparent_70%)] -z-10" />
          <h2 className="font-sans text-3xl font-extrabold text-white mb-4">Ready to Architect Your Future?</h2>
          <p className="text-[#bccbb9] text-sm md:text-base max-w-lg mx-auto mb-8">
            Join over 50,000 architectural creators and learners building the next generation of high-concurrency technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setCurrentView(currentUser ? 'domains' : 'auth')}
              className="px-8 py-3.5 bg-[#4be277] text-[#003915] font-bold rounded-xl shadow-md hover:shadow-[#4be277]/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer text-xs"
            >
              Get Started Now
            </button>
            <button 
              onClick={() => setCurrentView('domains')}
              className="px-8 py-3.5 bg-transparent border border-[#bccbb9]/40 hover:border-white text-white font-bold rounded-xl hover:bg-[#171f33]/50 transition-all cursor-pointer active:scale-95 text-xs"
            >
              View Courses
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 bg-[#060e20] border-t border-[#3d4a3d]/20 text-[#bccbb9]">
        <div className="max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-left space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-sans text-lg font-bold text-white">LearnDcrack</span>
            </div>
            <p className="text-xs text-[#bccbb9] max-w-sm leading-relaxed">
              The leading marketplace for technical mastery and creative architecting. Built for the modern developer.
            </p>
            <p className="text-[11px] text-[#bccbb9]/60">© 2026 LearnDcrack. Architecting Mastery.</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-xs text-left">
            <div className="space-y-3">
              <h5 className="text-white font-bold uppercase tracking-wider text-[10px]">Platform</h5>
              <ul className="space-y-1.5">
                <li><button onClick={() => setCurrentView('home')} className="hover:text-white cursor-pointer hover:underline">Home</button></li>
                <li><button onClick={() => setCurrentView('domains')} className="hover:text-white cursor-pointer hover:underline">Domains</button></li>
                <li><button onClick={() => setCurrentView('domains')} className="hover:text-white cursor-pointer hover:underline">Search</button></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h5 className="text-white font-bold uppercase tracking-wider text-[10px]">Creators</h5>
              <ul className="space-y-1.5">
                <li><button onClick={() => setCurrentView('create')} className="hover:text-white cursor-pointer hover:underline">Become Author</button></li>
                <li><button onClick={() => setCurrentView('create')} className="hover:text-white cursor-pointer hover:underline">Guidelines</button></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h5 className="text-white font-bold uppercase tracking-wider text-[10px]">Legal</h5>
              <ul className="space-y-1.5">
                <li><a href="#" className="hover:text-white hover:underline">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white hover:underline">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
