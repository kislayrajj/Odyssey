import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserNote } from '@/types/models';

export async function getCategoryNotes(userId: string, categoryId: string): Promise<UserNote[]> {
  const notesRef = collection(db, 'user_progress', userId, 'categories', categoryId, 'notes');
  const snapshot = await getDocs(notesRef);
  return snapshot.docs.map(doc => ({ itemId: doc.id, ...doc.data() } as UserNote));
}

export async function updateNote(userId: string, categoryId: string, itemId: string, content: string): Promise<void> {
  const docRef = doc(db, 'user_progress', userId, 'categories', categoryId, 'notes', itemId);
  
  if (!content.trim()) {
    await deleteDoc(docRef);
    return;
  }

  await setDoc(docRef, { content, updatedAt: new Date().toISOString() }, { merge: true });
}