import { LoginForm } from "@/app/login/LoginForm";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center bg-xau-app px-4">
      <LoginForm errorCode={params.error} />
    </div>
  );
}
