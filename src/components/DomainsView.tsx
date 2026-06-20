import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Globe, Cpu, ShieldCheck, Paintbrush, BarChart2, Cloud, Smartphone, TrendingUp, Award, Clock, Star, PlayCircle, Layers, ArrowRight } from 'lucide-react';
import { Course } from '../types';

export default function DomainsView() {
  const { domains, courses, setCurrentView, setSelectedCourseId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string | null>(null);

  // Filter domains based on search
  const filteredDomains = domains.filter((d) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = d.name.toLowerCase().includes(query) || d.description.toLowerCase().includes(query);
    return matchesSearch;
  });

  // Filter courses based on search AND domain filter
  const filteredCourses = courses.filter((c) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query) || c.tags.some(t => t.toLowerCase().includes(query));
    const matchesDomain = selectedDomainFilter ? c.domainId === selectedDomainFilter : true;
    return matchesSearch && matchesDomain;
  });

  // Custom icon renderer for domains matching screenshots
  const renderDomainIcon = (iconName: string) => {
    const classProps = "w-6 h-6 text-[#4be277]";
    switch (iconName) {
      case 'Terminal': return <Globe className={classProps} />;
      case 'Brain': return <Cpu className="w-6 h-6 text-purple-400" />;
      case 'ShieldAlert': return <ShieldCheck className="w-6 h-6 text-rose-400" />;
      case 'Framer': return <Paintbrush className="w-6 h-6 text-blue-400" />;
      case 'BarChart3': return <BarChart2 className={classProps} />;
      case 'Cloud': return <Cloud className="w-6 h-6 text-emerald-400" />;
      default: return <Layers className={classProps} />;
    }
  };

  const handleCourseClick = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('course');
  };

  return (
    <div className="pt-24 pb-16 px-4 md:px-12 max-w-7xl mx-auto text-left animate-fade-in min-h-screen">
      
      {/* Search Header Container */}
      <div className="flex flex-col items-center text-center mb-16 max-w-2xl mx-auto space-y-6">
        <h1 className="font-sans text-4xl md:text-5xl font-extrabold text-white">
          Master Your <span className="text-[#4be277]">Craft</span>
        </h1>
        <p className="text-[#bccbb9] text-sm md:text-base leading-relaxed">
          Explore our curated learning paths designed for the modern engineer. From low-level systems to high-level AI, architecture your journey to mastery.
        </p>

        {/* Real Search Bar */}
        <div className="w-full relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-[#bccbb9] group-focus-within:text-[#4be277] transition-colors" />
          </div>
          <input 
            type="text"
            id="domainSearch"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a domain or course (e.g. AI, Backend, Rust, Raft...)"
            className="w-full h-14 pl-12 pr-4 bg-[#131b2e]/60 border border-[#3d4a3d]/40 rounded-xl font-sans text-sm text-white placeholder:text-[#bccbb9]/40 focus:outline-none focus:border-[#4be277] focus:ring-1 focus:ring-[#4be277] transition-all"
          />
        </div>
      </div>

      {/* Main Categories Section */}
      <div className="mb-10 flex items-center justify-between">
        <h2 className="font-sans text-xl font-bold text-white tracking-tight">
          {searchQuery ? 'Search Outcomes' : 'Technical Learning Domains'}
        </h2>
        {selectedDomainFilter && (
          <button 
            onClick={() => setSelectedDomainFilter(null)}
            className="text-xs text-[#4be277] hover:underline bg-[#4be277]/10 px-3 py-1 rounded"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Domain Bento Grid matching screen 2 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
        
        {/* Large Web Dev Card */}
        {filteredDomains.some(d => d.slug === 'web-dev') && (
          <div 
            onClick={() => setSelectedDomainFilter(selectedDomainFilter === 'dom1' ? null : 'dom1')}
            className={`md:col-span-8 group bg-[#131b2e]/60 rounded-xl p-8 flex flex-col md:flex-row gap-8 transition-all cursor-pointer overflow-hidden relative border ${
              selectedDomainFilter === 'dom1' ? 'border-[#4be277] shadow-[0_0_15px_rgba(75,226,119,0.15)]' : 'border-[#3d4a3d]/20 hover:border-[#4be277]/30'
            }`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4be277]/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="flex-1 z-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[#4be277]/10 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-[#4be277]" />
                  </div>
                  <span className="font-mono text-xs font-bold text-[#4be277] bg-[#4be277]/5 px-2 py-0.5 rounded uppercase">
                    WEB_ARCH
                  </span>
                </div>
                <h3 className="font-sans text-2xl font-bold text-white">Web Development</h3>
                <p className="text-[#bccbb9] text-xs leading-relaxed mt-2.5 max-w-md">
                  Master the full stack from high-performance React patterns to distributed backend architectures and edge computing.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-6">
                {['React', 'Node.js', 'GraphQL', 'PostgreSQL', 'Next.js'].map(tag => (
                  <span key={tag} className="px-2.5 py-0.5 rounded-full bg-[#171f33] text-[#bccbb9] text-[10px] font-medium font-sans">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="w-full md:w-64 h-44 md:h-auto rounded-lg overflow-hidden shrink-0 z-10 border border-[#3d4a3d]/20">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAi2oV9gzs7mhOqfYMdBE1hCRls0Ks2Jf6rQrT3kk1dvwYiHs4fUjX-0DfzUzvwWw-t0smM7MifILIUUjEUQJynw0OWl4ZnZCvUeKTeYU1kd2LT7GnF3YNN-RfL3TVQMjxqFYajlugGK_qGbJWzZEZMgZni5RkYUF6vaMZfHJwX8wav5ggtf_A5LWKn75V1lwDOmI3gU7AcHmMvTe6AJie1MKS6NZD84Im4x6qiYhAM2PNuAbQyHtXaZZszIb_mx8mu96bbg7zPrLo" 
                alt="Web Dev Visual Block" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        )}

        {/* Dynamic smaller cards for additional domains matching screenshots */}
        {filteredDomains.filter(d => d.slug !== 'web-dev').map((d) => {
          const isFilterActive = selectedDomainFilter === d.id;
          return (
            <div 
              key={d.id}
              onClick={() => setSelectedDomainFilter(isFilterActive ? null : d.id)}
              className={`md:col-span-4 group bg-[#131b2e]/60 rounded-xl p-8 flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden border ${
                isFilterActive ? 'border-[#4be277] shadow-[0_0_15px_rgba(75,226,119,0.15)]' : 'border-[#3d4a3d]/20 hover:border-[#4be277]/30'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#131b2e] border border-[#3d4a3d]/20 flex items-center justify-center mb-6">
                  {renderDomainIcon(d.icon)}
                </div>
                
                {d.slug === 'ai-ml' && (
                  <span className="font-mono text-[9px] font-bold text-purple-400 bg-purple-400/5 px-2 py-0.5 rounded mb-3 inline-block tracking-wider">
                    NEURAL_NETS
                  </span>
                )}
                
                <h3 className="font-sans text-xl font-bold text-white mb-2">{d.name}</h3>
                <p className="text-[#bccbb9] text-[11px] leading-relaxed line-clamp-3">{d.description}</p>
              </div>

              {/* Decorative extra details exactly as screenshots */}
              <div className="mt-6 pt-4 border-t border-[#3d4a3d]/15 flex items-center justify-between text-[11px] text-[#4be277] font-sans font-semibold">
                {d.slug === 'ai-ml' && (
                  <div className="flex -space-x-1.5 overflow-hidden">
                    <div className="w-6 h-6 rounded-full bg-slate-700 border border-[#0b1326]" />
                    <div className="w-6 h-6 rounded-full bg-slate-600 border border-[#0b1326]" />
                    <div className="w-6 h-6 rounded-full bg-slate-500 border border-[#0b1326]" />
                  </div>
                )}
                {d.slug === 'cyber-security' && (
                  <>
                    <span className="text-[#bccbb9]">48 Path Moores</span>
                    <ShieldCheck className="w-4 h-4 text-rose-400" />
                  </>
                )}
                {d.slug === 'product-design' && (
                  <span className="text-[#bccbb9]">Full Figma Systems</span>
                )}
                {d.slug === 'data-science' && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4be277] animate-pulse"></span>
                    12 New Courses
                  </div>
                )}
                {d.slug === 'cloud-architecture' && (
                  <span className="text-[#bccbb9]">AWS, GCP, Azure</span>
                )}
                {d.slug !== 'cyber-security' && d.slug !== 'data-science' && d.slug !== 'cloud-architecture' && d.slug !== 'product-design' && (
                  <span className="hover:underline flex items-center gap-1">Explore Path <ArrowRight className="w-3.5 h-3.5" /></span>
                )}
              </div>
            </div>
          );
        })}

      </div>

      {/* Large Mobile Systems Promo Section */}
      {searchQuery === '' && !selectedDomainFilter && (
        <section className="mb-20 bg-[#131b2e]/40 rounded-2xl p-8 border border-[#3d4a3d]/20 relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4be277]/5 to-transparent pointer-events-none" />
          <div className="w-full md:w-1/3 aspect-video md:aspect-square max-w-[280px] rounded-2xl overflow-hidden border border-[#3d4a3d]/30 shrink-0 shadow-lg">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOshd3IKZE-PKH_i_llyG2-64s58E6gmRl9vGBNGXzZ5COkDyJEIBrjVxnpISj5nEGlopLePcByxYYAl_HAK2KxfcTz1kSzeJ9HXUibOVve40yXTt98N6729q6T3ZuicC1BcyxYAPrDuMagVWJwg-mSFpJWz6S976KbB7sq441HzvaUXYHJxcPdiZGGyCa9MQHD1Az-kkxVWu_L-PQ-MCi0VCHbvgpNY93aW9CtYi2Wslo1enZinvhcgvCqkqCK01Jg6ksnJCKSWBe" 
              alt="Mobile Systems Render Mock" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#4be277]" />
              <span className="font-mono text-xs font-bold text-[#4be277] tracking-widest bg-[#4be277]/10 px-2.5 py-1 rounded">MOBILE_OS</span>
            </div>
            <h3 className="font-sans text-2xl font-bold text-white">Mobile Systems Core Architecture</h3>
            <p className="text-[#bccbb9] text-xs leading-relaxed max-w-xl">
              Dive deep into native iOS/Android development, cross-platform memory safety, and thread rendering pools. Learn to build fluid, high-performance mobile applications that scale to millions of telemetry points.
            </p>
            <button 
              onClick={() => setSelectedDomainFilter('dom6')}
              className="bg-[#4be277] text-[#003915] px-6 py-2.5 rounded-lg text-xs font-bold font-sans hover:bg-[#22c55e] transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              Explore Path <TrendingUp className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* Courses Catalog Directory */}
      <h2 className="font-sans text-xl font-bold text-white mb-6 tracking-tight border-b border-[#3d4a3d]/20 pb-3">
        {selectedDomainFilter 
          ? `Courses under Selected Path` 
          : 'All Engineering Syllabi'} ({filteredCourses.length})
      </h2>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-[#131b2e]/30 rounded-xl border border-[#3d4a3d]/15">
          <p className="text-[#bccbb9] text-sm font-sans">No detailed syllabi matched your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div 
              key={course.id}
              onClick={() => handleCourseClick(course.id)}
              className="bg-[#131b2e]/60 group rounded-xl overflow-hidden border border-[#3d4a3d]/25 hover:border-[#4be277]/30 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="bg-[#0b1326]/80 text-[#4be277] font-mono text-[9px] tracking-wider uppercase font-bold px-2 py-0.5 rounded-full border border-[#4be277]/20">
                    {course.tags[0] || 'ADVANCED'}
                  </span>
                </div>

                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white font-sans">
                  {course.modules.length} Modules
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-sans text-base font-bold text-white group-hover:text-[#4be277] transition-colors leading-snug line-clamp-2">
                    {course.title}
                  </h4>
                  <p className="text-[#bccbb9] text-[11px] leading-relaxed mt-2 line-clamp-3">
                    {course.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#3d4a3d]/20 flex items-center justify-between text-xs text-[#bccbb9]">
                  <div className="flex items-center gap-2">
                    <img 
                      src={course.authorAvatar} 
                      alt={course.authorName} 
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-[10px] font-sans font-medium">{course.authorName}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-white">
                    {course.price && course.price > 0 ? `$${course.price.toFixed(2)}` : 'FREE'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
