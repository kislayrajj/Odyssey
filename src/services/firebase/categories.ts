import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Category } from '@/types/models';

export async function getCategories(): Promise<Category[]> {
  const q = query(collection(db, 'categories'), orderBy('title'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => doc.data() as Category);
}