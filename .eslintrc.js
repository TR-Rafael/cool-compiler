module.exports = {
  env: {
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended'
  ],
  overrides: [
    {
      extends: ['plugin:cypress/recommended'],
      files: ['./cypress/**/*.{j,t}s']
    },
    {
      files: ['.eslintrc.{j,t}s', '*.config.{j,t}s'],
      rules: {
        'sort-keys': 'error'
      }
    },
    {
      // enable specific ESLint rules in src/core dir
      files: ['./src/core/**/*.{j,t}s'],
      rules: {
        'jsdoc/require-jsdoc': [
          'warn',
          {
            checkConstructors: false,
            require: {
              ClassDeclaration: true,
              ClassExpression: true,
              FunctionDeclaration: true,
              MethodDefinition: true
            }
          }
        ]
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 2020,
    parser: 'babel-eslint'
  },
  plugins: ['sort-exports', 'sort-destructure-keys'],
  root: true,
  rules: {
    'array-bracket-spacing': ['error', 'never'],
    'arrow-parens': ['error', 'as-needed'],
    'arrow-spacing': ['error', { after: true, before: true }],
    'brace-style': ['error', '1tbs', { allowSingleLine: false }],
    'comma-dangle': ['error', 'never'],
    curly: 'error',
    eqeqeq: ['error', 'always'],
    'import/no-cycle': ['error', { amd: true, commonjs: true }],
    'import/no-duplicates': ['error'],
    'import/no-named-as-default': ['error'],
    'import/no-named-as-default-member': ['error'],
    indent: ['warn', 2, { SwitchCase: 1 }],
    'no-multi-spaces': 'error',
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['*.js'],
            message: 'Javascript files should be imported without the .js extension'
          }
        ]
      }
    ],
    'no-unreachable':  'warn',
    'no-unused-vars': [
      'warn',
      { args: 'all', argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
    ],
    'prefer-destructuring': [
      'error',
      {
        array: false,
        object: true
      },
      {
        enforceForRenamedProperties: false
      }
    ],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    semi: ['error', 'never'],
    'sort-destructure-keys/sort-destructure-keys': ['error'],
    'sort-exports/sort-exports': ['off'],
    'sort-imports': ['off'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        asyncArrow: 'always',
        named: 'never'
      }
    ],
    'space-in-parens': ['error', 'never']
  }
}