import prettier, { Options as PrettierConfig } from 'prettier';
import { Options } from './types';

export function formatMarkdown(input: string, options: Options): string {
  let prettierConfig: PrettierConfig = {
    ...options.prettierConfig,
    parser: 'markdown',
  };

  let formatted = prettier.format(input, prettierConfig);

  return formatted;
}
