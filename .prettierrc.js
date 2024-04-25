module.exports = {
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  arrowParens: 'avoid',
  plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')],
  importOrder: [
    '<THIRD_PARTY_MODULES>',
    '@shared/(.*)$',
    '@components/(.*)$',
    '^[./]',
    'types',
  ],
  importOrderParserPlugins: [
    'classProperties',
    'decorators-legacy',
    'typescript',
    'jsx',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}
