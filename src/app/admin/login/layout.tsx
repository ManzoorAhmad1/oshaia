// Login page uses AdminLayoutClient which skips the guard for /admin/login
export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
