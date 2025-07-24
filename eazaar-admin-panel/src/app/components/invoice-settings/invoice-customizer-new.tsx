"use client";
import React, { useState, useCallback } from "react";
import { InvoiceSettings } from "@/types/invoice-type";
import { useTheme } from "@/context/ThemeContext";

interface Props {
  settings: InvoiceSettings;
  onSettingsChange: (settings: InvoiceSettings) => void;
  onSave?: () => void;
}

const InvoiceCustomizerNew = ({ settings, onSettingsChange, onSave }: Props) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('company');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');

  const handleChange = useCallback((field: keyof InvoiceSettings, value: any) => {
    const newSettings = {
      ...settings,
      [field]: value
    };
    onSettingsChange(newSettings);
  }, [settings, onSettingsChange]);

  const handleFileUpload = useCallback(async (file: File, type: 'logo' | 'signature') => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      // Define target dimensions based on type
      const targetDimensions = type === 'logo' 
        ? { width: 120, height: 120 } 
        : { width: 300, height: 120 };
      
      // Create image element to get original dimensions
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = img;
        const maxWidth = targetDimensions.width;
        const maxHeight = targetDimensions.height;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }
        
        // Set canvas dimensions and draw resized image
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with good quality
        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        handleChange(type, resizedDataUrl);
        setIsUploading(false);
      };
      
      img.onerror = () => {
        setIsUploading(false);
        console.error('Failed to load image');
      };
      
      // Read file as data URL and set as image source
      const reader = new FileReader();
      reader.onload = (event) => {
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
      
    } catch (error) {
      setIsUploading(false);
      console.error('Upload failed:', error);
    }
  }, [handleChange]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (onSave) {
        onSave();
      }
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const switchTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  const handleColorSelection = (color: string) => {
    setSelectedColor(color);
    setShowColorModal(true);
  };

  const applyColorTo = (colorType: 'primary' | 'secondary') => {
    handleChange(`${colorType}Color` as keyof InvoiceSettings, selectedColor);
    setShowColorModal(false);
    setSelectedColor('');
  };

  const tabs = [
    { id: 'company', label: 'Company', icon: '🏢' },
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="invoice-customizer-wrapper" style={{
      width: '100%',
      minWidth: '300px',
      maxWidth: '100%',
      height: 'auto',
      minHeight: '600px',
      background: isDark ? '#1e293b' : 'white',
      border: isDark ? '1px solid #334155' : '1px solid #F2F2F6',
      borderRadius: '0.5rem',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      transition: 'all 0.3s ease'
    }}>
      
      {/* Header */}
      <div className="customizer-header" style={{
        padding: '1rem 1rem 0.75rem',
        background: isDark ? '#0f172a' : '#F7F7F9',
        borderBottom: isDark ? '1px solid #334155' : '1px solid #F2F2F6',
        borderTopLeftRadius: '0.5rem',
        borderTopRightRadius: '0.5rem',
        position: 'relative'
      }}>
        <h2 className="customizer-title" style={{
          fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
          fontWeight: '700',
          color: isDark ? '#f8fafc' : '#010F1C',
          marginBottom: '0.25rem'
        }}>
          Invoice Customizer
        </h2>
        <p className="customizer-subtitle" style={{
          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
          color: isDark ? '#94a3b8' : '#55585B'
        }}>
          Real-time preview of your invoice template
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-nav" style={{
        display: 'flex',
        padding: '0.5rem 0.75rem',
        background: isDark ? '#0f172a' : '#F7F7F9',
        borderBottom: isDark ? '1px solid #334155' : '1px solid #F2F2F6',
        gap: '0.25rem',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            style={{
              padding: '0.5rem 0.75rem',
              border: 'none',
              background: activeTab === tab.id ? '#0989FF' : 'transparent',
              color: activeTab === tab.id ? 'white' : (isDark ? '#94a3b8' : '#55585B'),
              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
              fontWeight: '500',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              minWidth: 'fit-content',
              flex: '1 1 auto'
            }}
          >
            <span className="tab-icon" style={{ fontSize: '1rem' }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="customizer-content" style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        background: isDark ? '#1e293b' : 'white',
        scrollbarWidth: 'thin',
        scrollbarColor: '#94a3b8 #f1f5f9',
        borderBottomLeftRadius: '0.5rem',
        borderBottomRightRadius: '0.5rem',
        maxHeight: '70vh'
      }}>
        
        {/* Company Tab */}
        {activeTab === 'company' && (
          <div className="tab-content active">
            <div className="card" style={{
              background: isDark ? '#334155' : 'white',
              border: isDark ? '1px solid #475569' : '1px solid #F2F2F6',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              marginBottom: '1.25rem',
              boxShadow: isDark ? '0px 1px 2px rgba(0, 0, 0, 0.3)' : '0px 1px 2px rgba(37, 39, 41, 0.12)',
              transition: 'all 0.2s ease'
            }}>
              <div className="card-header" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div className="card-icon" style={{
                  width: '36px',
                  height: '36px',
                  background: 'var(--primary-light, #e0e7ff)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0
                }}>
                  🏢
                </div>
                <h3 className="card-title" style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#010F1C'
                }}>
                  Company Information
                </h3>
              </div>
              <div className="form-grid">
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label" style={{
                    display: 'block',
                    fontSize: '0.813rem',
                    fontWeight: '500',
                    color: '#55585B',
                    marginBottom: '0.375rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em'
                  }}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={settings.companyName || "Bangl VOIDA"}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    className="form-input"
                    placeholder="Enter company name"
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      background: 'var(--input-bg, #f9fafb)',
                      border: '1px solid #F2F2F6',
                      borderRadius: '0.5rem',
                      color: '#010F1C',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                  />
                </div>
                
                <div className="form-grid-2" style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem'
                }}>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label" style={{
                      display: 'block',
                      fontSize: '0.813rem',
                      fontWeight: '500',
                      color: '#55585B',
                      marginBottom: '0.375rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={settings.companyPhone || "JEDA !"}
                      onChange={(e) => handleChange('companyPhone', e.target.value)}
                      className="form-input"
                      placeholder="+880 1234567890"
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.875rem',
                        background: 'var(--input-bg, #f9fafb)',
                        border: '1px solid #F2F2F6',
                        borderRadius: '0.5rem',
                        color: '#010F1C',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label" style={{
                      display: 'block',
                      fontSize: '0.813rem',
                      fontWeight: '500',
                      color: '#55585B',
                      marginBottom: '0.375rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={settings.companyEmail || "JEDA !"}
                      onChange={(e) => handleChange('companyEmail', e.target.value)}
                      className="form-input"
                      placeholder="email@company.com"
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.875rem',
                        background: 'var(--input-bg, #f9fafb)',
                        border: '1px solid #F2F2F6',
                        borderRadius: '0.5rem',
                        color: '#010F1C',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label" style={{
                    display: 'block',
                    fontSize: '0.813rem',
                    fontWeight: '500',
                    color: '#55585B',
                    marginBottom: '0.375rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em'
                  }}>
                    Address
                  </label>
                  <input
                    type="text"
                    value={settings.companyAddress || "JEDA !"}
                    onChange={(e) => handleChange('companyAddress', e.target.value)}
                    className="form-input"
                    placeholder="123 Business Street"
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      background: 'var(--input-bg, #f9fafb)',
                      border: '1px solid #F2F2F6',
                      borderRadius: '0.5rem',
                      color: '#010F1C',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                  />
                </div>

                <div className="form-grid-2" style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem'
                }}>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label" style={{
                      display: 'block',
                      fontSize: '0.813rem',
                      fontWeight: '500',
                      color: '#55585B',
                      marginBottom: '0.375rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      City
                    </label>
                    <input
                      type="text"
                      value={settings.companyCity || "JEDA !"}
                      onChange={(e) => handleChange('companyCity', e.target.value)}
                      className="form-input"
                      placeholder="Dhaka"
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.875rem',
                        background: 'var(--input-bg, #f9fafb)',
                        border: '1px solid #F2F2F6',
                        borderRadius: '0.5rem',
                        color: '#010F1C',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label" style={{
                      display: 'block',
                      fontSize: '0.813rem',
                      fontWeight: '500',
                      color: '#55585B',
                      marginBottom: '0.375rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      Website
                    </label>
                    <input
                      type="url"
                      value={settings.companyWebsite || "JEDA !"}
                      onChange={(e) => handleChange('companyWebsite', e.target.value)}
                      className="form-input"
                      placeholder="www.company.com"
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.875rem',
                        background: 'var(--input-bg, #f9fafb)',
                        border: '1px solid #F2F2F6',
                        borderRadius: '0.5rem',
                        color: '#010F1C',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{
              background: 'white',
              border: '1px solid #F2F2F6',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              marginBottom: '1.25rem',
              boxShadow: '0px 1px 2px rgba(37, 39, 41, 0.12)',
              transition: 'all 0.2s ease'
            }}>
              <div className="card-header" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div className="card-icon" style={{
                  width: '36px',
                  height: '36px',
                  background: 'var(--primary-light, #e0e7ff)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0
                }}>
                  📞
                </div>
                <h3 className="card-title" style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#010F1C'
                }}>
                  Contact Details
                </h3>
              </div>
              <div className="form-grid">
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label" style={{
                    display: 'block',
                    fontSize: '0.813rem',
                    fontWeight: '500',
                    color: '#55585B',
                    marginBottom: '0.375rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em'
                  }}>
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail || "demo@mail.com"}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    className="form-input"
                    placeholder="contact@email.com"
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      background: 'var(--input-bg, #f9fafb)',
                      border: '1px solid #F2F2F6',
                      borderRadius: '0.5rem',
                      color: '#010F1C',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label" style={{
                    display: 'block',
                    fontSize: '0.813rem',
                    fontWeight: '500',
                    color: '#55585B',
                    marginBottom: '0.375rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em'
                  }}>
                    Contact Address
                  </label>
                  <textarea
                    value={settings.contactAddress || "demo@mail.com"}
                    onChange={(e) => handleChange('contactAddress', e.target.value)}
                    className="form-textarea"
                    placeholder="Contact address"
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      background: 'var(--input-bg, #f9fafb)',
                      border: '1px solid #F2F2F6',
                      borderRadius: '0.5rem',
                      color: '#010F1C',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      minHeight: '80px',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Design Tab */}
        {activeTab === 'design' && (
          <div className="tab-content active">
            <div className="card" style={{
              background: 'white',
              border: '1px solid #F2F2F6',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              marginBottom: '1.25rem',
              boxShadow: '0px 1px 2px rgba(37, 39, 41, 0.12)',
              transition: 'all 0.2s ease'
            }}>
              <div className="card-header" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div className="card-icon" style={{
                  width: '36px',
                  height: '36px',
                  background: 'var(--primary-light, #e0e7ff)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0
                }}>
                  🖼️
                </div>
                <h3 className="card-title" style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#010F1C'
                }}>
                  Logo Upload
                </h3>
              </div>
              <div className="upload-area" style={{
                width: '100%',
                minHeight: '120px',
                border: '2px dashed #F2F2F6',
                borderRadius: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: 'var(--bg-tertiary, #f1f5f9)',
                position: 'relative',
                overflow: 'hidden',
                padding: '1rem'
              }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'logo')}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                    zIndex: 2
                  }}
                />
                {settings.logo ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <img 
                      src={settings.logo} 
                      alt="Logo Preview" 
                      style={{
                        maxWidth: '80px',
                        maxHeight: '60px',
                        objectFit: 'contain',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb'
                      }}
                    />
                    <div style={{
                      color: '#10b981',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      Logo uploaded ✓
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        color: '#6b7280',
                        fontSize: '0.75rem',
                        textAlign: 'center'
                      }}>
                        Click to change
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChange('logo', '');
                        }}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '2px 6px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          zIndex: 3,
                          position: 'relative'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div className="upload-icon" style={{
                      fontSize: '2rem',
                      marginBottom: '0.5rem',
                      color: 'var(--text-tertiary, #64748b)'
                    }}>
                      📤
                    </div>
                    <div className="upload-text" style={{
                      color: '#55585B',
                      fontSize: '0.813rem',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>
                      Click to upload logo
                    </div>
                    <div style={{
                      color: '#9ca3af',
                      fontSize: '0.75rem',
                      textAlign: 'center',
                      marginTop: '0.25rem'
                    }}>
                      Perfect size: 60x60px<br/>
                      Recommended: 120x120px (will auto-resize)<br/>
                      Max size: 2MB | Format: PNG, JPG, SVG
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card" style={{
              background: 'white',
              border: '1px solid #F2F2F6',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              marginBottom: '1.25rem',
              boxShadow: '0px 1px 2px rgba(37, 39, 41, 0.12)',
              transition: 'all 0.2s ease'
            }}>
              <div className="card-header" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div className="card-icon" style={{
                  width: '36px',
                  height: '36px',
                  background: 'var(--primary-light, #e0e7ff)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0
                }}>
                  🎨
                </div>
                <h3 className="card-title" style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#010F1C'
                }}>
                  Color Scheme
                </h3>
              </div>
              <div className="form-grid-2" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem'
              }}>
                <div className="color-input-group" style={{ position: 'relative' }}>
                  <label className="form-label" style={{
                    display: 'block',
                    fontSize: '0.813rem',
                    fontWeight: '500',
                    color: '#55585B',
                    marginBottom: '0.375rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em'
                  }}>
                    Primary
                  </label>
                  <div className="color-preview" style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '0.5rem',
                    marginBottom: '0.375rem',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: '2px solid #F2F2F6',
                    background: settings.primaryColor || '#0000FF'
                  }}>
                    <input
                      type="color"
                      value={settings.primaryColor || '#0000FF'}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      className="color-input"
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                  <div className="color-hex" style={{
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--text-tertiary, #64748b)',
                    fontFamily: 'Courier New, monospace'
                  }}>
                    {settings.primaryColor || '#0000FF'}
                  </div>
                </div>
                <div className="color-input-group" style={{ position: 'relative' }}>
                  <label className="form-label" style={{
                    display: 'block',
                    fontSize: '0.813rem',
                    fontWeight: '500',
                    color: '#55585B',
                    marginBottom: '0.375rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em'
                  }}>
                    Secondary
                  </label>
                  <div className="color-preview" style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '0.5rem',
                    marginBottom: '0.375rem',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: '2px solid #F2F2F6',
                    background: settings.secondaryColor || '#0062FF'
                  }}>
                    <input
                      type="color"
                      value={settings.secondaryColor || '#0062FF'}
                      onChange={(e) => handleChange('secondaryColor', e.target.value)}
                      className="color-input"
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                  <div className="color-hex" style={{
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--text-tertiary, #64748b)',
                    fontFamily: 'Courier New, monospace'
                  }}>
                    {settings.secondaryColor || '#0062FF'}
                  </div>
                </div>
              </div>
              
              {/* Predefined Color Palette */}
              <div className="color-palette" style={{ marginTop: '1rem' }}>
                <label className="form-label" style={{
                  display: 'block',
                  fontSize: '0.813rem',
                  fontWeight: '500',
                  color: '#55585B',
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.025em'
                }}>
                  Quick Colors
                </label>
                <div className="palette-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: '0.5rem'
                }}>
                  {[
                    { name: 'Theme Blue', color: '#0989FF' },
                    { name: 'Theme Dark', color: '#056ECE' },
                    { name: 'Success', color: '#50CD89' },
                    { name: 'Danger', color: '#F1416C' },
                    { name: 'Warning', color: '#ff9800' },
                    { name: 'Purple', color: '#7239EA' },
                    { name: 'Pink', color: '#f000b9' },
                    { name: 'Yellow', color: '#FFB21D' },
                    { name: 'Red', color: '#EA0D42' },
                    { name: 'Green Dark', color: '#75CC68' },
                    { name: 'Text Body', color: '#55585B' },
                    { name: 'Black', color: '#010F1C' }
                  ].map((colorItem, index) => (
                    <div
                      key={index}
                      className="palette-color"
                      onClick={() => handleColorSelection(colorItem.color)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '0.375rem',
                        background: colorItem.color,
                        cursor: 'pointer',
                        border: '2px solid #F2F2F6',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}
                      title={`${colorItem.name} (${colorItem.color})`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="card" style={{
              background: 'white',
              border: '1px solid #F2F2F6',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              marginBottom: '1.25rem',
              boxShadow: '0px 1px 2px rgba(37, 39, 41, 0.12)',
              transition: 'all 0.2s ease'
            }}>
              <div className="card-header" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div className="card-icon" style={{
                  width: '36px',
                  height: '36px',
                  background: 'var(--primary-light, #e0e7ff)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0
                }}>
                  ✏️
                </div>
                <h3 className="card-title" style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#010F1C'
                }}>
                  Typography
                </h3>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{
                  display: 'block',
                  fontSize: '0.813rem',
                  fontWeight: '500',
                  color: '#55585B',
                  marginBottom: '0.375rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.025em'
                }}>
                  Font Family
                </label>
                <select
                  value={settings.fontFamily || 'Inter'}
                  onChange={(e) => handleChange('fontFamily', e.target.value)}
                  className="form-select"
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    background: 'var(--input-bg, #f9fafb)',
                    border: '1px solid #F2F2F6',
                    borderRadius: '0.5rem',
                    color: '#010F1C',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                >
                  <option value="Poppins">Poppins (Default)</option>
                  <option value="Inter">Inter (Modern)</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Jost">Jost</option>
                </select>
              </div>
            </div>

            <div className="card" style={{
              background: 'white',
              border: '1px solid #F2F2F6',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              marginBottom: '1.25rem',
              boxShadow: '0px 1px 2px rgba(37, 39, 41, 0.12)',
              transition: 'all 0.2s ease'
            }}>
              <div className="card-header" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div className="card-icon" style={{
                  width: '36px',
                  height: '36px',
                  background: 'var(--primary-light, #e0e7ff)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0
                }}>
                  ✍️
                </div>
                <h3 className="card-title" style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#010F1C'
                }}>
                  Signature Upload
                </h3>
              </div>
              <div className="upload-area" style={{
                width: '100%',
                minHeight: '120px',
                border: '2px dashed #F2F2F6',
                borderRadius: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: 'var(--bg-tertiary, #f1f5f9)',
                position: 'relative',
                overflow: 'hidden',
                padding: '1rem'
              }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'signature')}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                    zIndex: 2
                  }}
                />
                {settings.signature ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <img 
                      src={settings.signature} 
                      alt="Signature Preview" 
                      style={{
                        maxWidth: '120px',
                        maxHeight: '60px',
                        objectFit: 'contain',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb'
                      }}
                    />
                    <div style={{
                      color: '#10b981',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      Signature uploaded ✓
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        color: '#6b7280',
                        fontSize: '0.75rem',
                        textAlign: 'center'
                      }}>
                        Click to change
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChange('signature', '');
                        }}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '2px 6px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          zIndex: 3,
                          position: 'relative'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div className="upload-icon" style={{
                      fontSize: '2rem',
                      marginBottom: '0.5rem',
                      color: 'var(--text-tertiary, #64748b)'
                    }}>
                      ✍️
                    </div>
                    <div className="upload-text" style={{
                      color: '#55585B',
                      fontSize: '0.813rem',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>
                      Upload signature
                    </div>
                    <div style={{
                      color: '#9ca3af',
                      fontSize: '0.75rem',
                      textAlign: 'center',
                      marginTop: '0.25rem'
                    }}>
                      Perfect size: 150x60px<br/>
                      Recommended: 300x120px (will auto-resize)<br/>
                      Max size: 1MB | Format: PNG, JPG (transparent preferred)
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card" style={{
              background: 'white',
              border: '1px solid #F2F2F6',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              marginBottom: '1.25rem',
              boxShadow: '0px 1px 2px rgba(37, 39, 41, 0.12)',
              transition: 'all 0.2s ease'
            }}>
              <div className="card-header" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div className="card-icon" style={{
                  width: '36px',
                  height: '36px',
                  background: 'var(--primary-light, #e0e7ff)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0
                }}>
                  👁️
                </div>
                <h3 className="card-title" style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#010F1C'
                }}>
                  Display Options
                </h3>
              </div>
              <div className="form-grid">
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <div className="toggle-container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <label className="toggle-switch" style={{
                      position: 'relative',
                      width: '44px',
                      height: '24px',
                      background: (settings.showLogo ?? true) ? '#0989FF' : '#E5E7EB',
                      borderRadius: '100px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: `1px solid ${(settings.showLogo ?? true) ? '#0989FF' : '#F2F2F6'}`
                    }}>
                      <input
                        type="checkbox"
                        checked={settings.showLogo ?? true}
                        onChange={(e) => handleChange('showLogo', e.target.checked)}
                        style={{ display: 'none' }}
                      />
                      <span className="toggle-slider" style={{
                        position: 'absolute',
                        top: '2px',
                        left: (settings.showLogo ?? true) ? '22px' : '2px',
                        width: '20px',
                        height: '20px',
                        background: 'white',
                        borderRadius: '50%',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: (settings.showLogo ?? true) ? '0px 2px 4px rgba(9, 137, 255, 0.3)' : '0px 1px 2px rgba(37, 39, 41, 0.12)'
                      }}></span>
                    </label>
                    <span className="form-label" style={{
                      margin: 0,
                      fontSize: '0.813rem',
                      fontWeight: '500',
                      color: '#55585B',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      Show Logo
                    </span>
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <div className="toggle-container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <label className="toggle-switch" style={{
                      position: 'relative',
                      width: '44px',
                      height: '24px',
                      background: (settings.showSignature ?? true) ? '#0989FF' : '#E5E7EB',
                      borderRadius: '100px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: `1px solid ${(settings.showSignature ?? true) ? '#0989FF' : '#F2F2F6'}`
                    }}>
                      <input
                        type="checkbox"
                        checked={settings.showSignature ?? true}
                        onChange={(e) => handleChange('showSignature', e.target.checked)}
                        style={{ display: 'none' }}
                      />
                      <span className="toggle-slider" style={{
                        position: 'absolute',
                        top: '2px',
                        left: (settings.showSignature ?? true) ? '22px' : '2px',
                        width: '20px',
                        height: '20px',
                        background: 'white',
                        borderRadius: '50%',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: (settings.showSignature ?? true) ? '0px 2px 4px rgba(9, 137, 255, 0.3)' : '0px 1px 2px rgba(37, 39, 41, 0.12)'
                      }}></span>
                    </label>
                    <span className="form-label" style={{
                      margin: 0,
                      fontSize: '0.813rem',
                      fontWeight: '500',
                      color: '#55585B',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      Show Signature
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="tab-content active">
            <div className="card" style={{
              background: 'white',
              border: '1px solid #F2F2F6',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              marginBottom: '1.25rem',
              boxShadow: '0px 1px 2px rgba(37, 39, 41, 0.12)',
              transition: 'all 0.2s ease'
            }}>
              <div className="card-header" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div className="card-icon" style={{
                  width: '36px',
                  height: '36px',
                  background: 'var(--primary-light, #e0e7ff)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0
                }}>
                  💰
                </div>
                <h3 className="card-title" style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#010F1C'
                }}>
                  Currency
                </h3>
              </div>
              <div className="form-grid">
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label" style={{
                    display: 'block',
                    fontSize: '0.813rem',
                    fontWeight: '500',
                    color: '#55585B',
                    marginBottom: '0.375rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em'
                  }}>
                    Currency
                  </label>
                  <select
                    value={settings.currency || 'BDT'}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="form-select"
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      background: 'var(--input-bg, #f9fafb)',
                      border: '1px solid #F2F2F6',
                      borderRadius: '0.5rem',
                      color: '#010F1C',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                  >
                    <option value="BDT">BDT - Bangladeshi Taka</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>
                <div className="form-grid-2" style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem'
                }}>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label" style={{
                      display: 'block',
                      fontSize: '0.813rem',
                      fontWeight: '500',
                      color: '#55585B',
                      marginBottom: '0.375rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      Invoice Prefix
                    </label>
                    <input
                      type="text"
                      value={settings.invoicePrefix || 'INV'}
                      onChange={(e) => handleChange('invoicePrefix', e.target.value)}
                      className="form-input"
                      placeholder="INV"
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.875rem',
                        background: 'var(--input-bg, #f9fafb)',
                        border: '1px solid #F2F2F6',
                        borderRadius: '0.5rem',
                        color: '#010F1C',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label" style={{
                      display: 'block',
                      fontSize: '0.813rem',
                      fontWeight: '500',
                      color: '#55585B',
                      marginBottom: '0.375rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      Date Format
                    </label>
                    <select
                      value={settings.dateFormat || 'DD/MM/YYYY'}
                      onChange={(e) => handleChange('dateFormat', e.target.value)}
                      className="form-select"
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.875rem',
                        background: 'var(--input-bg, #f9fafb)',
                        border: '1px solid #F2F2F6',
                        borderRadius: '0.5rem',
                        color: '#010F1C',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{
              background: 'white',
              border: '1px solid #F2F2F6',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              marginBottom: '1.25rem',
              boxShadow: '0px 1px 2px rgba(37, 39, 41, 0.12)',
              transition: 'all 0.2s ease'
            }}>
              <div className="card-header" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div className="card-icon" style={{
                  width: '36px',
                  height: '36px',
                  background: 'var(--primary-light, #e0e7ff)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0
                }}>
                  📊
                </div>
                <h3 className="card-title" style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#010F1C'
                }}>
                  Tax Settings
                </h3>
              </div>
              <div className="form-grid">
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <div className="toggle-container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <label className="toggle-switch" style={{
                      position: 'relative',
                      width: '44px',
                      height: '24px',
                      background: (settings.showTax ?? true) ? '#0989FF' : '#E5E7EB',
                      borderRadius: '100px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: `1px solid ${(settings.showTax ?? true) ? '#0989FF' : '#F2F2F6'}`
                    }}>
                      <input
                        type="checkbox"
                        checked={settings.showTax ?? true}
                        onChange={(e) => handleChange('showTax', e.target.checked)}
                        style={{ display: 'none' }}
                      />
                      <span className="toggle-slider" style={{
                        position: 'absolute',
                        top: '2px',
                        left: (settings.showTax ?? true) ? '22px' : '2px',
                        width: '20px',
                        height: '20px',
                        background: 'white',
                        borderRadius: '50%',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: (settings.showTax ?? true) ? '0px 2px 4px rgba(9, 137, 255, 0.3)' : '0px 1px 2px rgba(37, 39, 41, 0.12)'
                      }}></span>
                    </label>
                    <span className="form-label" style={{
                      margin: 0,
                      fontSize: '0.813rem',
                      fontWeight: '500',
                      color: '#55585B',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      Enable Tax
                    </span>
                  </div>
                </div>
                <div className="form-grid-2" style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem'
                }}>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label" style={{
                      display: 'block',
                      fontSize: '0.813rem',
                      fontWeight: '500',
                      color: '#55585B',
                      marginBottom: '0.375rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={settings.taxRate || 1}
                      onChange={(e) => handleChange('taxRate', parseFloat(e.target.value))}
                      className="form-input"
                      min="0"
                      max="100"
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.875rem',
                        background: 'var(--input-bg, #f9fafb)',
                        border: '1px solid #F2F2F6',
                        borderRadius: '0.5rem',
                        color: '#010F1C',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label" style={{
                      display: 'block',
                      fontSize: '0.813rem',
                      fontWeight: '500',
                      color: '#55585B',
                      marginBottom: '0.375rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}>
                      Tax Label
                    </label>
                    <input
                      type="text"
                      value={settings.taxLabel || 'Vat tax'}
                      onChange={(e) => handleChange('taxLabel', e.target.value)}
                      className="form-input"
                      placeholder="VAT"
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.875rem',
                        background: 'var(--input-bg, #f9fafb)',
                        border: '1px solid #F2F2F6',
                        borderRadius: '0.5rem',
                        color: '#010F1C',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>


            <div className="card" style={{
              background: 'white',
              border: '1px solid #F2F2F6',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              marginBottom: '1.25rem',
              boxShadow: '0px 1px 2px rgba(37, 39, 41, 0.12)',
              transition: 'all 0.2s ease'
            }}>
              <div className="card-header" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div className="card-icon" style={{
                  width: '36px',
                  height: '36px',
                  background: 'var(--primary-light, #e0e7ff)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0
                }}>
                  📅
                </div>
                <h3 className="card-title" style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#010F1C'
                }}>
                  Payment Terms
                </h3>
              </div>
              <div className="form-grid">
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label" style={{
                    display: 'block',
                    fontSize: '0.813rem',
                    fontWeight: '500',
                    color: '#55585B',
                    marginBottom: '0.375rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em'
                  }}>
                    Payment Terms
                  </label>
                  <select
                    value={settings.paymentTerms || 'Net 30 Days'}
                    onChange={(e) => handleChange('paymentTerms', e.target.value)}
                    className="form-select"
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      background: 'var(--input-bg, #f9fafb)',
                      border: '1px solid #F2F2F6',
                      borderRadius: '0.5rem',
                      color: '#010F1C',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                  >
                    <option value="Net 30 Days">Net 30 Days</option>
                    <option value="Net 15 Days">Net 15 Days</option>
                    <option value="Due on Receipt">Due on Receipt</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label" style={{
                    display: 'block',
                    fontSize: '0.813rem',
                    fontWeight: '500',
                    color: '#55585B',
                    marginBottom: '0.375rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em'
                  }}>
                    Late Fee (%)
                  </label>
                  <input
                    type="number"
                    value={settings.lateFee || 0}
                    onChange={(e) => handleChange('lateFee', parseFloat(e.target.value))}
                    className="form-input"
                    min="0"
                    max="100"
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      background: 'var(--input-bg, #f9fafb)',
                      border: '1px solid #F2F2F6',
                      borderRadius: '0.5rem',
                      color: '#010F1C',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>


            <div className="card" style={{
              background: 'white',
              border: '1px solid #F2F2F6',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              marginBottom: '1.25rem',
              boxShadow: '0px 1px 2px rgba(37, 39, 41, 0.12)',
              transition: 'all 0.2s ease'
            }}>
              <div className="card-header" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div className="card-icon" style={{
                  width: '36px',
                  height: '36px',
                  background: 'var(--primary-light, #e0e7ff)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0
                }}>
                  💬
                </div>
                <h3 className="card-title" style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#010F1C'
                }}>
                  Messages
                </h3>
              </div>
              <div className="form-grid">
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label" style={{
                    display: 'block',
                    fontSize: '0.813rem',
                    fontWeight: '500',
                    color: '#55585B',
                    marginBottom: '0.375rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em'
                  }}>
                    Thank You Message
                  </label>
                  <textarea
                    value={settings.thankYouMessage || 'Thank you for your business!'}
                    onChange={(e) => handleChange('thankYouMessage', e.target.value)}
                    className="form-textarea"
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      background: 'var(--input-bg, #f9fafb)',
                      border: '1px solid #F2F2F6',
                      borderRadius: '0.5rem',
                      color: '#010F1C',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      minHeight: '80px',
                      resize: 'vertical'
                    }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label" style={{
                    display: 'block',
                    fontSize: '0.813rem',
                    fontWeight: '500',
                    color: '#55585B',
                    marginBottom: '0.375rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em'
                  }}>
                    Footer Text
                  </label>
                  <textarea
                    value={settings.footerText || 'This invoice was automatically generated.'}
                    onChange={(e) => handleChange('footerText', e.target.value)}
                    className="form-textarea"
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      background: 'var(--input-bg, #f9fafb)',
                      border: '1px solid #F2F2F6',
                      borderRadius: '0.5rem',
                      color: '#010F1C',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      minHeight: '80px',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="customizer-footer" style={{
        padding: '1rem 1.5rem',
        background: isDark ? '#0f172a' : '#F7F7F9',
        borderTop: isDark ? '1px solid #334155' : '1px solid #F2F2F6'
      }}>
        <button
          onClick={handleSave}
          className="action-btn"
          disabled={isSaving}
          style={{
            width: '100%',
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #0989FF, #056ECE)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          {isSaving && (
            <span className="spinner" style={{
              display: 'inline-block',
              width: '16px',
              height: '16px',
              border: '2px solid transparent',
              borderTopColor: 'white',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite'
            }}></span>
          )}
        </button>
        {showSuccessMessage && (
          <div className="success-msg" style={{
            display: 'block',
            padding: '0.75rem',
            background: 'var(--success, #10b981)',
            color: 'white',
            borderRadius: '0.5rem',
            textAlign: 'center',
            fontSize: '0.813rem',
            marginTop: '0.75rem'
          }}>
            Settings saved successfully!
          </div>
        )}
      </div>

      {/* Color Selection Modal */}
      {showColorModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="modal-content" style={{
            background: isDark ? '#1e293b' : 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: isDark ? '1px solid #334155' : '1px solid #e5e7eb'
          }}>
            <div className="modal-header" style={{
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: isDark ? '#f8fafc' : '#010F1C',
                marginBottom: '0.5rem'
              }}>
                Apply Color To
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '0.25rem',
                  background: selectedColor,
                  border: '2px solid #e5e7eb'
                }}></div>
                <span style={{
                  fontSize: '0.875rem',
                  color: isDark ? '#94a3b8' : '#6b7280',
                  fontFamily: 'monospace'
                }}>
                  {selectedColor}
                </span>
              </div>
            </div>
            
            <div className="modal-buttons" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <button
                onClick={() => applyColorTo('primary')}
                style={{
                  padding: '0.75rem 1rem',
                  background: '#0989FF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>Primary Color</span>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '0.25rem',
                  background: settings.primaryColor || '#0989FF',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}></div>
              </button>
              
              <button
                onClick={() => applyColorTo('secondary')}
                style={{
                  padding: '0.75rem 1rem',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>Secondary Color</span>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '0.25rem',
                  background: settings.secondaryColor || '#55585B',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}></div>
              </button>
              
            </div>
            
            <div className="modal-footer" style={{
              marginTop: '1.5rem',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => {
                  setShowColorModal(false);
                  setSelectedColor('');
                }}
                style={{
                  padding: '0.5rem 1.5rem',
                  background: 'transparent',
                  color: isDark ? '#94a3b8' : '#6b7280',
                  border: isDark ? '1px solid #475569' : '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        .customizer-content::-webkit-scrollbar {
          width: 8px !important;
          display: block !important;
        }
        
        .customizer-content::-webkit-scrollbar-track {
          background: #F7F7F9 !important;
          display: block !important;
        }
        
        .customizer-content::-webkit-scrollbar-thumb {
          background: #94a3b8 !important;
          border-radius: 4px !important;
          display: block !important;
        }
        
        .customizer-content::-webkit-scrollbar-thumb:hover {
          background: #64748b !important;
        }
        
        .tab-btn:hover {
          background: #0989FF !important;
          color: white !important;
        }
        
        .tab-btn.active:hover {
          background: #000000 !important;
          color: white !important;
        }
        
        .card {
          background: ${isDark ? '#334155' : 'white'} !important;
          border: ${isDark ? '1px solid #475569' : '1px solid #F2F2F6'} !important;
          box-shadow: ${isDark ? '0px 1px 2px rgba(0, 0, 0, 0.3)' : '0px 1px 2px rgba(37, 39, 41, 0.12)'} !important;
        }
        
        .card-title {
          color: ${isDark ? '#f8fafc' : '#010F1C'} !important;
        }
        
        .form-label {
          color: ${isDark ? '#94a3b8' : '#55585B'} !important;
        }
        
        .card:hover {
          box-shadow: ${isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.2)' : 'var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06))'};
          border-color: #0989FF;
        }
        
        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          background: ${isDark ? '#475569' : 'var(--input-focus-bg, #ffffff)'};
          border-color: #0989FF;
          box-shadow: 0 0 0 3px var(--primary-light, #e0e7ff);
        }
        
        .upload-area:hover {
          border-color: #0989FF;
          background: var(--primary-light, #e0e7ff);
        }
        
        .color-preview:hover {
          transform: scale(1.02);
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06));
        }
        
        .palette-color:hover {
          transform: scale(1.1);
          border-color: #0989FF !important;
          box-shadow: 0 4px 8px rgba(9, 137, 255, 0.3);
        }
        
        .action-btn:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05));
        }
        
        .action-btn:active {
          transform: translateY(0);
        }
        
        @media (max-width: 1400px) {
          .invoice-customizer-wrapper {
            width: 40% !important;
          }
        }
        
        @media (max-width: 1200px) {
          .invoice-customizer-wrapper {
            width: 45% !important;
          }
        }
        
        @media (max-width: 992px) {
          .invoice-customizer-wrapper {
            width: 100% !important;
            max-width: none !important;
            border-right: none !important;
          }
        }
        
        @media (max-width: 480px) {
          .invoice-customizer-wrapper {
            min-width: 100% !important;
          }
          
          .customizer-header {
            padding: 1.5rem 1rem 1rem !important;
          }
          
          .customizer-content {
            padding: 1rem !important;
          }
          
          .form-grid-2 {
            grid-template-columns: 1fr !important;
          }
          
          .tab-btn {
            padding: 0.375rem 0.75rem !important;
            font-size: 0.813rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceCustomizerNew;