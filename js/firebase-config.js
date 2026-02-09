// Firebase Configuration - Shared across all pages
const firebaseConfig = {
    apiKey: "AIzaSyD0RiHFmtX8CnmxpOOxfGFgWdOxod8v5Qo",
    authDomain: "my-chat-app-1b7f5.firebaseapp.com",
    databaseURL: "https://my-chat-app-1b7f5-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "my-chat-app-1b7f5",
    storageBucket: "my-chat-app-1b7f5.firebasestorage.app",
    messagingSenderId: "844297048940",
    appId: "1:844297048940:web:0ac450de53a67ade505949",
    measurementId: "G-CQ890LPSFR"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase Services
const auth = firebase.auth();
const db = firebase.firestore();
const analytics = firebase.analytics();

// Helper Functions
const FirebaseHelper = {
    // Get current user from session
    getSessionUser: function () {
        const userStr = sessionStorage.getItem('mextUser');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Save user to session
    saveSessionUser: function (user) {
        sessionStorage.setItem('mextUser', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        }));
    },

    // Get current quiz ID
    getCurrentQuizId: function () {
        return sessionStorage.getItem('currentQuizId') || 'quiz-1';
    },

    // Set current quiz ID
    setCurrentQuizId: function (quizId) {
        sessionStorage.setItem('currentQuizId', quizId);
    },

    // Save quiz results to Firestore
    saveQuizResults: async function (userId, quizId, score, sectionData, timeSpent) {
        try {
            const userRef = db.collection('users').doc(userId);
            const userDoc = await userRef.get();
            const userData = userDoc.exists ? userDoc.data() : {};

            // Get current best score for this quiz
            const currentBest = userData.quizAttempts?.[quizId]?.bestScore || 0;
            const newBest = Math.max(currentBest, score);

            // Prepare section score updates
            const sectionUpdates = {};
            for (const [key, data] of Object.entries(sectionData)) {
                const currentTotal = userData.stats?.sectionScores?.[key]?.total || 0;
                const currentCorrect = userData.stats?.sectionScores?.[key]?.correct || 0;
                sectionUpdates[`stats.sectionScores.${key}.total`] = currentTotal + data.total;
                sectionUpdates[`stats.sectionScores.${key}.correct`] = currentCorrect + data.correct;
            }

            // Update user document
            await userRef.set({
                [`quizAttempts`]: {
                    [quizId]: {
                        completed: true,
                        score: score,
                        bestScore: newBest,
                        lastAttempt: firebase.firestore.FieldValue.serverTimestamp(),
                        attempts: firebase.firestore.FieldValue.increment(1)
                    }
                },
                stats: {
                    totalCompleted: firebase.firestore.FieldValue.increment(1),
                    totalTimeSpent: firebase.firestore.FieldValue.increment(timeSpent)
                }
            }, { merge: true });

            // Update section scores separately
            await userRef.update(sectionUpdates);

            console.log('Results saved to Firebase successfully!');
            return true;
        } catch (error) {
            console.error('Error saving results to Firebase:', error);
            return false;
        }
    },

    // Save practice set results to Firestore
    savePracticeResults: async function (userId, practiceId, score, totalQuestions, timeSpent) {
        try {
            const userRef = db.collection('users').doc(userId);
            const userDoc = await userRef.get();
            const existingData = userDoc.exists ? userDoc.data() : {};

            const currentBest = existingData.practiceAttempts?.[practiceId]?.bestScore || 0;
            const newBest = Math.max(currentBest, score);

            await userRef.set({
                practiceAttempts: {
                    [practiceId]: {
                        completed: true,
                        score: score,
                        totalQuestions: totalQuestions,
                        bestScore: newBest,
                        lastAttempt: firebase.firestore.FieldValue.serverTimestamp(),
                        attempts: firebase.firestore.FieldValue.increment(1),
                        timeSpent: timeSpent
                    }
                },
                stats: {
                    totalTimeSpent: firebase.firestore.FieldValue.increment(timeSpent)
                }
            }, { merge: true });

            console.log('Practice results saved to Firebase!');
            return true;
        } catch (error) {
            console.error('Error saving practice results:', error);
            return false;
        }
    },

    // Create or update user document
    createUserDocument: async function (user) {
        try {
            const userDoc = await db.collection('users').doc(user.uid).get();

            if (!userDoc.exists) {
                await db.collection('users').doc(user.uid).set({
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    quizAttempts: {},
                    stats: {
                        totalAttempts: 0,
                        totalCompleted: 0,
                        totalTimeSpent: 0,
                        sectionScores: {
                            vocabulary: { total: 0, correct: 0 },
                            grammar: { total: 0, correct: 0 },
                            errorId: { total: 0, correct: 0 },
                            cloze: { total: 0, correct: 0 },
                            reading: { total: 0, correct: 0 }
                        }
                    }
                });
            }
            return userDoc.exists ? userDoc.data() : {};
        } catch (error) {
            console.error('Error creating user document:', error);
            return {};
        }
    },

    // Load user data
    loadUserData: async function (userId) {
        try {
            const userDoc = await db.collection('users').doc(userId).get();
            if (userDoc.exists) {
                return userDoc.data();
            }
            return null;
        } catch (error) {
            console.error('Error loading user data:', error);
            return null;
        }
    },

    // Start quiz - save to Firestore
    startQuiz: async function (userId, quizId) {
        try {
            await db.collection('users').doc(userId).set({
                quizAttempts: {
                    [quizId]: {
                        started: true,
                        lastAttempt: firebase.firestore.FieldValue.serverTimestamp()
                    }
                }
            }, { merge: true });
            return true;
        } catch (error) {
            console.error('Error saving quiz start:', error);
            return false;
        }
    },

    // Save in-progress quiz state to Firestore + localStorage backup
    saveQuizState: async function (userId, quizId, state) {
        const stateData = {
            answers: state.answers || {},
            checkedAnswers: state.checkedAnswers || {},
            currentSection: state.currentSection || 1,
            timeLeft: state.timeLeft,
            isTrialMode: state.isTrialMode || false,
            savedAt: Date.now()
        };
        // Always save to localStorage first (synchronous, instant)
        try {
            localStorage.setItem(
                `quizState_${userId}_${quizId}`,
                JSON.stringify(stateData)
            );
        } catch (e) {
            console.warn('localStorage save failed:', e);
        }
        // Then save to Firestore (async)
        try {
            await db.collection('users').doc(userId)
                .collection('quizProgress').doc(quizId).set({
                    ...stateData,
                    savedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            console.log('Quiz state saved to Firebase.');
            return true;
        } catch (error) {
            console.error('Error saving quiz state:', error);
            return false;
        }
    },

    // Synchronous save to localStorage only (for beforeunload)
    saveQuizStateSync: function (userId, quizId, state) {
        try {
            localStorage.setItem(
                `quizState_${userId}_${quizId}`,
                JSON.stringify({
                    answers: state.answers || {},
                    checkedAnswers: state.checkedAnswers || {},
                    currentSection: state.currentSection || 1,
                    timeLeft: state.timeLeft,
                    isTrialMode: state.isTrialMode || false,
                    savedAt: Date.now()
                })
            );
            console.log('Quiz state saved to localStorage (sync).');
        } catch (e) {
            console.warn('localStorage sync save failed:', e);
        }
        // Also fire-and-forget Firestore write (may or may not complete)
        db.collection('users').doc(userId)
            .collection('quizProgress').doc(quizId).set({
                answers: state.answers || {},
                checkedAnswers: state.checkedAnswers || {},
                currentSection: state.currentSection || 1,
                timeLeft: state.timeLeft,
                isTrialMode: state.isTrialMode || false,
                savedAt: firebase.firestore.FieldValue.serverTimestamp()
            }).catch(() => {});
    },

    // Load in-progress quiz state (checks localStorage first, then Firestore)
    loadQuizState: async function (userId, quizId) {
        let localState = null;
        let firestoreState = null;

        // Check localStorage first (instant)
        try {
            const stored = localStorage.getItem(`quizState_${userId}_${quizId}`);
            if (stored) {
                localState = JSON.parse(stored);
            }
        } catch (e) {
            console.warn('localStorage load failed:', e);
        }

        // Also check Firestore
        try {
            const doc = await db.collection('users').doc(userId)
                .collection('quizProgress').doc(quizId).get();
            if (doc.exists) {
                firestoreState = doc.data();
            }
        } catch (error) {
            console.error('Error loading quiz state from Firestore:', error);
        }

        // Return whichever is newer, preferring the one with more answers
        if (localState && firestoreState) {
            const localAnswerCount = Object.keys(localState.answers || {}).length;
            const firestoreAnswerCount = Object.keys(firestoreState.answers || {}).length;
            // Use the one with more answers, or if equal, the newer one
            if (localAnswerCount > firestoreAnswerCount) {
                return localState;
            } else if (firestoreAnswerCount > localAnswerCount) {
                return firestoreState;
            }
            // Same answer count — use most recent by timestamp
            const localTime = localState.savedAt || 0;
            const firestoreTime = firestoreState.savedAt?.toMillis?.() || firestoreState.savedAt || 0;
            return localTime > firestoreTime ? localState : firestoreState;
        }
        return firestoreState || localState || null;
    },

    // Clear saved quiz state (after submission or retry)
    clearQuizState: async function (userId, quizId) {
        // Clear localStorage
        try {
            localStorage.removeItem(`quizState_${userId}_${quizId}`);
        } catch (e) {
            console.warn('localStorage clear failed:', e);
        }
        // Clear Firestore
        try {
            await db.collection('users').doc(userId)
                .collection('quizProgress').doc(quizId).delete();
            console.log('Saved quiz state cleared.');
            return true;
        } catch (error) {
            console.error('Error clearing quiz state:', error);
            return false;
        }
    },

    // Check if any quiz has saved progress (for dashboard)
    checkAllQuizProgress: async function (userId) {
        const progress = {};
        // Check localStorage for all quizzes
        for (let i = 1; i <= 12; i++) {
            const quizId = `quiz-${i}`;
            try {
                const stored = localStorage.getItem(`quizState_${userId}_${quizId}`);
                if (stored) {
                    const state = JSON.parse(stored);
                    if (state && Object.keys(state.answers || {}).length > 0) {
                        progress[quizId] = state;
                    }
                }
            } catch (e) {}
        }
        // Check localStorage for all practice sets
        const practiceKeys = [
            'vocab-1','vocab-2','vocab-3',
            'grammar-1','grammar-2','grammar-3',
            'error-1','error-2','error-3',
            'cloze-1','cloze-2','cloze-3',
            'reading-1','reading-2','reading-3'
        ];
        for (const key of practiceKeys) {
            const practiceId = `practice-${key}`;
            try {
                const stored = localStorage.getItem(`quizState_${userId}_${practiceId}`);
                if (stored) {
                    const state = JSON.parse(stored);
                    if (state && Object.keys(state.answers || {}).length > 0) {
                        progress[practiceId] = state;
                    }
                }
            } catch (e) {}
        }
        // Check Firestore quizProgress subcollection
        try {
            const snapshot = await db.collection('users').doc(userId)
                .collection('quizProgress').get();
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data && Object.keys(data.answers || {}).length > 0) {
                    const quizId = doc.id;
                    if (!progress[quizId]) {
                        progress[quizId] = data;
                    }
                }
            });
        } catch (error) {
            console.error('Error checking quiz progress:', error);
        }
        return progress;
    }
};

console.log('Firebase initialized successfully!');
