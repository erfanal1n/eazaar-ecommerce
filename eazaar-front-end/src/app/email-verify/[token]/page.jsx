import EmailVerifyArea from "@/components/email-verify/email-verify-area";

export const metadata = {
  title: "EAZAAR - Email Verify Page",
};

export default function EmailVerifyPage({ params }) {
  return (
    <>
      <EmailVerifyArea token={params.token} />
    </>
  );
}
