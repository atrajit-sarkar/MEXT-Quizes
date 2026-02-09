const practicePlans = {
    'vocab-1': {
        title: 'Vocabulary Sprint 1',
        subtitle: 'Section I practice · Nuance focus',
        description: 'Sharpen your ability to choose the best word for subtle context clues.',
        duration: 15,
        type: 'standard',
        section: {
            title: 'Section I: Vocabulary in Context',
            description: 'Choose the word that best completes each sentence.',
            sources: [
                { quiz: 'quiz-1', section: 1 },
                { quiz: 'quiz-2', section: 1 }
            ],
            take: 20
        }
    },
    'vocab-2': {
        title: 'Vocabulary Sprint 2',
        subtitle: 'Section I practice · Academic usage',
        description: 'Practice academic vocabulary and precise word choice under time pressure.',
        duration: 18,
        type: 'standard',
        section: {
            title: 'Section I: Vocabulary in Context',
            description: 'Select the word that best completes each sentence.',
            sources: [
                { quiz: 'quiz-3', section: 1 },
                { quiz: 'quiz-4', section: 1 },
                { quiz: 'quiz-5', section: 1 }
            ],
            take: 25
        }
    },
    'vocab-3': {
        title: 'Vocabulary Sprint 3',
        subtitle: 'Section I practice · Synonym traps',
        description: 'Train your eye for synonym traps and near-meaning distractors.',
        duration: 20,
        type: 'standard',
        section: {
            title: 'Section I: Vocabulary in Context',
            description: 'Choose the best word for each sentence.',
            sources: [
                { quiz: 'quiz-6', section: 1 },
                { quiz: 'quiz-7', section: 1 },
                { quiz: 'quiz-8', section: 1 }
            ],
            take: 30
        }
    },
    'grammar-1': {
        title: 'Grammar Focus 1',
        subtitle: 'Section II practice · Conditionals',
        description: 'Practice conditionals, tense control, and structure choices.',
        duration: 15,
        type: 'standard',
        section: {
            title: 'Section II: Grammar & Phrasing',
            description: 'Choose the option that best completes each sentence.',
            sources: [
                { quiz: 'quiz-1', section: 2 },
                { quiz: 'quiz-2', section: 2 }
            ],
            take: 20
        }
    },
    'grammar-2': {
        title: 'Grammar Focus 2',
        subtitle: 'Section II practice · Inversion & emphasis',
        description: 'Build speed with inversion, emphasis, and advanced sentence patterns.',
        duration: 18,
        type: 'standard',
        section: {
            title: 'Section II: Grammar & Phrasing',
            description: 'Select the correct grammatical structure.',
            sources: [
                { quiz: 'quiz-3', section: 2 },
                { quiz: 'quiz-4', section: 2 },
                { quiz: 'quiz-5', section: 2 }
            ],
            take: 25
        }
    },
    'grammar-3': {
        title: 'Grammar Focus 3',
        subtitle: 'Section II practice · Prepositions',
        description: 'Refine your control of prepositions, collocations, and phrasing.',
        duration: 20,
        type: 'standard',
        section: {
            title: 'Section II: Grammar & Phrasing',
            description: 'Choose the best grammatical option.',
            sources: [
                { quiz: 'quiz-6', section: 2 },
                { quiz: 'quiz-7', section: 2 },
                { quiz: 'quiz-8', section: 2 }
            ],
            take: 30
        }
    },
    'error-1': {
        title: 'Error Hunt 1',
        subtitle: 'Section III practice · Subject-verb agreement',
        description: 'Spot subtle agreement and structure errors in complex sentences.',
        duration: 15,
        type: 'standard',
        section: {
            title: 'Section III: Error Identification',
            description: 'Identify the underlined part (A, B, C, or D) that contains a grammatical error.',
            sources: [
                { quiz: 'quiz-1', section: 3 },
                { quiz: 'quiz-2', section: 3 }
            ],
            take: 15
        }
    },
    'error-2': {
        title: 'Error Hunt 2',
        subtitle: 'Section III practice · Tense consistency',
        description: 'Find errors in tense, agreement, and modifier placement.',
        duration: 18,
        type: 'standard',
        section: {
            title: 'Section III: Error Identification',
            description: 'Identify the underlined part (A, B, C, or D) that contains a grammatical error.',
            sources: [
                { quiz: 'quiz-3', section: 3 },
                { quiz: 'quiz-4', section: 3 }
            ],
            take: 20
        }
    },
    'error-3': {
        title: 'Error Hunt 3',
        subtitle: 'Section III practice · Articles & modifiers',
        description: 'Practice spotting article, modifier, and agreement errors quickly.',
        duration: 18,
        type: 'standard',
        section: {
            title: 'Section III: Error Identification',
            description: 'Identify the underlined part (A, B, C, or D) that contains a grammatical error.',
            sources: [
                { quiz: 'quiz-5', section: 3 },
                { quiz: 'quiz-6', section: 3 }
            ],
            take: 20
        }
    },
    'cloze-1': {
        title: 'Cloze Builder 1',
        subtitle: 'Section IV practice · Cohesion & flow',
        description: 'Fill in the blanks while keeping meaning and cohesion intact.',
        duration: 18,
        type: 'cloze',
        section: {
            title: 'Section IV: Cloze Test',
            description: 'Read the passage and choose the best word or phrase for each blank.',
            source: { quiz: 'quiz-7', section: 4 }
        }
    },
    'cloze-2': {
        title: 'Cloze Builder 2',
        subtitle: 'Section IV practice · Connectors & tense',
        description: 'Practice logical connectors, tense control, and narrative coherence.',
        duration: 18,
        type: 'cloze',
        section: {
            title: 'Section IV: Cloze Test',
            description: 'Choose the best word or phrase for each blank.',
            source: { quiz: 'quiz-8', section: 4 }
        }
    },
    'cloze-3': {
        title: 'Cloze Builder 3',
        subtitle: 'Section IV practice · Narrative flow',
        description: 'Strengthen your ability to track narratives through subtle clues.',
        duration: 20,
        type: 'cloze',
        section: {
            title: 'Section IV: Cloze Test',
            description: 'Complete the passage by selecting the best options.',
            source: { quiz: 'quiz-9', section: 4 }
        }
    },
    'reading-1': {
        title: 'Reading Drill 1',
        subtitle: 'Section V practice · Inference focus',
        description: 'Answer inference-driven questions with one full passage.',
        duration: 18,
        type: 'reading',
        section: {
            title: 'Section V: Reading Comprehension',
            description: 'Read the passage carefully and answer the questions that follow.',
            source: { quiz: 'quiz-7', section: 5, passageIndex: 0 }
        }
    },
    'reading-2': {
        title: 'Reading Drill 2',
        subtitle: 'Section V practice · Detail checks',
        description: 'Practice detail recognition and close reading skills.',
        duration: 18,
        type: 'reading',
        section: {
            title: 'Section V: Reading Comprehension',
            description: 'Read the passage carefully and answer the questions that follow.',
            source: { quiz: 'quiz-8', section: 5, passageIndex: 1 }
        }
    },
    'reading-3': {
        title: 'Reading Drill 3',
        subtitle: 'Section V practice · Main idea & tone',
        description: 'Focus on main idea, tone, and author intent questions.',
        duration: 18,
        type: 'reading',
        section: {
            title: 'Section V: Reading Comprehension',
            description: 'Read the passage carefully and answer the questions that follow.',
            source: { quiz: 'quiz-9', section: 5, passageIndex: 0 }
        }
    }
};

window.practicePlans = practicePlans;
