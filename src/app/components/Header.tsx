'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
    PopoverOverlay,
} from '@headlessui/react';
import {
    ArrowPathIcon,
    Bars3Icon,
    ChartPieIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
    XMarkIcon,
    UserIcon,
    PowerIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const buyerProducts = [
    { name: 'View Products', description: 'Browse all available products', href: '/', icon: ChartPieIcon },
];

const sellerProducts = [
    { name: 'View Products', description: 'Browse all available product', href: '/', icon: ChartPieIcon },
    { name: 'Add Products', description: 'Add your products', href: '/addproducts', icon: FingerPrintIcon },

];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userRole, setUserRole] = useState('buyer'); // Default role
    const [isLoggedin, setIsLoggedin] = useState(false); // Simulate login state
    const [username, setUsername] = useState(''); // Simulate username

    const products = userRole === 'buyer' ? buyerProducts : sellerProducts;
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await axios.get('/api/users/logout');
            toast.success('Logged out successfully');
            router.push('/login');
            setIsLoggedin(false);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                toast.error(error.message);
            } else {
                toast.error('An unknown error occurred');
            }
        }
    };

    const getUserDetails = async () => {
        try {
            const res = await axios.get('/api/users/userinfo');
            setUserRole(res.data.data.roles);
            setUsername(res.data.data.username);
            setIsLoggedin(true);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log('An unknown error occurred');
            }
        }
    };


    // Ensure that user info is fetched after login or page load
    useEffect(() => {
        getUserDetails();
    }, [router]);

    return (
        <header className="bg-white shadow-lg border-b border-gray-200">
            <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                {/* Left Icon (New) */}
                <div className="flex items-center lg:flex-1">
                    <a href="/" className="flex items-center -m-1.5 p-1.5 space-x-2">
                        <img alt="logo" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                            className="mx-auto h-10 w-auto" />
                        <span className="text-2xl font-extrabold tracking-tight text-indigo-600">VendEasy</span>
                    </a>
                </div>


                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="h-6 w-6" />
                    </button>
                </div>

                <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                    <a href="/" className="text-sm font-semibold leading-6 text-gray-900">
                        Home
                    </a>
                    <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                        About us
                    </a>
                    <Popover className="relative">
                        {({ open }) => (
                            <>
                                <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 ">
                                    Products
                                    <ChevronDownIcon aria-hidden="true" className={`h-5 w-5 flex-none text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                                </PopoverButton>
                                <PopoverPanel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition">
                                    <div className="p-4">
                                        {products.map((item) => (
                                            <div
                                                key={item.name}
                                                className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                                            >
                                                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                    <item.icon aria-hidden="true" className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" />
                                                </div>
                                                <div className="flex-auto">
                                                    <a href={item.href} className="block font-semibold text-gray-900">
                                                        {item.name}
                                                        <span className="absolute inset-0" />
                                                    </a>
                                                    <p className="mt-1 text-gray-600">{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </PopoverPanel>
                                <PopoverOverlay className="fixed inset-0 bg-black opacity-25" />
                            </>
                        )}
                    </Popover>


                </PopoverGroup>

                {/* Profile and Logout Section */}
                {isLoggedin ? (
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        <Popover className="relative">
                            {({ open }) => (
                                <>
                                    {/* Button to open the popover */}
                                    <Popover.Button className="flex items-center gap-x-2 text-sm font-semibold leading-6 text-gray-900 focus:outline-none">
                                        <UserIcon className="h-6 w-6 text-gray-700" />
                                        {username}
                                        <ChevronDownIcon
                                            aria-hidden="true"
                                            className={`h-5 w-5 flex-none text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </Popover.Button>

                                    {/* Overlay to close on outside click */}
                                    <Popover.Overlay className="fixed inset-0 bg-transparent z-0" />

                                    {/* Dropdown content */}
                                    <Popover.Panel className="absolute right-0 z-10 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-gray-900/5">
                                        <div className="p-4">
                                            <div
                                                className="group relative flex items-center gap-x-6 rounded-lg p-2 text-sm leading-6 hover:bg-gray-50 cursor-pointer"
                                                onClick={handleLogout}
                                            >
                                                <PowerIcon className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" />
                                                <span className="font-semibold text-gray-900">Log out</span>
                                            </div>
                                        </div>
                                    </Popover.Panel>
                                </>
                            )}
                        </Popover>
                    </div>
                ) : (
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">

                        {/* <a href="/login" className="text-sm font-semibold leading-6 text-gray-900">
                        Log in <span aria-hidden="true">&rarr;</span>
                        </a> */}
                    </div>
                )}
            </nav>

            {/* Mobile Menu */}
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-10" />
                <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Vending Machine</span>
                            <img alt="" src="/images/logo.svg" className="h-8 w-auto" />
                        </a>
                        <button
                            type="button"
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                
                                <a
                                    href="/"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    Home
                                </a>
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    About us
                                </a>
                                <Disclosure as="div" className="-mx-3">
                                    {({ open }) => (
                                        <>
                                            <DisclosureButton className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-0">
                                                Products
                                                <ChevronDownIcon
                                                    aria-hidden="true"
                                                    className={`h-5 w-5 flex-none transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                                                />
                                            </DisclosureButton>


                                            <DisclosurePanel className="mt-2 space-y-2">
                                                {products.map((item) => (
                                                    <Disclosure.Button
                                                        key={item.name}
                                                        as="a"
                                                        href={item.href}
                                                        className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                                    >
                                                        {item.name}
                                                    </Disclosure.Button>
                                                ))}
                                            </DisclosurePanel>
                                        </>
                                    )}
                                </Disclosure>
                            </div>
                            <div className="py-6">
                                {isLoggedin ? (
                                    <div
                                        className="block rounded-lg px-3 py-2.5 text-base font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                                        onClick={handleLogout}
                                    >
                                        Log out
                                    </div>
                                ) : (
                                    <a
                                        href="/login"
                                        className="block rounded-lg px-3 py-2.5 text-base font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                                    >
                                        Log in
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </header>
    );
}
