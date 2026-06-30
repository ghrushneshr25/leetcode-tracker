import { GitBranch, LoaderCircle } from 'lucide-react';

interface Props {
    language: string;
    modified: boolean;
    pushing: boolean;

    onLanguageChange(language: string): void;
    onPush(): void;
}

const LANGUAGES = ['go', 'java', 'python', 'cpp', 'javascript', 'typescript'];

export default function GithubToolbar({
    language,
    modified,
    pushing,
    onLanguageChange,
    onPush,
}: Props) {
    return (
        <div className='mb-4 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
                <select
                    value={language}
                    onChange={(e) => onLanguageChange(e.target.value)}
                    className='rounded-lg border bg-white px-3 py-2 text-sm'
                >
                    {LANGUAGES.map((language) => (
                        <option key={language} value={language}>
                            {displayLanguage(language)}
                        </option>
                    ))}
                </select>

            </div>

            <button
                onClick={onPush}
                disabled={pushing}
                className='flex items-center gap-2 rounded-lg bg-black px-5 py-2 text-white transition hover:bg-gray-800 disabled:opacity-50'
            >
                {pushing ? (
                    <>
                        <LoaderCircle size={16} className='animate-spin' />
                        Pushing...
                    </>
                ) : (
                    <>
                        <GitBranch size={16} />
                        Push
                    </>
                )}
            </button>
        </div>
    );
}

function displayLanguage(language: string) {
    switch (language) {
        case 'go':
            return 'Go';

        case 'java':
            return 'Java';

        case 'cpp':
            return 'C++';

        case 'python':
            return 'Python';

        case 'javascript':
            return 'JavaScript';

        case 'typescript':
            return 'TypeScript';

        default:
            return language;
    }
}
