import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserItemData } from '@/types/models';

export async function getUserItemData(userId: string, itemId: string): Promise<UserItemData | null> {
  const docRef = doc(db, 'user_progress', userId, 'items', itemId);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? (snapshot.data() as UserItemData) : null;
}

export async function updateUserItemData(userId: string, itemId: string, data: Partial<UserItemData>): Promise<void> {
  const docRef = doc(db, 'user_progress', userId, 'items', itemId);
  await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
}