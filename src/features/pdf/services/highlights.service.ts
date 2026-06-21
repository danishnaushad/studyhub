import { db } from '../../../config/firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import type { PdfHighlight } from '../../../types';

export const highlightsService = {
  createHighlight: async (highlight: Omit<PdfHighlight, 'id' | 'createdAt' | 'updatedAt'>): Promise<PdfHighlight> => {
    const uuid = crypto.randomUUID();
    const newHighlight: PdfHighlight = {
      ...highlight,
      id: uuid,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await setDoc(doc(db, 'pdf_highlights', uuid), newHighlight);
    return newHighlight;
  },

  deleteHighlight: async (highlightId: string): Promise<void> => {
    await deleteDoc(doc(db, 'pdf_highlights', highlightId));
  }
};
