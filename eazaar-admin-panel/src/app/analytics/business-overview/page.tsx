import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import BusinessOverviewCardItems from "@/app/components/analytics/business-overview/business-overview-card-items";
import BusinessOverviewCharts from "@/app/components/analytics/business-overview/business-overview-charts";
import BusinessOverviewRecentData from "@/app/components/analytics/business-overview/business-overview-recent-data";

export default function BusinessOverviewPage() {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
        {/* breadcrumb start */}
        <Breadcrumb title="Business Overview" subtitle="Business Overview" />
        {/* breadcrumb end */}

        {/* card item start  */}
        <BusinessOverviewCardItems />
        {/* card item end  */}

        {/* chart start */}
        <BusinessOverviewCharts />
        {/* chart end */}

        {/* recent data start */}
        <BusinessOverviewRecentData />
        {/* recent data end */}
      </div>
    </Wrapper>
  );
}