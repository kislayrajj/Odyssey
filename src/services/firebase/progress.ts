import { doc, getDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface CategoryProgress {
  completed: string[];
}

export async function getCategoryProgress(userId: string, categoryId: string): Promise<CategoryProgress> {
  const docRef = doc(db, 'user_progress', userId, 'categories', categoryId);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) return snapshot.data() as CategoryProgress;
  return { completed: [] };
}

export async function toggleItemCompletion(userId: string, categoryId: string, itemId: string, isCompleted: boolean): Promise<void> {
  const docRef = doc(db, 'user_progress', userId, 'categories', categoryId);
  await setDoc(
    docRef,
    {
      completed: isCompleted ? arrayUnion(itemId) : arrayRemove(itemId),
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );
}