import Wrapper from "@/layout/wrapper";
import Breadcrumb from "../components/breadcrumb/breadcrumb";
import AdminRoleArea from "../components/admin-roles/admin-role-area";
import ProtectedRoute from "@/components/common/ProtectedRoute";

const AdminRolesPage = () => {
  return (
    <ProtectedRoute requiredPath="/admin-roles">
      <Wrapper>
        <div className="body-content px-8 py-8 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
          {/* breadcrumb start */}
          <Breadcrumb title="Admin Roles" subtitle="Manage Admin Roles & Permissions" />
          {/* breadcrumb end */}

          {/* admin roles area start */}
          <AdminRoleArea />
          {/* admin roles area end */}
        </div>
      </Wrapper>
    </ProtectedRoute>
  );
};

export default AdminRolesPage;