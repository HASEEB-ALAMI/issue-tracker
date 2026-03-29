import { auth } from "@/auth";
import NavBarClient from "./navBarClient";

export default async function NavBar() {
  const session = await auth();
  const userEmail = session?.user?.email ?? null;

  return <NavBarClient userEmail={userEmail} />;
}
