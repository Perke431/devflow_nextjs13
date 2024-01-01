import LocalSearch from "@/components/shared/search/LocalSearch";
import NoResults from "@/components/shared/NoResults";
import QuestionCard from "@/components/cards/QuestionCard";
import { getQuestionsByTagId } from "@/lib/actions/tag.actions";
import { URLProps } from "@/types";
import Pagination from "@/components/shared/Pagination";

export default async function TagDetail({ params, searchParams }: URLProps) {

    const result = await getQuestionsByTagId({
        tagId: params.id,
        page: searchParams.page ? +searchParams.page : 1,
        searchQuery: searchParams.q,
    });

    return (
        <>
            <h1 className="h1-bold text-dark100_light900"> {result.tagTitle} </h1>

            <div className="mt-11 w-full">
                <LocalSearch
                    route={`/tags/${params.id}`}
                    iconPosition='left'
                    imgSrc='/assets/icons/search.svg'
                    placeholder="Search tag questions..."
                    otherClasses='flex-1'
                />
            </div>

            <div className="mt-10 flex w-full flex-col gap-6">
                {result.questions.length > 0 ? result.questions.map((question: any) => (
                    <QuestionCard
                        key={question._id}
                        _id={question._id}
                        title={question.title}
                        tags={question.tags}
                        author={question.author}
                        upvotes={question.upvotes}
                        views={question.views}
                        answers={question.answers}
                        createdAt={question.createdAt}
                    />
                )) : <NoResults
                    title='There&apos;s no tag questions to show'
                    description='Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡'
                    link='/ask-question'
                    linkTitle='Ask a Question'
                />}
            </div>

            <div className='mt-10'>
                <Pagination
                    pageNumber={searchParams?.page ? +searchParams.page : 1}
                    isNext={result.isNext}
                />
            </div>
        </>
    )
}