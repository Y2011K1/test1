
import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

console.log('--- Sanity Connectivity Test ---');
console.log('Project ID:', projectId);
console.log('Dataset:', dataset);
console.log('Token Present:', !!token);

if (!projectId || !dataset || !token) {
  console.error('CRITICAL: Missing Sanity environment variables.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-03-11',
  useCdn: false,
  token,
});

async function runTest() {
  try {
    console.log('\nSTEP 1: Testing Connection (fetching categories)...');
    const categories = await client.fetch('*[_type == "category"] { _id, title }');
    console.log(`Success! Found ${categories.length} categories.`);
    if (categories.length > 0) {
      console.log('First category:', categories[0].title);
    }

    console.log('\nSTEP 2: Testing Document Creation...');
    const testId = `test-doc-${Date.now()}`;
    const doc = await client.create({
      _id: testId,
      _type: 'category',
      title: 'TEST_DELETE_ME',
    });
    console.log('Success! Created document:', doc._id);

    console.log('\nSTEP 3: Testing Document Deletion...');
    await client.delete(testId);
    console.log('Success! Deleted document:', testId);

    console.log('\n--- ALL TESTS PASSED ---');
    process.exit(0);
  } catch (error) {
    console.error('\n!!! TEST FAILED !!!');
    console.error('Error Message:', error.message);
    if (error.response) {
      console.error('Status Code:', error.response.statusCode);
      console.error('Body:', JSON.stringify(error.response.body, null, 2));
    }
    process.exit(1);
  }
}

runTest();
