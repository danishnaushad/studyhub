import { db, storage } from '../../../config/firebase';
import { collection, doc, setDoc, deleteDoc, updateDoc, getDoc, increment } from 'firebase/firestore';
import { ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import type { UploadTask } from 'firebase/storage';
import type { Resource } from '../../../types';

export const resourcesService = {
  createResource: async (resource: Omit<Resource, 'createdAt'> & { id?: string }): Promise<string> => {
    const resourceRef = resource.id ? doc(db, 'resources', resource.id) : doc(collection(db, 'resources'));
    const newResource: Resource = {
      ...resource,
      id: resourceRef.id,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    await setDoc(resourceRef, newResource);
    return resourceRef.id;
  },

  uploadResourceFileResumable: (file: File, userId: string, resourceId: string): { uploadTask: UploadTask; storagePath: string } => {
    const storagePath = `users/${userId}/resources/${resourceId}.pdf`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file, { contentType: 'application/pdf' });
    return { uploadTask, storagePath };
  },

  commitResourceStorageUsage: async (userId: string, fileSize: number) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      storageUsed: increment(fileSize)
    });
  },

  updateResource: async (id: string, updates: Partial<Omit<Resource, 'id' | 'userId' | 'categoryId' | 'createdAt'>>) => {
    const resourceRef = doc(db, 'resources', id);
    await updateDoc(resourceRef, {
      ...updates,
      updatedAt: Date.now()
    });
  },

  deleteResource: async (id: string) => {
    const resourceRef = doc(db, 'resources', id);
    const docSnap = await getDoc(resourceRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as Resource;
      
      // If it has a storagePath, delete it from Firebase Storage
      if (data.storagePath) {
        try {
          const storageRef = ref(storage, data.storagePath);
          await deleteObject(storageRef);
          
          // Decrease user storage
          if (data.fileSize) {
            const userRef = doc(db, 'users', data.userId);
            await updateDoc(userRef, {
              storageUsed: increment(-data.fileSize)
            });
          }
        } catch (error) {
          console.error("Failed to delete resource file from storage:", error);
          // We may still want to delete the document even if storage fails, or we could throw.
        }
      }
    }
    
    await deleteDoc(resourceRef);
  },
  
  trackResourceOpen: async (id: string) => {
    const resourceRef = doc(db, 'resources', id);
    await updateDoc(resourceRef, {
      openCount: increment(1),
      lastOpenedAt: Date.now()
    });
  },

  updateReadingTime: async (id: string, timeSpentInSeconds: number) => {
    const resourceRef = doc(db, 'resources', id);
    await updateDoc(resourceRef, {
      readingTime: increment(timeSpentInSeconds),
      updatedAt: Date.now()
    });
  }
};
