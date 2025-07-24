'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

interface ResponsiveLogoProps {
  href?: string;
  className?: string;
  priority?: boolean;
}

const ResponsiveLogo: React.FC<ResponsiveLogoProps> = ({ 
  href = '/dashboard',
  className = '',
  priority = false 
}) => {
  const { isDark } = useTheme();
  
  const logoSrc = isDark 
    ? '/assets/img/logo/logo-white.svg' 
    : '/assets/img/logo/logo.svg';

  const logoComponent = (
    <div className={`flex items-center justify-center ${className}`} style={{ 
      height: '110px', 
      overflow: 'hidden',
      minHeight: '80px'
    }}>
      <Image
        src={logoSrc}
        alt="EAZAAR Logo"
        width={300}
        height={110}
        priority={priority}
        className="h-[60px] sm:h-[70px] md:h-[75px] lg:h-[80px] xl:h-[85px] w-auto transition-all duration-300"
        style={{
          maxWidth: '95%',
          minWidth: '180px',
          objectFit: 'fill',
          objectPosition: 'center',
          transform: 'scale(1.3)',
          transformOrigin: 'center'
        }}
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {logoComponent}
      </Link>
    );
  }

  return logoComponent;
};

export default ResponsiveLogo;