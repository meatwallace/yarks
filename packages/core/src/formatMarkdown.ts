import prettier from 'prettier';

export function formatMarkdown(input: string, options): string {
  let prettierConfig = { ...options.prettierConfig, parser: 'markdown' };
  let formatted = prettier.format(input, prettierConfig);

  return formatted;
}
