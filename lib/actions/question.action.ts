"use server"

import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { connectToDatabase } from "../mongoose";
import { GetQuestionsParams, CreateQuestionParams, GetQuestionByIdParams, QuestionVoteParams, DeleteQuestionParams, EditQuestionParams, RecommendedParams } from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import { FilterQuery } from "mongoose";

export async function getQuestions(params: GetQuestionsParams) {
    try {
        connectToDatabase();

        const { searchQuery, filter, page = 1, pageSize = 20 } = params;

        const skipAmount = (page - 1) * pageSize;

        const query: FilterQuery<typeof Question> = {};

        if (searchQuery) {
            query.$or = [
                { title: { $regex: new RegExp(searchQuery, 'i')}},
                { content: { $regex: new RegExp(searchQuery, 'i')}}
            ]
        }

        let sortOptions = {};

        switch (filter) {
            case "newest":
                sortOptions = { createdAt: -1}
                break;
            case "recommended": 
                break;
            case "frequent":
                sortOptions = { views: -1}
                break;
            case "unanswered":
                query.answers = { $size: 0}
                break;
        }

        const questions = await Question.find(query)
        .populate({ path: 'tags', model: Tag })
        .populate({ path: 'author', model: User})
        .skip(skipAmount)
        .limit(pageSize)
        .sort(sortOptions);

        const totalQuestions = await Question.countDocuments(query);

        const isNext = totalQuestions > skipAmount + questions.length;

        return { questions, isNext };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function createQuestion(params: CreateQuestionParams) {
    try {
        connectToDatabase();

        const { title, content, tags, author, path } = params;

        const question = await Question.create({
            title,
            content,
            author
        });

        const tagDocuments = [];

        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate(
                { name: { $regex: new RegExp(`^${tag}$`, "i")}},
                { $setOnInsert: { name: tag}, $push: {questions: question._id}},
                { upsert: true, new: true }
            )
        
            tagDocuments.push(existingTag._id);
        }

        await Question.findByIdAndUpdate(question._id, {
            $push: { tags: { $each: tagDocuments }}
        })

        // Create an interaction record for the users ask_question action
        await Interaction.create({
            user: author,
            action: 'ask_question',
            question: question._id,
            tags: tagDocuments,
        })

        // Increment authors reputation for +5 points
        await User.findByIdAndUpdate(author, { $inc: {reputation: 5}})

        revalidatePath(path)
    } catch (error) {
        console.log(error);
        throw error;
        
    }
}

export async function getSingleQuestion(params: GetQuestionByIdParams) {
    try {
        connectToDatabase();

        const {questionId} = params;

        const question = await Question.findById(questionId)
        .populate({ path: 'tags', model: Tag, select: '_id name' })
        .populate({ path: 'author', model: User, select: '_id clerkId name picture'})

        return question;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
    try {
        connectToDatabase();

        const {questionId, userId, hasupVoted, hasdownVoted, path} = params;

        let updateQuery = {};

        if (hasupVoted) {
            updateQuery = { $pull: {upvotes: userId}}
        } else if (hasdownVoted) {
            updateQuery = { 
                $pull: {downvotes: userId},
                $push: {upvotes: userId}
            }
        } else {
            updateQuery = { $addToSet: {upvotes: userId}}
        }

        const question = await Question.findByIdAndUpdate(
            questionId, updateQuery, {new: true}
        )

        if (!question) {
            throw new Error("Question not found!");
        }

        await User.findByIdAndUpdate(userId, {
            $inc: { reputation: hasupVoted ? -1 : 1}
        })

        await User.findByIdAndUpdate(question.author, {
            $inc: { reputation: hasupVoted ? -10 : 10}
        })

        revalidatePath(path);

    } catch (error) {
        console.log(error);
    }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
    try {
        connectToDatabase();

        const {userId, questionId, hasupVoted, hasdownVoted, path} = params;

        let updateQuery = {};

        if (hasdownVoted) {
            updateQuery = { $pull: {downvotes: userId}}
        } else if (hasupVoted) {
            updateQuery = { 
                $pull: {upvotes: userId},
                $push: {downvotes: userId}
            }
        } else {
            updateQuery = { $addToSet: {downvotes: userId}}
        }

        const question = await Question.findByIdAndUpdate(
            questionId, updateQuery, {new: true}
        )

        if (!question) {
            throw new Error("Question not found!");
        }

        await User.findByIdAndUpdate(userId, {
            $inc: { reputation: hasdownVoted ? -1 : 1}
        })

        await User.findByIdAndUpdate(question.author, {
            $inc: { reputation: hasdownVoted ? -10 : 10}
        })

        revalidatePath(path);

    } catch (error) {
        console.log(error);
    }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
    try {
        connectToDatabase();

        const {questionId, path} = params;

        await Question.deleteOne({ _id: questionId});
        await Answer.deleteMany({ question: questionId });
        await Interaction.deleteMany({ question: questionId });
        await Tag.updateMany({ questions: questionId}, {$pull: {questions: questionId}});

        revalidatePath(path);

    } catch (error) {
        console.log(error)
        
    }
}

export async function editQuestions(params: EditQuestionParams) {
    try {
        connectToDatabase();

        const {questionId, title, content, path} = params;

        const question = await Question.findById(questionId).populate("tags");

        if (!question) {
            throw new Error('Question not found');
        }

        question.title = title;
        question.content = content;

        await question.save();

        revalidatePath(path);

    } catch (error) {
        console.log(error)
        
    }
}

export async function getHotQuestions () {
    try {
        connectToDatabase();

        const hotQuestions = await Question.find({})
        .sort({views: -1, upvotes: -1})
        .limit(5);


        return hotQuestions;

    } catch(error){
        console.log(error);
        throw error;
        
    }
}


// export async function getHotQuestions () {
//     try {
//         connectToDatabase();

//     } catch(error){
//         console.log(error);
//         throw error;
        
//     }
// }

export async function getRecommendedQuestions(params: RecommendedParams) {
    try {
        connectToDatabase();

        const { userId, page = 1, pageSize = 20, searchQuery } = params;

        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            throw new Error('User not found');
        }

        const skipAmount = (page - 1) * pageSize;

        const userInteractions = await Interaction.find({ user: user._id })
        .populate('tags')
        .exec();

        const userTags = userInteractions.reduce((tags, interaction) => {
            if (interaction.tags) {
                tags = tags.concat(interaction.tags);
            }
            return tags;
        }, []);

        const distincUserTagsIds = [
            // @ts-ignore
            ...new Set(userTags.map((tag: any) => tag._id)),
        ];

        const query: FilterQuery<typeof Question> = {
            $and: [
                { tags: { $in: distincUserTagsIds } },
                { author: { $ne: user._id } },
            ],
        };

        if (searchQuery) {
            query.$or = [
                { title: { $regex: searchQuery, $options: "i" } },
                { content: { $regex: searchQuery, $options: "i" } },
            ];
        }

        const totalQuestions = await Question.countDocuments(query);

        const recommendedQuestions = await Question.find(query)
        .populate({
            path: 'tags',
            model: Tag,
        })
        .populate({
            path: 'author',
            model: User
        })
        .skip(skipAmount)
        .limit(pageSize)

        const isNext = totalQuestions > skipAmount + recommendedQuestions.length;

        return { questions: recommendedQuestions, isNext };
    } catch (error) {
        console.error("Error getting recommended questions:", error);
        throw error
    }
}