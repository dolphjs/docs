import * as marked from 'marked';
import {
  applyTableRenderer,
  applyCodeRenderer,
  applyBlockQuoteRenderer,
  applyHeadingRenderer,
  applyLinkRenderer,
} from './renderer';

export type RenderDolphJSMarkdown = (content: string) => string;

export function renderDolphJSMarkdown() {
  const renderer = new marked.Renderer();

  applyTableRenderer(renderer);
  applyCodeRenderer(renderer);
  applyLinkRenderer(renderer);
  applyHeadingRenderer(renderer);
  applyBlockQuoteRenderer(renderer);

  // @ts-ignore
  return (content: string) => marked(content, { renderer });
}
