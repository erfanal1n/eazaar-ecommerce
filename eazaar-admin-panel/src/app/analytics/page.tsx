'use client';
import React from 'react';
import Link from 'next/link';
import Wrapper from '@/layout/wrapper';
import Breadcrumb from '../components/breadcrumb/breadcrumb';

const AnalyticsPage = () => {
  const analyticsPages = [
    {
      title: 'Business Overview',
      description: 'Key performance indicators and business metrics',
      link: '/analytics/business-overview',
      icon: '📊'
    },
    {
      title: 'Sales & Products',
      description: 'Sales performance and product analytics',
      link: '/analytics/sales-products',
      icon: '💰'
    },
    {
      title: 'Customer Insights',
      description: 'Customer behavior and demographics',
      link: '/analytics/customer-insights',
      icon: '👥'
    },
    {
      title: 'Reports & Exports',
      description: 'Generate and export detailed reports',
      link: '/analytics/reports-exports',
      icon: '📈'
    }
  ];

  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
        {/* breadcrumb start */}
        <Breadcrumb title="Analytics" subtitle="Analytics Dashboard" />
        {/* breadcrumb end */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive analytics and insights for your ecommerce business
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {analyticsPages.map((page, index) => (
            <div key={index}>
              <Link href={page.link}>
                <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="text-center">
                    <div className="text-4xl mb-4">{page.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{page.title}</h3>
                    <p className="text-gray-600 text-sm">{page.description}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default AnalyticsPage;