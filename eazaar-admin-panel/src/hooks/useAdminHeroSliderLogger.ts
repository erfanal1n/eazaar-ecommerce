
// Enhanced admin panel logging for hero slider management
export const useAdminHeroSliderLogger = (formName, formData = {}) => {
  const actionHistory = useRef([]);
  const sessionId = useRef(Math.random().toString(36).substr(2, 9));
  
  const logAdminAction = useCallback((action, data = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      sessionId: sessionId.current,
      form: formName,
      action,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    console.group(`🎛️  ADMIN ACTION: ${action}`);
    console.log('Form:', formName);
    console.log('Data:', data);
    console.log('Session:', sessionId.current);
    console.groupEnd();
    
    actionHistory.current.push(logEntry);
    
    // Send to backend for audit trail
    fetch('/api/admin-audit-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logEntry)
    }).catch(error => {
      console.warn('Failed to send audit log:', error);
    });
    
    return logEntry;
  }, [formName]);
  
  return {
    logSave: (data) => logAdminAction('SAVE', data),
    logUpdate: (id, data) => logAdminAction('UPDATE', { id, ...data }),
    logDelete: (id) => logAdminAction('DELETE', { id }),
    logView: (id) => logAdminAction('VIEW', { id }),
    logExport: (format) => logAdminAction('EXPORT', { format }),
    logImport: (file) => logAdminAction('IMPORT', { fileName: file.name, fileSize: file.size }),
    getHistory: () => [...actionHistory.current]
  };
};

// Form field change logger
export const useFormFieldLogger = (fieldName, value) => {
  const changeHistory = useRef([]);
  
  useEffect(() => {
    const changeEntry = {
      timestamp: new Date().toISOString(),
      field: fieldName,
      value: typeof value === 'object' ? JSON.stringify(value) : value,
      valueType: typeof value
    };
    
    changeHistory.current.push(changeEntry);
    
    console.log(`📝 Field Changed: ${fieldName}`, {
      newValue: value,
      changeCount: changeHistory.current.length
    });
  }, [fieldName, value]);
  
  return {
    getChangeHistory: () => [...changeHistory.current],
    getChangeCount: () => changeHistory.current.length
  };
};
