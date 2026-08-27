'use client';

import { DotmCircular7 as Loader2 } from '@/components/ui/dotm-circular-7';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Sparkles, 
  Plus, 
  ExternalLink, 
  Edit, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Building2, 
  ShieldCheck, 
  Globe, 
  Star,
  Check,
  Eye,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { IPServiceConfig, parseIPServiceConfig, DEFAULT_SERVICES_LIST } from '@/lib/ip-services-config';

export default function AdminIPServicesPage() {
  const [services, setServices] = useState<IPServiceConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newCategory, setNewCategory] = useState('tech-operations');
  const [newSubcategory, setNewSubcategory] = useState('Tech Operations');
  const [newDescription, setNewDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .or('type.eq.ip_services,category.eq.ip-services,category.eq.tech-operations,category.eq.tech-way,category.eq.future-service-hub')
        .order('created_at', { ascending: true });

      if (data && data.length > 0) {
        const parsed = data.map(item => parseIPServiceConfig(item));
        
        // Sort with PSS first, Genie second or by display_order
        parsed.sort((a, b) => {
          if (a.slug === 'pss-solutions') return -1;
          if (b.slug === 'pss-solutions') return 1;
          if (a.slug === 'genie-ai') return -1;
          if (b.slug === 'genie-ai') return 1;
          return (a.display_order || 0) - (b.display_order || 0);
        });

        setServices(parsed);
      } else {
        setServices(DEFAULT_SERVICES_LIST);
      }
    } catch (err: any) {
      console.error("Failed to load IP services:", err);
      setServices(DEFAULT_SERVICES_LIST);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      await supabase.from('resources').update({ is_featured: !currentStatus }).eq('id', id);
      setServices(prev => prev.map(s => s.id === id ? { ...s, is_featured: !currentStatus } : s));
      showToast("Updated featured status");
    } catch (e: any) {
      showToast("Error updating status: " + e.message, 'error');
    }
  };

  const handleToggleSponsored = async (id: string, currentStatus: boolean) => {
    try {
      await supabase.from('resources').update({ is_splash_sponsored: !currentStatus }).eq('id', id);
      setServices(prev => prev.map(s => s.id === id ? { ...s, is_splash_sponsored: !currentStatus } : s));
      showToast("Updated sponsored status");
    } catch (e: any) {
      showToast("Error updating status: " + e.message, 'error');
    }
  };

  const handleDeleteService = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
    try {
      const { error } = await supabase.from('resources').delete().eq('id', id);
      if (error) throw error;
      setServices(prev => prev.filter(s => s.id !== id));
      showToast(`Deleted ${title}`);
    } catch (e: any) {
      showToast("Error deleting: " + e.message, 'error');
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsCreating(true);

    const generatedSlug = newSlug.trim() || newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const initialConfig: IPServiceConfig = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      slug: generatedSlug,
      category: newCategory,
      subcategory: newSubcategory,
      description: newDescription.trim(),
      url: "",
      external_url: "",
      is_featured: false,
      is_splash_sponsored: false,
      display_order: services.length + 1,
      theme: {
        primaryColor: "#5a32fa",
        accentColor: "#4a24db",
        gradientFrom: "from-sky-100 dark:from-[#082f49]",
        gradientTo: "to-slate-100 dark:to-black",
        badgeLabel: "Specialist Partner",
        badgeBg: "bg-purple-500/10",
        badgeText: "text-purple-600 dark:text-purple-400"
      },
      hero: {
        headline: newTitle.trim(),
        subheadline: newDescription.trim() || "Specialist IP services and advisory for global IP leaders.",
        ctaText: "Visit Provider",
        ctaUrl: "#",
        logoUrl: ""
      },
      about: {
        heading: "About " + newTitle.trim(),
        paragraphs: [newDescription.trim() || "Providing high-value intellectual property services."],
        quote: ""
      },
      metrics: [
        { label: "Client Satisfaction", value: "99%", icon: "Star" },
        { label: "Global Reach", value: "Worldwide", icon: "Globe" }
      ],
      offer: {
        enabled: false,
        badge: "Exclusive WIPA Member Benefit",
        title: "Special member discount available",
        description: "Special pricing available for active WIPA members.",
        discount: "10% Off",
        promoCode: "WIPA",
        ctaText: "Claim Member Benefit",
        ctaUrl: "#",
        contactEmail: ""
      },
      services: ["IP Strategy", "Portfolio Management", "Advisory"],
      tabs: ["Overview"]
    };

    try {
      const { data, error } = await supabase.from('resources').insert({
        id: initialConfig.id,
        title: initialConfig.title,
        slug: initialConfig.slug,
        category: initialConfig.category,
        subcategory: initialConfig.subcategory,
        description: initialConfig.description,
        type: 'ip_services',
        url: '',
        content: JSON.stringify(initialConfig),
        is_featured: false,
        is_splash_sponsored: false,
        approval_status: 'approved'
      }).select().single();

      if (error) throw error;

      const created = parseIPServiceConfig(data);
      setServices(prev => [...prev, created]);
      setIsAddModalOpen(false);
      setNewTitle('');
      setNewSlug('');
      setNewDescription('');
      showToast(`Created ${created.title}! You can now open the Visual Editor to customize it.`);
    } catch (err: any) {
      showToast("Failed to create IP service: " + err.message, 'error');
    }
    setIsCreating(false);
  };

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  const filteredServices = services.filter(s => 
    s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.subcategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.slug?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {message && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-white font-bold animate-in fade-in slide-in-from-top-4 duration-300 ${
          message.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
        }`}>
          {message.type === 'error' ? <AlertCircle size={20} /> : <Check size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles size={14} /> Directory & Customizer
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
            IP Services Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">
            Manage provider listings, customize brand themes, edit marketing copy, and configure member discount offers.
          </p>
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#5a32fa] hover:bg-[#4924dc] text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all hover:-translate-y-0.5 active:scale-95 text-sm"
        >
          <Plus size={18} /> Add New IP Service
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-gray-400">Total Services</span>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{services.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-[#5a32fa]">
            <Building2 size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-gray-400">Sponsored Partners</span>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
              {services.filter(s => s.is_splash_sponsored).length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-500">
            <Sparkles size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-gray-400">Featured Providers</span>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
              {services.filter(s => s.is_featured).length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center text-sky-500">
            <Star size={24} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#1e293b] p-4 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-4">
        <Search size={20} className="text-gray-400 ml-2" />
        <input 
          type="text" 
          placeholder="Search by company name, category, or subcategory..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-sm font-medium"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-xs font-bold text-gray-400 hover:text-gray-600 mr-2">
            Clear
          </button>
        )}
      </div>

      {/* Services Table */}
      <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-16">
            <Loader2 size={36} className="animate-spin text-[#5a32fa]" />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400 font-medium">
            No IP services matched your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-bold">
                  <th className="p-5 border-b border-gray-200 dark:border-white/10">Brand / Service</th>
                  <th className="p-5 border-b border-gray-200 dark:border-white/10">Category</th>
                  <th className="p-5 border-b border-gray-200 dark:border-white/10">Theme / Color</th>
                  <th className="p-5 border-b border-gray-200 dark:border-white/10">Special Offer</th>
                  <th className="p-5 border-b border-gray-200 dark:border-white/10">Status</th>
                  <th className="p-5 border-b border-gray-200 dark:border-white/10 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredServices.map((service, index) => {
                  const isPss = service.slug === 'pss-solutions';
                  const isGenie = service.slug === 'genie-ai';
                  const publicUrl = `/platform/resources/ip-services/${service.slug || service.id}`;
                  const primaryColor = service.theme?.primaryColor || '#5a32fa';

                  return (
                    <tr key={service.id} className="hover:bg-gray-50/80 dark:hover:bg-white/5 transition-colors">
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center p-2 shrink-0 overflow-hidden">
                            {service.url ? (
                              <img src={service.url} alt={service.title} className="max-w-full max-h-full object-contain" />
                            ) : (
                              <Building2 size={24} className="text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-gray-900 dark:text-white text-base">
                                {service.title}
                              </h4>
                              {isPss && (
                                <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-[10px] font-black uppercase">
                                  Primary Sponsor
                                </span>
                              )}
                              {isGenie && (
                                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-black uppercase">
                                  AI Partner
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-sm mt-0.5">
                              {service.description || "No description provided."}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-5">
                        <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-full text-xs font-bold border border-gray-200 dark:border-white/5">
                          {service.subcategory || service.category}
                        </span>
                      </td>

                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                            style={{ backgroundColor: primaryColor }}
                          />
                          <span className="text-xs font-mono text-gray-600 dark:text-gray-300">
                            {primaryColor}
                          </span>
                        </div>
                      </td>

                      <td className="p-5">
                        {service.offer?.enabled !== false && service.offer?.discount ? (
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-purple-600 dark:text-purple-400">
                              {service.offer.discount}
                            </span>
                            {service.offer.promoCode && (
                              <span className="text-[10px] font-mono bg-purple-50 dark:bg-purple-950 px-1.5 py-0.5 rounded w-max text-purple-700 dark:text-purple-300 mt-0.5">
                                Code: {service.offer.promoCode}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium">None</span>
                        )}
                      </td>

                      <td className="p-5">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleToggleFeatured(service.id, !!service.is_featured)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                              service.is_featured 
                                ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300' 
                                : 'bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400'
                            }`}
                            title="Toggle Featured"
                          >
                            {service.is_featured ? '★ Featured' : '☆ Standard'}
                          </button>
                          
                          <button
                            onClick={() => handleToggleSponsored(service.id, !!service.is_splash_sponsored)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                              service.is_splash_sponsored 
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' 
                                : 'bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400'
                            }`}
                            title="Toggle Sponsored Partner"
                          >
                            {service.is_splash_sponsored ? 'Sponsored' : 'Normal'}
                          </button>
                        </div>
                      </td>

                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/ip-services/${service.id}`}
                            className="p-2 rounded-xl bg-[#5a32fa] text-white hover:bg-[#4924dc] transition-colors flex items-center gap-1.5 text-xs font-bold shadow-sm"
                            title="Open Visual Page Editor"
                          >
                            <Edit size={15} /> Edit Page
                          </Link>

                          <Link
                            href={publicUrl}
                            target="_blank"
                            className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                            title="View Live Page"
                          >
                            <Eye size={16} />
                          </Link>

                          {!isPss && !isGenie && (
                            <button
                              onClick={() => handleDeleteService(service.id, service.title)}
                              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Delete Service"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add New IP Service */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1e293b] rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Add New IP Service</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Create a new service listing and full custom partner page.</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateService} className="p-6 md:p-8 space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                  Company / Service Name *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. LegalTech Pro"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newSlug) setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-[#5a32fa]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                  URL Slug (Unique path)
                </label>
                <input 
                  type="text"
                  placeholder="e.g. legaltech-pro"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:border-[#5a32fa]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                    Category
                  </label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#5a32fa]"
                  >
                    <option value="tech-operations">Tech Operations</option>
                    <option value="tech-way">AI & Automation</option>
                    <option value="ip-services">General IP Services</option>
                    <option value="future-service-hub">Service Hub</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                    Subcategory Tag
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. Legal AI"
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#5a32fa]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                  Short Description
                </label>
                <textarea 
                  rows={3}
                  placeholder="Summary of services offered..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#5a32fa]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-white/5 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="bg-[#5a32fa] hover:bg-[#4924dc] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create & Configure'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
