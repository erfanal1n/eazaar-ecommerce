import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import RegisterArea from "@/components/login-register/register-area";

export const metadata = {
  title: "EAZAAR - Register Page",
};

export default function RegisterPage() {

  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb title="Register" subtitle="Register" center={true} />
      <RegisterArea />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
