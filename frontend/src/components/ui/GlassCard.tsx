import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hover = true,
  onClick
}) => {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      className={`
        backdrop-blur-lg bg-[#222]/5 border border-[#222]/20
        rounded-xl shadow-2xl
        ${hover ? 'hover:bg-[#222]/10 hover:border-[#222]/30' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        transition-all duration-300
        ${className}
      `}
      onClick={onClick}
    >
      <div className="relative">
        {children}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#222]/5 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default GlassCard;