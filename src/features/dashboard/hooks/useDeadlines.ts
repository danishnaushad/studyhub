import { useState, useEffect } from 'react';
import { db } from '../../../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../../hooks/useAuth';
import type { Deadline } from '../services/deadline.service';

export function useDeadlines() {
  const { user } = useAuth();
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setDeadlines([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'deadlines'), where('userId', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Deadline[] = [];
      snapshot.forEach((doc) => {
        data.push(doc.data() as Deadline);
      });
      // Sort by nearest targetDate first
      data.sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());
      setDeadlines(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { deadlines, loading };
}
