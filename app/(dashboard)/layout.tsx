import AdminNotification from "@/components/AdminNotification";
import PushNotificationSetup from "@/components/PushNotificationSetup";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PushNotificationSetup />
      <AdminNotification />
      {children}
    </>
  );
}
