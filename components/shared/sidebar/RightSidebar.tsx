import React from 'react'
import Link from 'next/link'
import Image from 'next/image';

import { hotNetwork, popularTags } from '@/constants'
import RenderTag from '@/components/shared/RenderTag';

const RightSidebar = () => {
    return (
        <section className='custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden'>
            <div>
                <h3 className='h3-bold text-dark200_light900'>Top Questions</h3>
                <div className='mt-7 flex w-full flex-col gap-[30px]'>
                    {hotNetwork.map(item => (
                        <Link key={item.id} href={`question/${item.id}`} className='flex cursor-pointer items-center justify-between gap-7'>
                            <p className='body-medium text-dark500_light700'>{item.text}</p>
                            <Image className='invert-colors' src='/assets/icons/chevron-right.svg' alt='Chevron right icon' width={20} height={20} />
                        </Link>
                    ))}
                </div>
            </div>
            <div className='mt-16'>
                <h3 className='h3-bold text-dark200_light900'>Popular Tags</h3>
                <div className='mt-7 flex flex-col gap-4'>
                    {popularTags.map(item => (
                        <RenderTag key={item._id} tag={item} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default RightSidebar