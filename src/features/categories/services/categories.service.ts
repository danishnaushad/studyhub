import { db } from '../../../config/firebase';
import { collection, doc, setDoc, updateDoc, writeBatch } from 'firebase/firestore';
import type { Category } from '../../../types';

export const categoriesService = {
  createCategory: async (category: Omit<Category, 'id' | 'createdAt'>): Promise<string> => {
    const categoryRef = doc(collection(db, 'categories'));
    const newCategory: Category = {
      ...category,
      id: categoryRef.id,
      createdAt: Date.now()
    };
    
    await setDoc(categoryRef, newCategory);
    return categoryRef.id;
  },

  updateCategory: async (id: string, updates: Partial<Omit<Category, 'id' | 'userId' | 'createdAt'>>) => {
    const categoryRef = doc(db, 'categories', id);
    await updateDoc(categoryRef, updates);
  },

  archiveCategory: async (id: string) => {
    const categoryRef = doc(db, 'categories', id);
    await updateDoc(categoryRef, { isArchived: true });
  },

  migrateCategoryColors: async (categories: Category[]) => {
    const colorMap: Record<string, string> = {
      '#ef4444': 'red',
      '#f97316': 'orange',
      '#f59e0b': 'yellow',
      '#84cc16': 'green',
      '#22c55e': 'green',
      '#06b6d4': 'teal',
      '#3b82f6': 'blue',
      '#6366f1': 'purple',
      '#a855f7': 'purple',
      '#ec4899': 'pink',
      '#f43f5e': 'red',
      '#64748b': 'blue',
      '#10b981': 'green',
      '#14b8a6': 'teal',
      '#8b5cf6': 'purple'
    };

    const batch = writeBatch(db);
    let migratedCount = 0;

    categories.forEach(cat => {
      if (cat.color.startsWith('#') || cat.color.startsWith('rgb')) {
        const newColor = colorMap[cat.color.toLowerCase()] || 'blue';
        const ref = doc(db, 'categories', cat.id);
        batch.update(ref, { color: newColor });
        migratedCount++;
      }
    });

    if (migratedCount > 0) {
      await batch.commit();
      console.log(`Migrated ${migratedCount} categories to semantic colors.`);
    }
  }
};
