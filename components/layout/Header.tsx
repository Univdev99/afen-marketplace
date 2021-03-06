import Image from "next/image";
import Link from "next/link";
import Button from "@/design-system/Button";
import React, { useState } from "react";
import UserDropdownMenu from "@/design-system/UserDropdownMenu";
import { navigationLinks, userLinksMobile } from "../../constants/links";
import { DuplicateIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import Flex from "@/design-system/Flex";
import Text from "@/design-system/Text";
import { FcCheckmark } from "react-icons/fc";
import { copyToClipboard } from "utils/misc";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@heroicons/react/solid";
import useUser from "hooks/useUser";

const Header: React.FC = ({}: any) => {
  const node = React.useRef();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const { theme, setTheme } = useTheme();
  const {
    user: userData,
    getUser,
    connectWallet,
    disconnectWallet,
    mobileWalletConnect,
  } = useUser();

  const handleMobileConnection = async () => {
    mobileWalletConnect.walletConnectInit().then(async () => {
      await getUser(userData.address);
    });
  };

  const handleClickOutside = (e) => {
    // @ts-ignore
    if (node.current.contains(e.target)) {
      return;
    }
    // outside click
    setMobileMenu(false);
  };

  React.useEffect(() => {
    if (mobileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenu]);

  return (
    <div className="fixed w-full z-50 bg-white dark:bg-afen-blue px-4 md:px-10 lg:px-16 py-4 mx-auto border-b-2 dark:border-gray-800 flex items-center">
      <div className="mr-auto">
        <Link href="/">
          <a className="flex items-center" onClick={() => setMobileMenu(false)}>
            <Image src="/logo.png" width="30" height="30" />
            <h1 className="font-medium text-lg md:text-xl ml-2 tracking-tight">
              Marketplace
            </h1>
          </a>
        </Link>
      </div>

      <div className="ml-auto border-r-2 dark:border-gray-700 pr-2 md:pr-4">
        {theme === "dark" ? (
          <SunIcon
            className="h-6 cursor-pointer"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          />
        ) : (
          <MoonIcon
            className="h-6 cursor-pointer text-blue-800"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          />
        )}
      </div>
      <div className="hidden md:flex items-center">
        {navigationLinks.map((link, index) => (
          <div key={index}>
            <Link href={link.href}>
              <Button type="plain" style="mx-4">
                {link.label}
              </Button>
            </Link>
          </div>
        ))}
        {userData.address ? (
          <UserDropdownMenu
            data={userData}
            walletAddressIsCopied={copied}
            onCopyWalletAddress={setCopied}
            onDisconnectWallet={disconnectWallet}
          />
        ) : (
          <Button onClick={connectWallet} type="primary">
            Connect Wallet
          </Button>
        )}
      </div>

      <div className="ml-2 md:hidden">
        {mobileMenu ? (
          <XIcon
            className="w-6 fill-current text-dark dark:text-white"
            onClick={() => setMobileMenu(false)}
          />
        ) : (
          <MenuIcon
            className="w-6 fill-current text-dark dark:text-white"
            onClick={() => setMobileMenu(true)}
          />
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden fixed top-16 right-0 w-screen h-screen bg-black dark:bg-afen-blue bg-opacity-40 dark:bg-opacity-60">
          <div ref={node}>
            <Flex
              col
              style="w-full bg-white dark:bg-rich-black rounded-b-3xl shadow-2xl px-4 z-40 md:px-10 lg:px-16 pt-4 pb-6"
            >
              <div className="w-full">
                {userData.address && (
                  <>
                    <Flex center style="mb-3 overflow-hidden w-full">
                      <div className="mr-3">
                        <div className="relative h-12 w-12 rounded-full bg-gray-300">
                          {userData.user?.avatar && (
                            <Image
                              src={userData.user?.avatar}
                              layout="fill"
                              objectFit="cover"
                              className="rounded-full"
                            />
                          )}
                        </div>
                      </div>
                      <div>
                        <Text size="x-small" sub style="-mb-1">
                          Wallet
                        </Text>
                        <div className="inline-flex">
                          <Text
                            textWidth="w-60"
                            bold
                            truncate
                            style="lowercase"
                          >
                            {userData.user?.name || userData.address}
                          </Text>
                          {copied ? (
                            <FcCheckmark className="ml-2 h-5 w-5" />
                          ) : (
                            <DuplicateIcon
                              onClick={() =>
                                copyToClipboard(userData.address, setCopied)
                              }
                              className={`${
                                open ? "" : "text-opacity-70"
                              } ml-2 h-5 w-5 group-hover:text-opacity-80 transition ease-in-out duration-150 cursor-pointer`}
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        <div className="">
                          <Text size="x-small" sub style="mt-1 -mb-1">
                            Balance
                          </Text>
                          <Text bold sub>
                            {userData.balance}{" "}
                            <span className="text-sm font-normal text-gray-600">
                              BNB
                            </span>
                          </Text>
                        </div>
                      </div>
                    </Flex>
                    <div className="w-full border-b dark:border-gray-800 pb-3 mb-3">
                      {userLinksMobile.map((link, index) => (
                        <div key={index}>
                          <Link href={link.href}>
                            <Text
                              bold
                              size="large"
                              onClick={() => setMobileMenu(false)}
                            >
                              <Text style="mb-1.5">{link.label}</Text>
                            </Text>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                <div className="w-full">
                  {navigationLinks.map((link, index) => (
                    <div key={index}>
                      <Link key={index} href={link.href}>
                        <Text
                          bold
                          size="large"
                          onClick={() => setMobileMenu(false)}
                        >
                          <Text style="mb-1.5">{link.label}</Text>
                        </Text>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
              {!userData.address && (
                <Button
                  type="primary"
                  block
                  style="mt-2 w-full"
                  onClick={handleMobileConnection}
                >
                  Connect Wallet
                </Button>
              )}
            </Flex>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
