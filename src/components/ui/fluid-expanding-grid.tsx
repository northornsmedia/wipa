"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, User } from "lucide-react";
import { cn } from "@/lib/utils";

const LinkedinIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const WLogo = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="3 5 8 19 12 9 16 19 21 5" />
  </svg>
);

export interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  color: string;
  bio?: React.ReactNode;
  flag?: string;
}

const ITEMS: GalleryItem[] = [
  {
    id: "member-1",
    title: "Michele S. Katz",
    subtitle: "WIPA Inaugural President",
    image: "/1.png",
    color: "#fef3c7",
    flag: "https://flagcdn.com/w40/us.png",
    bio: (
      <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
        <p className="font-semibold text-lg text-[#5a32fa] dark:text-[#ff90e8]">Founding Partner, Advitam IP LLC</p>
        <p>
          Michele S. Katz is the Founding Partner of Advitam IP, LLC and an internationally recognised intellectual property attorney with over 20 years of experience advising clients across IP strategy, prosecution, licensing, litigation and dispute resolution. Her practice spans trademarks, copyrights and patents, representing clients before state and federal courts, the Trademark Trial and Appeal Board (TTAB), US Customs and the US Court of Appeals for the Federal Circuit.
        </p>
        <p>
          Recognised consistently by leading industry publications, Michele has been selected as a Super Lawyer every year since 2021 and has been named to the IAM Strategy 300 – The World’s Leading IP Strategists since 2019. Beyond her legal practice, she is a passionate mentor, educator and international speaker, actively supporting law students, emerging professionals and entrepreneurs through professional development and educational initiatives.
        </p>
        <p>
          Michele is also a longstanding contributor to the Women’s IP World Annual and has played an active role in advancing the visibility, development and leadership of women across the global intellectual property profession. Her combination of legal expertise, mentorship and commitment to giving back has established her as a respected and influential voice within the international IP community.
        </p>
      </div>
    ),
  },
  {
    id: "member-2",
    title: "Dr. Shweta Singh",
    subtitle: "Inaugural WIPA Chair - Asia",
    image: "/Dr Shweta_AIPPI (1).png",
    color: "#fce7f3",
    flag: "https://flagcdn.com/w40/in.png",
    bio: (
      <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
        <p className="font-semibold text-lg text-[#5a32fa] dark:text-[#ff90e8]">Founder & CEO, Ennoble IP</p>
        <p>
          Dr Shweta Singh is the Founder and CEO of Ennoble IP, a global intellectual property consultancy specialising in IP research, analytics, prosecution, technology intelligence and strategic advisory services. With a multidisciplinary background spanning biotechnology, management, patent law and innovation, she has developed extensive expertise in patent research and analysis, patent drafting, technology landscapes, freedom-to-operate analysis, IP commercialisation, portfolio management and technology strategy.
        </p>
        <p>
          A first-generation entrepreneur, Dr Singh has built her career at the intersection of intellectual property, innovation and entrepreneurship. Beyond Ennoble IP, she has been involved in initiatives supporting women entrepreneurs, start-ups, SMEs, universities and research institutions, with a particular focus on helping innovators identify, protect and commercialise their intellectual assets. She is also an educator and author who has delivered training and innovation programmes and contributed to research across intellectual property, entrepreneurship and related areas.
        </p>
        <p>
          Her leadership and expertise have earned recognition within the international IP community, including recognition in the IAM Patent 1000 for patent prosecution in India. In 2026, she was also recognised as Woman of the Year by The Women’s IP World Annual, reflecting her contribution to innovation leadership and the advancement of intellectual property. Through her work, Dr Singh continues to champion the connection between science, business and IP while supporting innovators and the next generation of entrepreneurs in transforming ideas into valuable, commercially sustainable assets.
        </p>
      </div>
    ),
  },
  {
    id: "member-3",
    title: "Adriana Barrera",
    subtitle: "Inaugural WIPA Chair - South America",
    image: "/10.jpg",
    color: "#e0f2fe",
    flag: "https://flagcdn.com/w40/pe.png",
    bio: (
      <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
        <p className="font-semibold text-lg text-[#5a32fa] dark:text-[#ff90e8]">Founding Partner, BARLAW – Barrera & Asociados</p>
        <p>
          Adriana Barrera is a Founding Partner of BARLAW – Barrera & Asociados and a highly regarded Peruvian intellectual property lawyer with more than 25 years of experience in the profession. Her practice encompasses trademarks, copyright, patents, IP enforcement, litigation, anti-piracy and anti-counterfeiting, as well as internet and e-commerce matters. Since co-founding BARLAW in 2011, she has played an important role in developing the firm into one of Peru’s recognised specialist intellectual property practices.
        </p>
        <p>
          With particular expertise in brand protection, enforcement and anti-counterfeiting, Adriana advises national and international clients on strategies to protect and defend valuable intellectual property rights. Her career has included positions at several leading Peruvian law firms as well as international experience with AOL Time Warner in New York. She holds an LL.M. in Intellectual Property from Franklin Pierce Law Center and has undertaken further intellectual property studies at the University of Salamanca.
        </p>
        <p>
          Adriana is widely recognised within the international IP community for her expertise and leadership. She is ranked by Chambers and Partners for Intellectual Property in Peru and, in 2026, was recognised for the sixth consecutive year in WTR Global Leaders: Private Practice. She was also ranked among the top three in the Leadership in IP Commercialisation & Licensing category of the Women’s IP World Top 100 Influential Women Leaders in IP Law 2026. Through her leadership, international perspective and longstanding commitment to protecting innovation and brands, Adriana continues to be an influential figure within the Peruvian and wider Latin American intellectual property community.
        </p>
      </div>
    ),
  },
  {
    id: "member-4",
    title: "Nadine Stuttle",
    subtitle: "Inaugural Chair - Europe",
    image: "/Nadine Stuttle Picture.jpg",
    color: "#f3e8ff",
    flag: "https://flagcdn.com/w40/ch.png",
    bio: (
      <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
        <p className="font-semibold text-lg text-[#5a32fa] dark:text-[#ff90e8]">CEO, PSS Solutions</p>
        <p>
          Nadine Stuttle is the CEO of PSS Solutions and serves as the Inaugural Chair for Europe at the Women's IP Alliance.
        </p>
      </div>
    ),
  }
];

interface FluidExpandingGridProps {
  items?: GalleryItem[];
  className?: string;
}

export function FluidExpandingGrid({
  items = ITEMS,
  className,
}: FluidExpandingGridProps) {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  // Prevent scrolling when modal is open
  React.useEffect(() => {
    if (activeItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [activeItem]);

  return (
    <div className={cn("w-full mx-auto pt-0 pb-12 px-6", className)}>
      {/* Unexpanded Grid */}
      <div className="w-full mx-auto flex flex-wrap justify-center gap-6 pb-8">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layoutId={`card-${item.id}`}
            onClick={() => setActiveItem(item)}
            className="group relative cursor-pointer overflow-hidden rounded-[32px] shadow-lg w-full md:w-[calc(25%-18px)] h-[380px]"
            whileHover={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <motion.div
              layoutId={`image-container-${item.id}`}
              className="absolute inset-0 bg-gray-200 dark:bg-gray-800"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </motion.div>

            <motion.div 
              layoutId={`content-${item.id}`}
              className="absolute inset-0 p-8 flex flex-col justify-end text-white z-10"
            >
              <motion.h3 
                layoutId={`title-${item.id}`}
                className="text-2xl md:text-3xl font-bold mb-2 tracking-tight flex items-center gap-3"
              >
                {item.flag && <img src={item.flag} alt="flag" className="w-8 h-6 object-cover rounded-sm shadow-sm" />}
                {item.title}
              </motion.h3>
              <motion.p 
                layoutId={`subtitle-${item.id}`}
                className="text-white/80 font-medium"
              >
                {item.subtitle}
              </motion.p>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Expanded Modal Overlay */}
      <AnimatePresence>
        {activeItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveItem(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            />
            
            <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 md:p-10 pointer-events-none mt-10 md:mt-0">
              <motion.div
                layoutId={`card-${activeItem.id}`}
                className="w-full max-w-4xl h-[70vh] min-h-[450px] max-h-[600px] bg-white dark:bg-[#0f172a] rounded-[32px] overflow-hidden flex flex-col shadow-2xl pointer-events-auto relative"
              >
                <button
                  onClick={() => setActiveItem(null)}
                  className="absolute top-4 right-4 z-50 p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="w-full h-full p-6 md:p-10 overflow-y-auto bg-white dark:bg-[#0f172a] text-gray-800 dark:text-gray-200 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  
                  {/* Top Header: Small Image + Title */}
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 pt-4 md:pt-0">
                    <motion.div
                      layoutId={`image-container-${activeItem.id}`}
                      className="relative w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden shrink-0 shadow-md border border-gray-100 dark:border-gray-800"
                    >
                      <img
                        src={activeItem.image}
                        alt={activeItem.title}
                        className="w-full h-full object-cover object-top"
                      />
                    </motion.div>
                    
                    <div className="flex-1">
                      <motion.h3 
                        layoutId={`title-${activeItem.id}`}
                        className="text-2xl md:text-4xl font-extrabold mb-2 text-gray-900 dark:text-white tracking-tight flex items-center gap-3"
                      >
                        {activeItem.flag && <img src={activeItem.flag} alt="flag" className="w-8 h-6 object-cover rounded shadow-sm shrink-0" />}
                        {activeItem.title}
                      </motion.h3>
                      <motion.p 
                        layoutId={`subtitle-${activeItem.id}`}
                        className="text-lg md:text-xl font-medium text-[#5a32fa] dark:text-[#ff90e8]"
                      >
                        {activeItem.subtitle}
                      </motion.p>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-4 mt-4"
                      >
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center text-gray-500 hover:bg-[#0077b5] hover:text-white dark:hover:bg-[#0077b5] dark:text-gray-400 dark:hover:text-white transition-all duration-300">
                          <LinkedinIcon size={18} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center text-gray-500 hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600 hover:text-white dark:hover:text-white transition-all duration-300">
                          <InstagramIcon size={18} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center text-gray-500 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:text-gray-400 dark:hover:text-white transition-all duration-300">
                          <Mail size={18} />
                        </a>
                        <a href="#" className="h-10 px-4 rounded-full bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:bg-[#5a32fa] hover:text-white dark:hover:bg-[#ff90e8] dark:hover:text-gray-900 transition-all duration-300 font-medium text-sm group">
                          <WLogo size={16} className="group-hover:text-white dark:group-hover:text-gray-900 transition-colors" />
                          <span>WIPA Profile</span>
                        </a>
                      </motion.div>
                    </div>
                  </div>

                  {/* Bio Content */}
                  <motion.div 
                    layoutId={`content-${activeItem.id}`}
                    className="w-full"
                  >
                    {activeItem.bio}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FluidExpandingGrid;
