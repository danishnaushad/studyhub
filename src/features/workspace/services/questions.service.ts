import { db } from '../../../config/firebase';
import { collection, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import type { Question } from '../../../types';

export const questionsService = {
  createQuestion: async (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const questionRef = doc(collection(db, 'questions'));
    const newQuestion: Question = {
      ...question,
      id: questionRef.id,
      status: question.status || 'learning',
      reviewCount: question.reviewCount || 0,
      masteryScore: question.masteryScore || 0,
      lastReviewed: question.lastReviewed || null,
      nextReview: question.nextReview || Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    await setDoc(questionRef, newQuestion);
    return questionRef.id;
  },

  updateQuestion: async (id: string, updates: Partial<Omit<Question, 'id' | 'userId' | 'categoryId' | 'createdAt'>>) => {
    const questionRef = doc(db, 'questions', id);
    
    // Determine mastery changes for sprint tracking
    if (updates.status !== undefined) {
      const { getDoc } = await import('firebase/firestore');
      const oldDoc = await getDoc(questionRef);
      if (oldDoc.exists()) {
        const oldData = oldDoc.data() as Question;
        if (updates.status !== oldData.status) {
          const { sprintsService } = await import('../../sprints/services/sprints.service');
          if (updates.status === 'mastered') {
            await sprintsService.incrementProgress(oldData.categoryId, 'cards', 1);
          } else if (oldData.status === 'mastered') {
            await sprintsService.incrementProgress(oldData.categoryId, 'cards', -1);
          }
        }
      }
    }

    const finalUpdates: any = {
      ...updates,
      updatedAt: Date.now()
    };

    await updateDoc(questionRef, finalUpdates);
  },

  deleteQuestion: async (id: string) => {
    const questionRef = doc(db, 'questions', id);
    await deleteDoc(questionRef);
  }
};
