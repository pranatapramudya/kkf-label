import AdminNotification from "@/components/AdminNotification";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminNotification />
      {children}
    </>
  );
}
