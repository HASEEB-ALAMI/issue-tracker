"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const currentPath = usePathname();
  return (
    <div className='flex space-x-3 p-4'>
      <Link href={"/"} prefetch={false}>
        LOGO
      </Link>
      <Link
        href={"/"}
        prefetch={false}
        className={`${currentPath === "/" ? "text-black" : "text-gray-500"} `}
      >
        Home
      </Link>
      <Link
        href={"/form"}
        prefetch={false}
        className={`${currentPath === "/form" ? "text-black" : "text-gray-500"} `}
      >
        Issue
      </Link>
    </div>
  )
}

export default NavBar
