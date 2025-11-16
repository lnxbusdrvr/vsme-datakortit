/**
 * @type {import('prettier').Config}
 */
module.exports = {
  // --- Core Settings ---

  // Enforce the use of semicolons at the end of statements (makes your semicolons work).
  semi: true,

  // Use single quotes instead of double quotes.
  singleQuote: true,

  // Specify the number of spaces per indentation level. 2 is the modern JS standard.
  tabWidth: 2,

  // --- Style and Readability Settings ---

  // The maximum line length before Prettier wraps the code. 100 or 120 are common.
  printWidth: 100,

  // Controls the use of trailing commas in multi-line structures (objects, arrays, functions).
  // 'es5' adds them wherever they are valid in ES5, which improves clean Git diffs.
  trailingComma: 'es5',

  // Include parentheses around a sole arrow function parameter (x => x) or omit (x => x).
  // 'avoid' is common practice.
  arrowParens: 'avoid',

  // --- System Compatibility ---

  // Enforce consistent Line Feed (LF) line endings, standard for Node.js and Git to prevent issues.
  endOfLine: 'lf',
};
