import { RenderDolphJSMarkdown } from '../../services';

export function dolphjsMarkedNunjucksFilter(
  renderDolphJSMarkdown: RenderDolphJSMarkdown,
) {
  return {
    name: 'dolphjsmarked',
    process(str: string) {
      const output = str && renderDolphJSMarkdown(str);
      return output;
    },
  };
}
