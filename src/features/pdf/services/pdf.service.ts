import { db, storage } from '../../../config/firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { pdfjs } from 'react-pdf';
import type { PdfDocument } from '../../../types';

export const pdfService = {
  uploadPdf: async (file: File, userId: string, categoryId: string): Promise<PdfDocument> => {
    // 1. Extract Page Count
    let pageCount = 0;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;
      pageCount = pdf.numPages;
    } catch (error) {
      console.warn("Failed to extract page count locally:", error);
    }

    // 2. Upload to Firebase Storage with a UUID
    const uuid = crypto.randomUUID();
    const storageRef = ref(storage, `pdfs/${userId}/${uuid}.pdf`);
    const snapshot = await uploadBytes(storageRef, file);
    const fileUrl = await getDownloadURL(snapshot.ref);

    // 3. Save to Firestore
    const newPdf: PdfDocument = {
      id: uuid,
      userId,
      categoryId,
      title: file.name,
      fileUrl,
      fileSize: file.size,
      pageCount,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await setDoc(doc(db, 'pdfs', uuid), newPdf);
    return newPdf;
  },

  deletePdf: async (pdfId: string, userId: string): Promise<void> => {
    // 1. Delete from Storage
    const storageRef = ref(storage, `pdfs/${userId}/${pdfId}.pdf`);
    try {
      await deleteObject(storageRef);
    } catch (error) {
      console.warn("Could not delete from storage, it might have been removed already:", error);
    }

    // 2. Delete from Firestore
    await deleteDoc(doc(db, 'pdfs', pdfId));
  }
};
