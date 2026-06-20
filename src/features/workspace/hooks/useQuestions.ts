import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import type { Question } from '../../../types';
import { useAuth } from '../../../hooks/useAuth';
import { useDemo } from '../../../contexts/DemoContext';

const DEMO_QUESTIONS: Question[] = [
  { id: 'q-1', categoryId: 'demo-cat-1', userId: 'demo-user', question: 'What is a SQL injection?', type: 'concept_review', answer: 'A code injection technique used to attack data-driven applications.', status: 'learning', reviewCount: 0, masteryScore: 0, nextReview: Date.now(), lastReviewed: null, createdAt: Date.now() - 100000, updatedAt: Date.now() - 100000 },
  { id: 'q-2', categoryId: 'demo-cat-1', userId: 'demo-user', question: 'Define XSS', type: 'concept_review', answer: 'Cross-Site Scripting.', status: 'learning', reviewCount: 0, masteryScore: 0, nextReview: Date.now(), lastReviewed: null, createdAt: Date.now() - 200000, updatedAt: Date.now() - 200000 },
  { id: 'q-3', categoryId: 'demo-cat-2', userId: 'demo-user', question: 'Is Python statically typed?', type: 'concept_review', answer: 'No, it is dynamically typed.', status: 'mastered', reviewCount: 5, masteryScore: 100, nextReview: Date.now() + 86400000, lastReviewed: Date.now() - 10000, createdAt: Date.now() - 300000, updatedAt: Date.now() - 10000 }
];

export function useQuestions(categoryId: string) {
  const { user } = useAuth();
  const { isDemo } = useDemo();
  const [questions, setQuestions] = useState<Question[]>(isDemo ? DEMO_QUESTIONS.filter(q => q.categoryId === categoryId) : []);
  const [loading, setLoading] = useState(!isDemo);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isDemo) return;
    if (!user || !categoryId) {
      setQuestions([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'questions'),
      where('userId', '==', user.uid),
      where('categoryId', '==', categoryId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: Question[] = [];
      snapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() } as Question);
      });
      // Fallback: Client-side sorting to bypass composite index requirement
      docs.sort((a, b) => b.createdAt - a.createdAt);
      setQuestions(docs);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error('Error fetching questions:', err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid, categoryId]);

  return { questions, loading, error };
}

export function useAllQuestions() {
  const { user } = useAuth();
  const { isDemo } = useDemo();
  const [questions, setQuestions] = useState<Question[]>(isDemo ? DEMO_QUESTIONS : []);
  const [loading, setLoading] = useState(!isDemo);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isDemo) return;
    if (!user) {
      setQuestions([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'questions'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: Question[] = [];
      snapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() } as Question);
      });
      // Fallback: Client-side sorting to bypass composite index requirement
      docs.sort((a, b) => b.createdAt - a.createdAt);
      setQuestions(docs);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error('Error fetching all questions:', err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return { questions, loading, error };
}
