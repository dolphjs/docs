import algosearch from 'algoliasearch';
import { readdirSync, readFileSync } from 'fs';
import { extname, join, resolve } from 'path';
import { environment } from '../../src/environments/environment';
import * as cheerio from 'cheerio';

console.log(environment);

const client = algosearch(
  environment.appId,
  'e741bbf67223c42a4412f460dbc44723',
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

function uploadIndex() {
  const records = JSON.parse(
    readFileSync(join(process.cwd(), 'index.json'), 'utf-8'),
  );

  index
    .saveObjects(records)
    .then((result) => {
      console.log('records uploaded successfully');
    })
    .catch((error) => {
      console.error(error);
    });

  console.log(records.length);
}
