import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import type { PdfHighlight } from '../../../types';
import { useAuth } from '../../../hooks/useAuth';

export function usePdfHighlights(pdfId?: string) {
  const { user } = useAuth();
  const [highlights, setHighlights] = useState<PdfHighlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setHighlights([]);
      setLoading(false);
      return;
    }

    let q = query(
      collection(db, 'pdf_highlights'),
      where('userId', '==', user.uid)
    );

    if (pdfId) {
      q = query(
        collection(db, 'pdf_highlights'),
        where('userId', '==', user.uid),
        where('pdfId', '==', pdfId)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: PdfHighlight[] = [];
      snapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() } as PdfHighlight);
      });
      // Sort by createdAt descending initially
      docs.sort((a, b) => b.createdAt - a.createdAt);
      setHighlights(docs);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error('Error fetching pdf highlights:', err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid, pdfId]);

  return { highlights, loading, error };
}
