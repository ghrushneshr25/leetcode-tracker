import Editor, { type OnChange } from '@monaco-editor/react';
import { FileCode2, Plus } from 'lucide-react';

import type { GithubSolution } from './types';

interface Props {
    language: string;

    solutions: GithubSolution[];

    selected: string;

    solutionName: string;

    code: string;

    onSelect(name: string): void;

    onNew(): void;

    onNameChange(name: string): void;

    onCodeChange(code: string): void;
}

export default function GithubWorkspace({
    language,
    solutions,
    selected,
    solutionName,
    code,
    onSelect,
    onNew,
    onNameChange,
    onCodeChange,
}: Props) {
    const monacoLanguage = (() => {
        switch (language) {
            case 'cpp':
                return 'cpp';

            case 'go':
                return 'go';

            case 'java':
                return 'java';

            case 'python':
                return 'python';

            case 'javascript':
                return 'javascript';

            case 'typescript':
                return 'typescript';

            default:
                return 'plaintext';
        }
    })();

    const handleCodeChange: OnChange = (value) => {
        onCodeChange(value ?? '');
    };

    return (
        <div className='grid h-[70vh] grid-cols-[18rem_minmax(0,1fr)] overflow-hidden rounded-xl border'>
            {/* Sidebar */}

            <aside className='grid h-full grid-rows-[56px_1fr_56px] border-r bg-gray-50'>
                <div className='flex items-center justify-between border-b px-4'>
                    <h3 className='text-sm font-semibold uppercase tracking-wide text-gray-500'>
                        Solutions
                    </h3>

                    <button onClick={onNew} className='rounded-md p-1 transition hover:bg-gray-200'>
                        <Plus size={18} />
                    </button>
                </div>

                <div className='overflow-y-auto p-2'>
                    {solutions.length === 0 ? (
                        <div className='py-8 text-center text-sm text-gray-400'>
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
                                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
                                            active
                                                ? 'border-l-2 border-black bg-white font-medium shadow-sm'
                                                : 'border-l-2 border-transparent hover:bg-gray-100'
                                        }`}
                                    >
                                        <FileCode2 size={16} className='text-gray-400' />

                                        <span className='truncate'>{solution.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className='border-t p-2'>
                    <button
                        onClick={onNew}
                        className='flex w-full items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-left text-sm text-blue-600 transition hover:bg-white'
                    >
                        <Plus size={16} />
                        New Solution
                    </button>
                </div>
            </aside>

            {/* Editor */}

            <div className='grid h-full grid-rows-[56px_minmax(0,1fr)]'>
                <div className='flex items-center justify-between border-b px-5'>
                    <input
                        value={solutionName}
                        onChange={(e) => onNameChange(e.target.value)}
                        placeholder='Solution Name'
                        className='w-full border-none bg-transparent text-lg font-semibold outline-none'
                    />

                    <span className='ml-4 rounded bg-gray-100 px-2 py-1 text-sm text-gray-500'>
                        .{language}
                    </span>
                </div>

                <div className='overflow-hidden p-3'>
                    <Editor
                        height='100%'
                        language={monacoLanguage}
                        theme='plain'
                        value={code}
                        onChange={handleCodeChange}
                        options={{
                            automaticLayout: true,

                            minimap: {
                                enabled: false,
                            },

                            scrollBeyondLastLine: false,

                            fontSize: 13,

                            lineHeight: 20,

                            bracketPairColorization: {
                                enabled: false,
                            },

                            guides: {
                                bracketPairs: false,
                            },

                            padding: {
                                top: 12,
                                bottom: 12,
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
