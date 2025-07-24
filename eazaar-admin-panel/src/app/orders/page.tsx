import Wrapper from "@/layout/wrapper";
import Breadcrumb from "../components/breadcrumb/breadcrumb";
import OrderArea from "../components/orders/order-area";

const OrdersPage = () => {
  return (
    <Wrapper>
      <div className="body-content px-4 sm:px-6 lg:px-8 py-6 lg:py-8 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
        {/* breadcrumb start */}
        <Breadcrumb title="Orders" subtitle="Order List" />
        {/* breadcrumb end */}

        {/* order area start */}
        <OrderArea />
        {/* order area end */}
      </div>
    </Wrapper>
  );
};

export default OrdersPage;
