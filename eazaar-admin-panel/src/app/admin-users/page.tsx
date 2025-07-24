import Wrapper from "@/layout/wrapper";
import Breadcrumb from "../components/breadcrumb/breadcrumb";
import AdminUserArea from "../components/admin-users/admin-user-area";
import ProtectedRoute from "@/components/common/ProtectedRoute";

const AdminUsersPage = () => {
  return (
    <ProtectedRoute requiredPath="/admin-users">
      <Wrapper>
        <div className="body-content px-8 py-8 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
          {/* breadcrumb start */}
          <Breadcrumb title="Admin Users" subtitle="Manage Admin User Accounts" />
          {/* breadcrumb end */}

          {/* admin users area start */}
          <AdminUserArea />
          {/* admin users area end */}
        </div>
      </Wrapper>
    </ProtectedRoute>
  );
};

export default AdminUsersPage;