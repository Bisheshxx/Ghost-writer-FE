import AuthShell from "@/features/auth/components/AuthShell";
import CustomSignIn from "@/features/auth/components/CustomSignIn";

export default function Page() {
  return (
    <AuthShell
      description="Sign in to continue managing your job details, projects, skills, and cover letters."
      title="Welcome back"
    >
      <CustomSignIn />
    </AuthShell>
  );
}
