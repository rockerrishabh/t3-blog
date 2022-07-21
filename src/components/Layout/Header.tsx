import Link from "next/link";
import { signOut, signIn, useSession } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment } from "react";
import { useRouter } from "next/router";

function Header() {
  const { data: session } = useSession();
  const router = useRouter();

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
          <div className="space-x-4 items-center flex">
            <Link href="/dashboard/my-posts">
              <button className="py-2 px-4 bg-yellow-600 hover:bg-yellow-500 rounded-md text-white">
                My Posts
              </button>
            </Link>
            <Menu as="div" className="relative inline-block mt-1 text-left">
              <div>
                <Menu.Button className="inline-flex w-full items-center justify-center rounded-md ">
                  <Image
                    className="cursor-pointer rounded-full"
                    height="40px"
                    width="40px"
                    src={session?.user.image}
                    alt={session?.user.name}
                  />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    <Link href="/">
                      <Menu.Item>
                        {({ active }: any) => (
                          <button
                            className={`${
                              active
                                ? "bg-violet-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Profile
                          </button>
                        )}
                      </Menu.Item>
                    </Link>
                  </div>
                  <div className="px-1 py-1">
                    <Link href="/">
                      <Menu.Item>
                        {({ active }: any) => (
                          <button
                            className={`${
                              active
                                ? "bg-violet-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Settings
                          </button>
                        )}
                      </Menu.Item>
                    </Link>
                  </div>
                  <div className="px-1 py-1">
                    <Link href="/">
                      <Menu.Item>
                        {({ active }: any) => (
                          <button
                            onClick={() => {
                              signOut({ callbackUrl: router.asPath });
                            }}
                            className={`${
                              active
                                ? "bg-violet-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Sign Out
                          </button>
                        )}
                      </Menu.Item>
                    </Link>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        ) : (
          <button
            className="py-2 px-4 bg-indigo-500 hover:bg-indigo-400 rounded-md text-white"
            onClick={() =>
              signIn("google", {
                callbackUrl: router.asPath,
              })
            }
          >
            Sign In with Google
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
