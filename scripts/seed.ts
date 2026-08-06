import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// You will need to download a service account key from Firebase Console
// Project Settings -> Service Accounts -> Generate New Private Key
// Save it as 'serviceAccountKey.json' in the root (DO NOT COMMIT THIS FILE)
const SERVICE_ACCOUNT_PATH = path.resolve(__dirname, '../serviceAccountKey.json');

if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error('❌ Missing serviceAccountKey.json');
  console.error('Please download it from Firebase Console -> Project Settings -> Service Accounts');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function importSeed(filename: string, title: string) {
  console.log(`\n📦 Importing ${filename}...`);
  const filePath = path.resolve(__dirname, `../data/${filename}`);

  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ File ${filename} not found. Skipping.`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const categoryId = data.category;

  let batch = db.batch();
  let operationCount = 0;

  // 1. Write Category Metadata
  const categoryRef = db.collection('categories').doc(categoryId);
  batch.set(
    categoryRef,
    {
      id: categoryId,
      title: title,
      note: data.note || null,
      companyDataAsOf: data.companyDataAsOf || null,
      companyDataSource: data.companyDataSource || null,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
  operationCount++;

  // 2. Write Topics
  for (const topic of data.topics) {
    const topicRef = db.collection('topics').doc(`${categoryId}_${topic.id}`);
    batch.set(
      topicRef,
      {
        ...topic,
        categoryId,
      },
      { merge: true }
    );
    operationCount++;
  }

  // 3. Write Items
  for (const item of data.items) {
    const itemRef = db.collection('items').doc(`${categoryId}_${item.id}`);
    batch.set(
      itemRef,
      {
        ...item,
        categoryId,
      },
      { merge: true }
    );
    operationCount++;

    // Firestore batches have a limit of 500 operations.
    if (operationCount >= 450) {
      await batch.commit();
      console.log(`Committed batch of ${operationCount} operations...`);

      batch = db.batch(); // Create a new batch

      operationCount = 0;
    }
  }

  if (operationCount > 0) {
    await batch.commit();
    console.log(`   Committed final batch of ${operationCount} operations.`);
  }

  console.log(`✅ Successfully imported ${title} (${categoryId})`);
}

async function run() {
  try {
    await importSeed('dsa-seed.json', 'Data Structures & Algorithms');
    await importSeed('db-seed.json', 'Database & SQL');
    console.log('\n🎉 All seeds imported successfully!');
  } catch (error) {
    console.error('❌ Error importing seeds:', error);
  }
}

run();
