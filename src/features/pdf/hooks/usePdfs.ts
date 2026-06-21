import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import type { PdfDocument } from '../../../types';
import { useAuth } from '../../../hooks/useAuth';

export function usePdfs() {
  const { user } = useAuth();
  const [pdfs, setPdfs] = useState<PdfDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setPdfs([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'pdfs'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: PdfDocument[] = [];
      snapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() } as PdfDocument);
      });
      // Sort by createdAt descending initially
      docs.sort((a, b) => b.createdAt - a.createdAt);
      setPdfs(docs);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error('Error fetching pdfs:', err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return { pdfs, loading, error };
}
