import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import SalesProductsCardItems from "@/app/components/analytics/sales-products/sales-products-card-items";
import SalesProductsCharts from "@/app/components/analytics/sales-products/sales-products-charts";
import SalesProductsRecentData from "@/app/components/analytics/sales-products/sales-products-recent-data";

export default function SalesProductsPage() {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
        {/* breadcrumb start */}
        <Breadcrumb title="Sales & Products" subtitle="Sales & Products" />
        {/* breadcrumb end */}

        {/* card item start  */}
        <SalesProductsCardItems />
        {/* card item end  */}

        {/* chart start */}
        <SalesProductsCharts />
        {/* chart end */}

        {/* recent data start */}
        <SalesProductsRecentData />
        {/* recent data end */}
      </div>
    </Wrapper>
  );
}