import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ALLOWED_EMAILS = [
  "pranatapramudya39@gmail.com",
  "pranajaya52@gmail.com",
  "kkflabel@gmail.com",
  "uwenkuswendi5@gmail.com"
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  if (!userEmail || !ALLOWED_EMAILS.includes(userEmail)) {
    redirect('/');
  }

  return <>{children}</>;
}
