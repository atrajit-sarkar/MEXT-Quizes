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
    getSessionUser: function() {
        const userStr = sessionStorage.getItem('mextUser');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Save user to session
    saveSessionUser: function(user) {
        sessionStorage.setItem('mextUser', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        }));
    },

    // Get current quiz ID
    getCurrentQuizId: function() {
        return sessionStorage.getItem('currentQuizId') || 'quiz-1';
    },

    // Set current quiz ID
    setCurrentQuizId: function(quizId) {
        sessionStorage.setItem('currentQuizId', quizId);
    },

    // Save quiz results to Firestore
    saveQuizResults: async function(userId, quizId, score, sectionData, timeSpent) {
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

    // Create or update user document
    createUserDocument: async function(user) {
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
    loadUserData: async function(userId) {
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
    startQuiz: async function(userId, quizId) {
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
    }
};

console.log('Firebase initialized successfully!');
