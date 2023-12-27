"use client"
import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { sidebarLinks } from '@/constants';
import { Button } from '@/components/ui/button';
import { SignedOut, SignedIn, useClerk, useAuth } from '@clerk/nextjs';

const NavContent = () => {
    const { userId } = useAuth();
    const pathname = usePathname();

    return (
        <div className='flex flex-1 flex-col gap-6' >
            {sidebarLinks.map((item) => {
                const isActive = (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route;

                if (item.route === '/profile') {
                    if (userId) {
                        item.route = `${item.route}/${userId}`
                    } else {
                        return null;
                    }
                }

                return (
                    <Link href={item.route} className={`${isActive ?
                        'primary-gradient rounded-lg text-light-900' : 'text-dark300_light900 '}
                            flex items-center justify-start gap-4 bg-transparent p-4
                            `} key={item.route}>
                        <Image
                            src={item.imgURL}
                            alt={item.label}
                            width={20}
                            height={20}
                            className={`${isActive ? "" : 'invert-colors'}`}
                        />
                        <p className={`${isActive ? 'base-bold' : 'base-medium'} base-medium max-lg:hidden`}>{item.label}</p>
                    </Link>
                )
            })}
        </div>
    )
}

const LeftSidebar = () => {
    const { signOut } = useClerk();
    const router = useRouter();

    return (
        <section className='custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 flex h-screen w-fit flex-col justify-between  overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]'>
            <NavContent />
            <div className='flex flex-col gap-3'>
                <SignedOut>
                    <Link href='/sign-in'>
                        <Button className='small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none'>
                            <Image
                                src='/assets/icons/account.svg'
                                width={20}
                                height={20}
                                alt='Login'
                                className='invert-colors lg:hidden'
                            />
                            <span className='primary-text-gradient max-lg:hidden'>Log in</span>
                        </Button>
                    </Link>
                    <Link href='/sign-up'>
                        <Button className='small-medium light-border-2 btn-tertiary text-dark400_light900 inline-flex h-9 min-h-[41px] w-full items-center justify-center rounded-lg border bg-slate-900 px-4 py-3 text-sm font-medium shadow-none transition-colors hover:bg-slate-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 dark:focus-visible:ring-slate-300'>
                            <Image
                                src='/assets/icons/sign-up.svg'
                                width={20}
                                height={20}
                                alt='SignUp'
                                className='invert-colors lg:hidden'
                            />
                            <span className='primary-text-gradient max-lg:hidden'>
                                Sign up
                            </span>
                        </Button>
                    </Link>
                </SignedOut>
                <SignedIn>
                    <Button className='flex items-center justify-start gap-4 bg-transparent p-4' onClick={() => signOut(() => router.push("/"))}>
                        <Image
                            src='/assets/icons/logout.svg'
                            width={20}
                            height={20}
                            alt='SignOut'
                            className='invert-colors'
                        />
                        <span className='base-medium max-lg:hidden'>
                            Logout
                        </span>
                    </Button>
                </SignedIn>
            </div>
        </section>
    )
}

export default LeftSidebar