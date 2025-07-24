import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import EditProductType from "@/app/components/product-type/edit-product-type";
import Wrapper from "@/layout/wrapper";

const EditProductTypePage = ({ params }: { params: { id: string } }) => {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
        {/* breadcrumb start */}
        <Breadcrumb title="Edit Product Type" subtitle="Edit Product Type" />
        {/* breadcrumb end */}

        {/* edit product type start */}
        <EditProductType id={params.id} />
        {/* edit product type end */}
      </div>
    </Wrapper>
  );
};

export default EditProductTypePage;