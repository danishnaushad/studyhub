import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import type { StudySession } from '../../../types';
import { useAuth } from '../../../hooks/useAuth';

export function useStudySessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSessions([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'study_sessions'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: StudySession[] = [];
      snapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() } as StudySession);
      });
      // Sort by completedAt descending
      docs.sort((a, b) => b.completedAt - a.completedAt);
      setSessions(docs);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error('Error fetching study sessions:', err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return { sessions, loading, error };
}
