import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import type { Resource } from '../../../types';
import { useAuth } from '../../../hooks/useAuth';
import { useDemo } from '../../../contexts/DemoContext';

const DEMO_RESOURCES: Resource[] = [
  { id: 'res-1', categoryId: 'demo-cat-1', userId: 'demo-user', title: 'Network Security Fundamentals PDF', url: 'https://example.com/sec.pdf', type: 'pdf', createdAt: Date.now() - 100000 },
  { id: 'res-2', categoryId: 'demo-cat-1', userId: 'demo-user', title: 'Intro to Ethical Hacking', url: 'https://example.com/hack', type: 'website', createdAt: Date.now() - 200000 },
  { id: 'res-3', categoryId: 'demo-cat-2', userId: 'demo-user', title: 'Python Docs', url: 'https://docs.python.org', type: 'website', createdAt: Date.now() - 300000 }
];

export function useResources(categoryId: string) {
  const { user } = useAuth();
  const { isDemo } = useDemo();
  const [resources, setResources] = useState<Resource[]>(isDemo ? DEMO_RESOURCES.filter(r => r.categoryId === categoryId) : []);
  const [loading, setLoading] = useState(!isDemo);

  useEffect(() => {
    if (isDemo) return;
    if (!user || !categoryId) {
      setResources([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'resources'),
      where('userId', '==', user.uid),
      where('categoryId', '==', categoryId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: Resource[] = [];
      snapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() } as Resource);
      });
      docs.sort((a, b) => b.createdAt - a.createdAt);
      setResources(docs);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching resources:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, categoryId]);

  return { resources, loading };
}
