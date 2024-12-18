import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bell, User, ChevronDown, Menu, X, LogIn } from 'lucide-react';
import Dropdown from '@/components/ui/DropDown';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import Button from './Button';

type MenuItem = {
  title: string;
  href?: string;
  children?: MenuItem[];
};

type HeaderProps = {
  menuItems?: MenuItem[];
};

const isActivePath = (currentPath: string, itemPath: string, exact: boolean = false) => {
  if (!itemPath || !currentPath) return false;
  if (exact) return currentPath === itemPath;
  return currentPath.startsWith(itemPath);
};

// Function to check if any child path is active
const hasActiveChild = (currentPath: string, children?: MenuItem[]): boolean => {
  if (!children) return false;
  return children.some(child =>
    isActivePath(currentPath, child.href || '') || hasActiveChild(currentPath, child.children)
  );
};

// Custom hook to detect if element is near screen edge
const useDropdownPosition = (ref: React.RefObject<HTMLDivElement>) => {
  const [position, setPosition] = useState<'left' | 'right'>('right');

  useEffect(() => {
    const checkPosition = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const spaceToRight = window.innerWidth - rect.right;
        const spaceToLeft = rect.left;

        if (spaceToRight < 200 && spaceToLeft > 200) {
          setPosition('left');
        } else {
          setPosition('right');
        }
      }
    };

    checkPosition();
    window.addEventListener('resize', checkPosition);
    return () => window.removeEventListener('resize', checkPosition);
  }, [ref]);

  return position;
};

const MobileMenuItem = ({ item }: { item: MenuItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActive = isActivePath(pathname, item.href || '') || hasActiveChild(pathname, item.children);

  if (item.children?.length) {
    return (
      <div className="w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between w-full px-4 py-2 text-gray-700 hover:bg-gray-100 ${isActive ? 'text-blue-600 bg-blue-50' : ''
            }`}
        >
          {item.title}
          <ChevronDown
            size={16}
            className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
              }`}
          />
        </button>
        <div
          className={`pl-4 space-y-1 transition-all duration-200 ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}
        >
          {item.children.map((child, index) => (
            <MobileMenuItem key={index} item={child} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Link
      href={item.href || '#'}
      className={`block px-4 py-2 text-gray-700 hover:bg-gray-100 ${isActive ? 'text-blue-600 bg-blue-50' : ''
        }`}
    >
      {item.title}
    </Link>
  );
};

const NavItem = ({ item }: { item: MenuItem }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const position = useDropdownPosition(dropdownRef);
  const pathname = usePathname();
  const isActive = isActivePath(pathname, item.href || '') || hasActiveChild(pathname, item.children);

  if (item.children?.length) {
    return (
      <div className="relative" ref={dropdownRef}>
        <Dropdown
          trigger={
            <button className={`flex items-center px-3 py-2 text-sm transition-colors ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}>
              {item.title}
              <ChevronDown size={16} className="ml-1" />
            </button>
          }
          triggerClassName="relative"
        >
          <div className={`py-2 min-w-[200px] ${position === 'left' ? '-left-full' : ''}`}>
            {item.children.map((child, index) => (
              <NavItemContent key={index} item={child} parentPosition={position} />
            ))}
          </div>
        </Dropdown>
      </div>
    );
  }

  return (
    <Link
      href={item.href || '#'}
      className={`px-3 py-2 text-sm transition-colors ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
        }`}
    >
      {item.title}
    </Link>
  );
};

const NavItemContent = ({
  item,
  parentPosition
}: {
  item: MenuItem;
  parentPosition: 'left' | 'right';
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const position = useDropdownPosition(dropdownRef);
  const pathname = usePathname();
  const isActive = isActivePath(pathname, item.href || '') || hasActiveChild(pathname, item.children);

  if (item.children?.length) {
    const dropdownPosition = parentPosition === 'left' ? 'right' : 'left';

    return (
      <div className="relative group" ref={dropdownRef}>
        <Dropdown
          trigger={
            <button className={`flex items-center justify-between w-full px-4 py-2 text-sm ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'
              }`}>
              {item.title}
              <ChevronDown
                size={16}
                className={`ml-2 ${dropdownPosition === 'left' ? '-rotate-90' : 'rotate-90'}`}
              />
            </button>
          }
          triggerClassName="relative w-full"
        >
          <div
            className={`
              py-2 min-w-[200px] absolute
              ${dropdownPosition === 'left' ? 'left-full' : 'right-full'}
              top-0 -mt-2
            `}
          >
            {item.children.map((child, index) => (
              <NavItemContent
                key={index}
                item={child}
                parentPosition={position}
              />
            ))}
          </div>
        </Dropdown>
      </div>
    );
  }

  return (
    <Link
      href={item.href || '#'}
      className={`block px-4 py-2 text-sm w-full text-left ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'
        }`}
    >
      {item.title}
    </Link>
  );
};

const Header = ({ menuItems }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="w-full bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left section with logos */}
          <div className="flex items-center space-x-4">
            <Image
              src="/logo.png"
              alt={process.env.NEXT_PUBLIC_APP_NAME || ""}
              width={350}
              height={50}
              className="object-contain dark:hidden"
            />

            <Image
              src="/logo-dark.png"
              alt={process.env.NEXT_PUBLIC_APP_NAME || ""}
              width={350}
              height={50}
              className="object-contain hidden dark:block"
            />
          </div>

          {/* Navigation items - Only show if user is authenticated */}
          {user && menuItems && (
            <nav className="hidden md:flex items-center space-x-4">
              {menuItems.map((item, index) => (
                <NavItem key={index} item={item} />
              ))}
            </nav>
          )}

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button className="p-2 text-gray-600 hover:text-blue-600 relative">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="h-6 w-px bg-gray-300" />
                {/* User Menu */}
                <Dropdown
                  trigger={<User size={24} />}
                  triggerClassName="p-2 rounded-lg hover:bg-gray-100 hover:text-gray-700 relative"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 w-10 h-10">
                        <User height={36} />
                      </div>
                      <div>
                        <h4 className="font-medium">{user?.name}</h4>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <hr className="my-2" />
                    <nav className="space-y-1">
                      <button
                        type="button"
                        onClick={logout}
                        className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-red-600"
                      >
                        Sign out
                      </button>
                    </nav>
                  </div>
                </Dropdown>
                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  startIcon={LogIn}
                  variant={'outline'}
                  className=""
                >
                  Sign In
                </Button>

                <Button
                  startIcon={User}
                  variant={'primary'}
                  className=""
                >
                  Register
                </Button>

              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {user && menuItems && (
          <div
            className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen
              ? 'max-h-screen opacity-100 visible'
              : 'max-h-0 opacity-0 invisible'
              }`}
          >
            <nav className="py-4 space-y-1 border-t">
              {menuItems.map((item, index) => (
                <MobileMenuItem key={index} item={item} />
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;