export const dynamic = 'force-dynamic';
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ADMIN_EMAILS = [
  "kkflabel@gmail.com",
  "pranatapramudya39@gmail.com",
  "pranajaya52@gmail.com",
  "uwen.rejekismd@gmail.com",
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
    redirect('/');
  }

  return <>{children}</>;
}
