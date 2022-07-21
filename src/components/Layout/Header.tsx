import Link from "next/link";
import { signOut, signIn, useSession } from "next-auth/react";

function Header() {
  const { data: session } = useSession();
  return (
    <div className="sticky items-center flex top-0 py-3 border-b px-14 justify-between">
      <Link href="/">
        <a>Blog</a>
      </Link>
      <div className="flex items-center space-x-8">
        <div className="flex space-x-4">
          <Link href="/">
            <a>About Us</a>
          </Link>
          <Link href="/">
            <a>Privacy Policy</a>
          </Link>
          <Link href="/">
            <a>Terms and Conditions</a>
          </Link>
        </div>
        {session ? (
          <div className="space-x-4 flex">
            <Link href="/my-posts">
              <button className="py-2 px-4 bg-yellow-600 hover:bg-yellow-500 rounded-md text-white">
                My Posts
              </button>
            </Link>
            <button
              className="py-2 px-4 bg-red-500 hover:bg-red-400 rounded-md text-white"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            className="py-2 px-4 bg-indigo-500 hover:bg-indigo-400 rounded-md text-white"
            onClick={() => signIn("google")}
          >
            Sign In with Google
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
