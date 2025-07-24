'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../../context/ThemeContext';
import logo from '@assets/img/logo/logo.svg';
import logoWhite from '@assets/img/logo/logo-white.svg';

const ResponsiveLogo = ({ 
  href = "/",
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 120px, (max-width: 1024px) 140px, 160px"
}) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default to light theme logo during SSR and before mounting
  const logoSrc = mounted && theme === 'dark' ? logoWhite : logo;
  const altText = mounted && theme === 'dark' ? 'EAZAAR logo white' : 'EAZAAR logo';

  const handleLogoClick = (e) => {
    // Ensure navigation to homepage regardless of current domain/URL
    window.location.href = '/';
  };

  return (
    <div className={`logo ${className}`}>
      <Link href="/" onClick={handleLogoClick}>
        <Image 
          src={logoSrc}
          alt={altText}
          priority={priority}
          sizes={sizes}
          style={{
            width: 'auto',
            height: 'auto',
            maxWidth: '100%',
            maxHeight: '150px',
            objectFit: 'contain',
            objectPosition: 'center',
            clipPath: 'inset(15% 0 15% 0)'
          }}
          className="responsive-logo"
        />
      </Link>
    </div>
  );
};

export default ResponsiveLogo;