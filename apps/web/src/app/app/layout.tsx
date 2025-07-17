import AuthCheck from "@/components/auth/AuthCheck";
import Header from "@/components/layout/AppHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthCheck>
      <div className="grid min-h-screen grid-rows-[auto_1fr]">
        <Header />
        <main className="overflow-auto">{children}</main>
      </div>
    </AuthCheck>
  );
}
