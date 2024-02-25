import { Package } from 'dgeni';
import { Document } from '../shared';
import {
  computeOutputPathProcessor,
  computeWhoUsesProcessor,
  extractContentTitleProcessor,
} from './processors';
import { ContentFileReader, contentFileReader } from './readers';
import { dolphjsMarkedNunjucksFilter } from './rendering/filters/dolphjs-marked';
import { dolphjsMarkedNunjucksTag } from './rendering/tags/dolphjs-marked';
import { renderDolphJSMarkdown } from './services';

export default new Package('content', [])
  .factory(contentFileReader)
  .factory(renderDolphJSMarkdown)
  .factory(dolphjsMarkedNunjucksTag)
  .factory(dolphjsMarkedNunjucksFilter)

  .processor(extractContentTitleProcessor)
  .processor(computeOutputPathProcessor)
  .processor(computeWhoUsesProcessor)

  .config((readFilesProcessor: any, contentFileReader: ContentFileReader) => {
    readFilesProcessor.fileReaders.push(contentFileReader);
  })

  .config(
    (
      templateEngine: any,
      dolphjsMarkedNunjucksTag: any,
      dolphjsMarkedNunjucksFilter: any,
    ) => {
      templateEngine.tags.push(dolphjsMarkedNunjucksTag);
      templateEngine.filters.push(dolphjsMarkedNunjucksFilter);
    },
  )

  .config((computeIdsProcessor) => {
    computeIdsProcessor.idTemplates.push({
      docTypes: ['content', 'who-uses'],
      getId: (doc: Document) => {
        return (
          doc.fileInfo.relativePath
            // path should be relative to `modules` folder
            .replace(/.*\/?modules\//, '')
            // path should not include `/docs/`
            .replace(/\/docs\//, '/')
            // path should not have a suffix
            .replace(/\.\w*$/, '')
        );
      },
      getAliases: (doc: Document) => [doc.id],
    });
  });

export * from './processors';
export * from './readers';
