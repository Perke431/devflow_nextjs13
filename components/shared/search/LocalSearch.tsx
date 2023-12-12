"use client"
import React from 'react'
import Image from 'next/image';
import { Input } from '@/components/ui/input';

export interface CustomInputProps {
    route: string,
    iconPosition: string,
    imgSrc: string,
    placeholder: string,
    otherClasses?: string
}

const LocalSearch = ({
    route,
    iconPosition,
    imgSrc,
    placeholder,
    otherClasses
}: CustomInputProps) => {
    return (
        <div className={`background-light800_darkgradient flex min-h-[56px] flex-1 grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}>
            {iconPosition === 'left' && (
                <Image
                    src={imgSrc}
                    alt='Search icon'
                    width={24}
                    height={24}
                    className='cursor-pointer' />
            )}
            <Input
                type='text'
                placeholder={placeholder}
                value=''
                onChange={() => { }}
                className='paragraph-regular no-focus placeholder text-light800_darkgradient flex h-9 w-full rounded-md border border-none border-slate-200 bg-transparent px-3 py-1 text-sm shadow-none outline-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300' />
            {iconPosition === 'right' && (
                <Image
                    src={imgSrc}
                    alt='Search icon'
                    width={24}
                    height={24}
                    className='cursor-pointer' />
            )}
        </div>
    )
}

export default LocalSearch