import { db } from '../../../config/firebase';
import { collection, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import type { Note } from '../../../types';

export const notesService = {
  createNote: async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const noteRef = doc(collection(db, 'notes'));
    const newNote: Note = {
      ...note,
      id: noteRef.id,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    await setDoc(noteRef, newNote);
    return noteRef.id;
  },

  updateNote: async (id: string, updates: Partial<Omit<Note, 'id' | 'userId' | 'categoryId' | 'createdAt'>>) => {
    const noteRef = doc(db, 'notes', id);
    await updateDoc(noteRef, {
      ...updates,
      updatedAt: Date.now()
    });
  },

  deleteNote: async (id: string) => {
    const noteRef = doc(db, 'notes', id);
    await deleteDoc(noteRef);
  }
};
