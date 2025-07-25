import Wrapper from "@/layout/wrapper";
import Breadcrumb from "../components/breadcrumb/breadcrumb";
import AddStaffArea from "../components/our-staff/staff-area";
import ProtectedRoute from "@/components/common/ProtectedRoute";

const CategoryPage = () => {
  return (
    <ProtectedRoute requiredPath="/our-staff">
      <Wrapper>
        <div className="body-content px-8 py-8 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
          {/* breadcrumb start */}
          <Breadcrumb title="Staff" subtitle="Staff List" />
          {/* breadcrumb end */}

          {/*staff area start */}
          <AddStaffArea/>
          {/*staff area end */}
        </div>
      </Wrapper>
    </ProtectedRoute>
  );
};

export default CategoryPage;
