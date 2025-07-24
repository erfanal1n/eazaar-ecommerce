import Wrapper from "@/layout/wrapper";
import Breadcrumb from "../components/breadcrumb/breadcrumb";
import AddProductType from "../components/product-type/add-product-type";

const ProductTypePage = () => {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
        {/* breadcrumb start */}
        <Breadcrumb title="Product Type" subtitle="Product Type Management" />
        {/* breadcrumb end */}

        {/* add product type area start */}
        <AddProductType />
        {/* add product type area end */}
      </div>
    </Wrapper>
  );
};

export default ProductTypePage;