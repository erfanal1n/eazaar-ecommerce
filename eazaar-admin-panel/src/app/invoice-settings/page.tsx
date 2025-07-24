import Wrapper from "@/layout/wrapper";
import Breadcrumb from "../components/breadcrumb/breadcrumb";
import InvoiceSettingsArea from "../components/invoice-settings/invoice-settings-area";

const InvoiceSettingsPage = () => {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
        {/* breadcrumb start */}
        <Breadcrumb title="Invoice Settings" subtitle="Customize Invoice Template" />
        {/* breadcrumb end */}

        {/* invoice settings area start */}
        <InvoiceSettingsArea />
        {/* invoice settings area end */}
      </div>
    </Wrapper>
  );
};

export default InvoiceSettingsPage;