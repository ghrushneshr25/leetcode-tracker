import { useState } from 'react';

import { X } from 'lucide-react';

import type { Question } from '../types/question';

import { useQuestionNotes } from '../hooks/useQuestionNotes';

import QuestionDescription from './QuestionDescription';
import QuestionWorkspace from './QuestionWorkspace';
import QuestionAI from './QuestionAI';
import QuestionGithub from './question/github/QuestionGithub';

interface Props {
    question: Question;
    onClose: () => void;
}

type Tab = 'DESCRIPTION' | 'WORKSPACE' | 'AI' | 'GITHUB';

export default function QuestionDetails({ question, onClose }: Props) {
    const [tab, setTab] = useState<Tab>('DESCRIPTION');

    const { data: notes } = useQuestionNotes(question.id);

    const completedAt = question.completedAt
        ? new Date(question.completedAt).toLocaleString([], {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          })
        : null;

    const difficultyClasses = {
        EASY: 'border border-gray-300 bg-gray-100 text-gray-800',
        MEDIUM: 'border border-gray-300 bg-gray-100 text-gray-800',
        HARD: 'border border-gray-300 bg-gray-100 text-gray-800',
    };

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm'
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className='flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl'
            >
                {/* Header */}

                <div className='flex items-start justify-between border-b px-8 py-6'>
                    <div>
                        <h1 className='text-3xl font-bold'>
                            {question.questionFrontendId}. {question.title}
                        </h1>

                        <div className='mt-4 flex flex-wrap items-center gap-3'>
                            <span
                                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                                    difficultyClasses[question.difficulty]
                                }`}
                            >
                                {question.difficulty}
                            </span>

                            {question.needsReattempt && (
                                <span className='rounded-full border border-orange-300 bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700'>
                                    REATTEMPT
                                </span>
                            )}

                            {completedAt && (
                                <span className='text-sm text-gray-500'>
                                    Completed • {completedAt}
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className='rounded-xl p-2 transition hover:bg-gray-100'
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Tabs */}

                <div className='border-b bg-gray-50 px-8'>
                    <div className='flex gap-2'>
                        <button
                            onClick={() => setTab('DESCRIPTION')}
                            className={`border-b-2 px-6 py-4 text-sm font-semibold transition ${
                                tab === 'DESCRIPTION'
                                    ? 'border-black text-black'
                                    : 'border-transparent text-gray-500 hover:text-black'
                            }`}
                        >
                            Description
                        </button>

                        <button
                            onClick={() => setTab('WORKSPACE')}
                            className={`border-b-2 px-6 py-4 text-sm font-semibold transition ${
                                tab === 'WORKSPACE'
                                    ? 'border-black text-black'
                                    : 'border-transparent text-gray-500 hover:text-black'
                            }`}
                        >
                            Workspace
                        </button>

                        <button
                            onClick={() => setTab('AI')}
                            className={`border-b-2 px-6 py-4 text-sm font-semibold transition ${
                                tab === 'AI'
                                    ? 'border-black text-black'
                                    : 'border-transparent text-gray-500 hover:text-black'
                            }`}
                        >
                            AI Assistant
                        </button>

                        <button
                            onClick={() => setTab('GITHUB')}
                            className={`border-b-2 px-6 py-4 text-sm font-semibold transition ${
                                tab === 'GITHUB'
                                    ? 'border-black text-black'
                                    : 'border-transparent text-gray-500 hover:text-black'
                            }`}
                        >
                            GitHub
                        </button>
                    </div>
                </div>

                {/* Content */}

                <div className='flex-1 overflow-y-auto px-8 py-8'>
                    {tab === 'DESCRIPTION' && <QuestionDescription question={question} />}

                    {tab === 'WORKSPACE' && <QuestionWorkspace questionId={question.id} />}

                    {tab === 'AI' && <QuestionAI question={question} notes={notes} />}

                    {tab === 'GITHUB' && <QuestionGithub questionId={question.id} />}
                </div>

                {/* Footer */}

                <div className='flex items-center justify-between border-t bg-gray-50 px-8 py-5'>
                    <button
                        onClick={onClose}
                        className='rounded-xl border px-5 py-2 transition hover:bg-gray-100'
                    >
                        Close
                    </button>

                    <button
                        onClick={() =>
                            window.open(
                                `https://leetcode.com/problems/${question.titleSlug}`,
                                '_blank',
                            )
                        }
                        className='rounded-xl border px-5 py-2 transition hover:bg-gray-100'
                    >
                        Open on LeetCode
                    </button>
                </div>
            </div>
        </div>
    );
}
