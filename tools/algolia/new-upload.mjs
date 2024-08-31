import { createHash } from 'crypto';
import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join } from 'path';
import { remark } from 'remark';
import { visit } from 'unist-util-visit';

let index = [];
buildIndex();

async function buildIndex() {
  const contentFiles = readdirSync(join(process.cwd(), 'content'));
  contentFiles.forEach(async (file) => {
    const filePath = join(process.cwd(), 'content', file);

    if (statSync(filePath).isFile()) {
      const contentFile = readFileSync(filePath, 'utf-8');
      await remark().use(remarkContentToRecords(file)).processSync(contentFile);
    }
  });

  writeFileSync('index.json', JSON.stringify(index), 'utf-8');
}

function remarkContentToRecords(filename) {
  const record = {
    headings: [],
    content: '',
    path: filename.replace('md', ''),
    rank: Math.floor(Math.random() * 100),
    objectID: getObjectID(filename),
  };

  return () => (tree) => {
    visit(tree, (node) => {
      if (node.type === 'heading') {
        record.headings.push(node.children[0].value);
      }

      if (node.type === 'paragraph') {
        record.content += remark.stringify(node);
      }
    });

    index = [...index, ...splitRecordsIfHeavy(record).flat()];
  };
}

function splitRecordsIfHeavy(record, leafType = '') {
  if (isRecordHeavy(record)) {
    const { subRecord1, subRecord2 } = getSubRecords(record, leafType);
    return [
      ...splitRecordsIfHeavy(subRecord1, leafType + 'l'),
      ...splitRecordsIfHeavy(subRecord2, leafType + 'r'),
    ];
  }

  return [record];
}

function getObjectID(filename) {
  return createHash('md5').update(filename).digest('hex');
}

function getSubRecords(record, leafType) {
  const midPoint = Math.floor(record.content.length / 2);

  const content1 = record.content.substring(0, midPoint);
  const content2 = record.content.substring(midPoint);

  const midHeadings = Math.ceil(record.headings.length / 2);
  const headings1 = record.headings.slice(0, midHeadings);
  const headings2 = record.headings.slice(midHeadings);

  const subRecord1 = {
    ...record,
    content: content1,
    headings: headings1,
    path: record.path + leafType + 'l',
  };
  const subRecord2 = {
    ...record,
    content: content2,
    headings: headings2,
    path: record.path + leafType + 'r',
  };

  return { subRecord1, subRecord2 };
}

function isRecordHeavy(record) {
  const maxContentLength = 8000;
  const maxHeadingsCount = 10;

  return (
    record.content.length > maxContentLength ||
    record.headings.length > maxHeadingsCount
  );
}
