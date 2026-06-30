import { useEffect, useMemo, useState } from 'react';

import './MonacoTheme';

import GithubToolbar from './GithubToolbar';
import GithubWorkspace from './GithubWorkspace';

import type { GithubSolution } from './types';

import { useGithubSolutions } from '../../../hooks/useGithubSolutions';
import { usePushGithub } from '../../../hooks/usePushGithub';

interface Props {
    questionId: number;
}

export default function QuestionGithub({ questionId }: Props) {
    const { data } = useGithubSolutions(questionId);

    const pushMutation = usePushGithub(questionId);

    const [language, setLanguage] = useState('go');

    const [solutionName, setSolutionName] = useState('');

    const [code, setCode] = useState('');

    const [modified, setModified] = useState(false);

    const languages = useMemo(() => Object.keys(data?.solutions ?? {}), [data]);

    const solutions: GithubSolution[] = useMemo(
        () => data?.solutions?.[language] ?? [],
        [data, language],
    );

    useEffect(() => {
        if (!languages.length) {
            return;
        }

        if (!languages.includes(language)) {
            setLanguage(languages[0]);
        }
    }, [languages]);

    useEffect(() => {
        if (!solutions.length) {
            setSolutionName('');
            setCode('');
            setModified(false);
            return;
        }

        const existing = solutions.find((solution) => solution.name === solutionName);

        if (existing) {
            setCode(existing.code);
            setModified(false);
            return;
        }

        setSolutionName(solutions[0].name);

        setCode(solutions[0].code);

        setModified(false);
    }, [solutions]);

    const handleSelectSolution = (name: string) => {
        const solution = solutions.find((solution) => solution.name === name);

        if (!solution) {
            return;
        }

        setSolutionName(solution.name);

        setCode(solution.code);

        setModified(false);
    };

    const handleNewSolution = () => {
        setSolutionName('');

        setCode('');

        setModified(false);
    };

    const handleCodeChange = (value: string) => {
        setCode(value);

        setModified(true);
    };

    const handleNameChange = (value: string) => {
        setSolutionName(value);

        setModified(true);
    };

    const push = () => {
        if (!solutionName.trim() || !code.trim()) {
            return;
        }

        pushMutation.mutate(
            {
                language,
                name: solutionName,
                code,
            },
            {
                onSuccess: () => {
                    setModified(false);
                },
            },
        );
    };

    return (
        <div className='flex h-[70vh] flex-col'>
            <GithubToolbar
                language={language}
                modified={modified}
                pushing={pushMutation.isPending}
                onLanguageChange={setLanguage}
                onPush={push}
            />

            <GithubWorkspace
                language={language}
                solutions={solutions}
                selected={solutionName}
                solutionName={solutionName}
                code={code}
                onSelect={handleSelectSolution}
                onNew={handleNewSolution}
                onNameChange={handleNameChange}
                onCodeChange={handleCodeChange}
            />
        </div>
    );
}
