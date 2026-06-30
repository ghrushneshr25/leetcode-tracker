import { FileCode2, Plus } from 'lucide-react';

import type { GithubSolution } from './types';

interface Props {
    solutions: GithubSolution[];

    selected: string;

    onSelect(name: string): void;

    onNew(): void;
}

export default function GithubSidebar({ solutions, selected, onSelect, onNew }: Props) {
    return (
        <aside className='flex h-full w-64 flex-col border-r bg-gray-50'>
            <div className='flex items-center justify-between border-b px-4 py-3'>
                <h3 className='text-sm font-semibold uppercase tracking-wide text-gray-500'>
                    Solutions
                </h3>

                <button
                    onClick={onNew}
                    className='rounded-md p-1 transition hover:bg-gray-200'
                    title='New Solution'
                >
                    <Plus size={18} />
                </button>
            </div>

            <div className='flex-1 overflow-y-auto p-2'>
                {solutions.length === 0 ? (
                    <div className='px-3 py-6 text-center text-sm text-gray-400'>
                        No solutions yet
                    </div>
                ) : (
                    <div className='space-y-1'>
                        {solutions.map((solution) => {
                            const active = solution.name === selected;

                            return (
                                <button
                                    key={solution.name}
                                    onClick={() => onSelect(solution.name)}
                                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition
${active ? 'bg-white font-medium shadow-sm' : 'hover:bg-gray-100'}`}
                                >
                                    <FileCode2 size={16} className='text-gray-400' />

                                    <span className='truncate'>{solution.name}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

        </aside>
    );
}
