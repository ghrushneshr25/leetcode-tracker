import Editor, { type OnChange } from '@monaco-editor/react';

interface Props {
    language: string;

    solutionName: string;

    code: string;

    onNameChange(name: string): void;

    onCodeChange(code: string): void;
}

export default function GithubEditor({
    language,
    solutionName,
    code,
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
        <div className='flex flex-1 flex-col'>
            <div className='flex items-center justify-between border-b px-5 py-3'>
                <input
                    value={solutionName}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder='Solution Name'
                    className='w-full border-none text-lg font-semibold outline-none'
                />

                <span className='rounded bg-gray-100 px-2 py-1 text-sm text-gray-500'>
                    .{language}
                </span>
            </div>

            <div className='flex-1 bg-white p-3'>
                <Editor
                    height='40vh'
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
                    }}
                />
            </div>
        </div>
    );
}
