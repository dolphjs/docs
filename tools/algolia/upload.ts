import algosearch from 'algoliasearch';
import { readdirSync, readFileSync } from 'fs';
import { extname, join, resolve } from 'path';
import { environment } from '../../src/environments/environment';
import * as cheerio from 'cheerio';

console.log('Environment:', environment);

// Get the admin API key from environment variable or use a default
const adminApiKey = process.env.ALGOLIA_ADMIN_API_KEY || 'e741bbf67223c42a4412f460dbc44723';

console.log('Using App ID:', environment.appId);
console.log('Using Index Name:', environment.indexName);
console.log('Admin API Key provided:', adminApiKey ? 'Yes' : 'No');

const client = algosearch(
  environment.appId,
  adminApiKey,
);
const index = client.initIndex(environment.indexName);

// interface Document {
//   objectID: string;
//   content: string;
//   primaryText: string;
//   secondaryText: string;
//   tertiaryText: string;
//   imageUrl: string;
// }

// const splitContent = (content: string, chunkSize: number) => {
//   const chunks: string[] = [];
//   for (let i = 0; i < content.length; i += chunkSize) {
//     chunks.push(content.substring(i, i + chunkSize));
//   }
//   return chunks;
// };

// const extractFieldsFromHtml = (content: string) => {
//   const $ = cheerio.load(content);
//   return {
//     primaryText: $('h1').text() || $('strong').text() || '', // Extracting text from <h1> tags
//     secondaryText: $('h2').text() || $('span').text() || $('p').text() || '', // Extracting text from <h2> tags
//     tertiaryText:
//       $('h3').text() || $('a').text() || $('h4').text() || $('h5').text() || '', // Extracting text from <h3> tags
//     imageUrl: $('img').attr('src') || '', //Extracting image URL from <img> tags
//   };
// };

// const readFiles = (dir: string): Document[] => {
//   let fileContents: Document[] = [];

//   const files = readdirSync(dir, { withFileTypes: true });

//   files.forEach((file) => {
//     const filePath = join(dir, file.name);

//     if (file.isDirectory()) {
//       fileContents = fileContents.concat(readFiles(filePath));
//     } else if (file.isFile() && extname(file.name) === '.html') {
//       const content = readFileSync(filePath, 'utf-8');
//       const fields = extractFieldsFromHtml(content);

//       const combinedContent = `${fields.primaryText} ${fields.secondaryText} ${fields.tertiaryText}`;
//       //   const chunks = splitContent(content, 8000);

//       //   chunks.forEach((chunk, index) => {
//       fileContents.push({
//         objectID: file.name,
//         content: combinedContent,
//         primaryText: fields.primaryText,
//         secondaryText: fields.secondaryText,
//         tertiaryText: fields.tertiaryText,
//         imageUrl: fields.imageUrl,
//       });
//       //   });
//     }
//   });
//   return fileContents;
// };

// const directoryPath = resolve(__dirname, '../../src/app/homepage/pages');
// const documents = readFiles(directoryPath);

// index
//   .saveObjects(documents)
//   .then(({ objectIDs }) => {
//     console.log('Documents indexed:', objectIDs);
//   })
//   .catch((err) => {
//     console.error('Error indexing documents:', err);
//   });

uploadIndex();

async function uploadIndex() {
  try {
    const records = JSON.parse(
      readFileSync(join(process.cwd(), 'index.json'), 'utf-8'),
    );

    console.log(`Uploading ${records.length} records to Algolia...`);

    // Clear the existing index first
    await index.clearObjects();
    console.log('Existing index cleared');

    // Upload new records
    const result = await index.saveObjects(records);
    console.log('Records uploaded successfully:', result);
    
    // Wait for indexing to complete
    await index.waitTask(result.taskID);
    console.log('Indexing completed');

  } catch (error) {
    console.error('Upload failed:', error);
    
    if (error.message?.includes('Unreachable hosts')) {
      console.log('\n🔧 TROUBLESHOOTING:');
      console.log('1. Check if your Algolia App ID is correct:', environment.appId);
      console.log('2. Verify your admin API key (should be different from search-only key)');
      console.log('3. Set the admin API key as environment variable:');
      console.log('   Windows: set ALGOLIA_ADMIN_API_KEY=your_admin_key');
      console.log('   Linux/Mac: export ALGOLIA_ADMIN_API_KEY=your_admin_key');
      console.log('4. Make sure the index name exists in Algolia dashboard:', environment.indexName);
    }
  }
}
