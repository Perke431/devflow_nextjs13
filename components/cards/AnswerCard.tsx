import Link from 'next/link'
import React from 'react'
import Metric from '../shared/Metric'
import { formatAndDivideNumber, getTimestamp } from '@/lib/utils'
import { SignedIn } from '@clerk/nextjs';
import EditDeleteAction from '../shared/EditDeleteAction';

interface AnswerProps {
    _id: string,
    clerkId?: string | null;
    question: {
        _id: string,
        title: string
    },
    author: {
        _id: string,
        clerkId: string;
        name: string,
        picture: string
    },
    upvotes: string[],
    createdAt: Date
}

const AnswerCard = ({
    _id,
    clerkId,
    question,
    author,
    upvotes,
    createdAt
}: AnswerProps) => {

    const showActionButtons = clerkId && clerkId === author.clerkId;

    return (
        <Link
            href={`/question/${question._id}/#${_id}`}
            className='card-wrapper rounded-[10px] px-11 py-9'
        >
            <div className='flex flex-col-reverse items-start justify-between gap-5 sm:flex-row'>
                <div>
                    <span className='subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden'>
                        {getTimestamp(createdAt)}
                    </span>
                    <h3 className='sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1'>
                        {question.title}
                    </h3>
                </div>

                <SignedIn>
                    {showActionButtons && (
                        <EditDeleteAction
                            type='answer'
                            itemId={JSON.stringify(_id)}
                        />
                    )}
                </SignedIn>
            </div>

            <div className='flex-between mt-6 w-full flex-wrap gap-3'>
                <Metric
                    imgUrl={author.picture}
                    alt='user'
                    value={author.name}
                    title={` - asked ${getTimestamp(createdAt)}`}
                    href={`/profile/${author._id}`}
                    isAuthor
                    textStyles="body-medium text-dark400_light800"
                />
                <Metric
                    imgUrl='/assets/icons/like.svg'
                    alt='upvotes'
                    value={formatAndDivideNumber(upvotes.length)}
                    title=" Votes"
                    textStyles="small-medium text-dark400_light800"
                />
            </div>
        </Link>
    )
}

export default AnswerCard