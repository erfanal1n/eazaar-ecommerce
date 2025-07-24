import React from "react";
import Breadcrumb from "../components/breadcrumb/breadcrumb";
import Wrapper from "@/layout/wrapper";
import RegisteredUsersArea from "../components/registered-users/registered-users-area";

const RegisteredUsers = () => {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
        {/* breadcrumb start */}
        <Breadcrumb title="Users" subtitle="Registered Users" />
        {/* breadcrumb end */}

        {/* RegisteredUsersArea start */}
        <RegisteredUsersArea />
        {/* RegisteredUsersArea end */}
      </div>
    </Wrapper>
  );
};

export default RegisteredUsers;