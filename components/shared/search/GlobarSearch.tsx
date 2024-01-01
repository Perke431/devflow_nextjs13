'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formURLQuery, removeKeysFromQuery } from '@/lib/utils';
import GlobalResult from './GlobalResult';

const GlobarSearch = () => {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const searchContainerRef = useRef(null);

    const [search, setSearch] = useState(query || '');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleOutsideClick = (e: any) => {
            // @ts-ignore
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
                setIsOpen(false);
                setSearch('')
            }
        }

        setIsOpen(false);

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        }
    }, [pathname])

    useEffect(() => {
        const delayDebounceFN = setTimeout(() => {
            if (search) {
                const newURL = formURLQuery({
                    params: searchParams.toString(),
                    key: 'global',
                    value: search
                })
                router.push(newURL, { scroll: false })
            } else {
                if (query) {
                    const newURL = removeKeysFromQuery({
                        params: searchParams.toString(),
                        keysToRemove: ['global', 'type']
                    })
                    router.push(newURL, { scroll: false })
                }
            }
        }, 300);

        return () => clearTimeout(delayDebounceFN);
    }, [search, router, pathname, searchParams, query])

    return (
        <div className='relative w-full max-w-[600px] max-lg:hidden' ref={searchContainerRef}>
            <div
                className='background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4'>
                <Image src='/assets/icons/search.svg' alt='Search' width={24} height={24} className='cursor-pointer' />
                <Input
                    type='text'
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);

                        if (!isOpen) {
                            setIsOpen(true);
                        }

                        if (e.target.value === '' && isOpen) {
                            setIsOpen(false);
                        }
                    }}
                    placeholder='Search globaly'
                    className='
                    paragraph-regular no-focus placeholder text-dark400_light700
                    border-none bg-transparent shadow-none outline-none' />
            </div>
            {isOpen && <GlobalResult />}
        </div>
    )
}

export default GlobarSearch