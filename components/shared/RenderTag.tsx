import React from 'react'

import Link from 'next/link';
import { Badge } from "@/components/ui/badge"

interface Tags {
    _id: string;
    label: string;
    count?: number
}

const RenderTag = ({ _id, label, count }: Tags) => {

    return (
        <Link href={`/tags/${_id}`} className='flex justify-between gap-2'>
            <Badge variant='secondary' className='subtle-medium background-light800_dark300 text-light400_light500 inline-flex items-center rounded-md border border-none border-transparent bg-slate-900 px-4 py-2 text-xs font-semibold uppercase shadow transition-colors hover:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:border-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80 dark:focus:ring-slate-300'>{label}</Badge >
            {count && (
                <p className='small-medium text-dark500_light700'>{count}+</p>
            )}
        </Link>
    )
}

export default RenderTag