import AuthShell from "@/features/auth/components/AuthShell";
import CustomSignUp from "@/features/auth/components/CustomSignUp";

export default function Page() {
  return (
    <AuthShell
      description="Create your workspace with the basic details needed to personalize generated drafts."
      title="Create your account"
    >
      <CustomSignUp />
    </AuthShell>
  );
}
