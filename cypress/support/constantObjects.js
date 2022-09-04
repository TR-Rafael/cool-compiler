const RESERVED_WORDS = {
    CLASS: 'class',
    ELSE: 'else',
    IF: 'if',
    FI: 'fi',
    IN: 'in',
    INHERITS: 'inherits',
    ISVOID: 'isvoid',
    LET: 'let',
    LOOP: 'loop',
    POOL: 'pool',
    THEN: 'then',
    WHILE: 'while',
    CASE: 'case',
    ESAC: 'esac',
    NEW: 'new',
    OF: 'of',
    NOT: 'not',
    FALSE: 'false',
    TRUE: 'true'
}

const SPECIAL_CHARACTERS = {
    OPEN_PARENTHESES: '(',
    CLOSE_PARENTHESES: ')',
    OPEN_BRACES: '{',
    CLOSE_BRACES: '}',
    SEMICOLON: ';',
    COLON: ':',
    COMMA: ',',
    TILDE: '~',
    DOT: '.',
    AT_SIGN: '@'
}

const OPERATORS = {
    EQUAL_SIGN: '=',
    PLUS_SIGN: '+',
    MINUS_SIGN: '-',
    MULTIPLICATION_SIGN: '*',
    DIVISION_SIGN: '/',
    LESS_THAN_SIGN: '<',
    LESS_THAN_OR_EQUAL_SIGN: '<=',
    ASSIGNMENT: '<-',
    IMPLICATION: '=>'
}

const SPECIAL_NAMES = {
    IDENTIFIER: 'Identifier',
    OPERATOR: 'Operator',
    STRING: 'String',
    RESERVED_WORD: 'Reserved Word',
    SPECIAL_CHARACTER: 'Special Character'
}

const DITTO_MARK = '"'
const COMMENT_INLINE = '--'

const BLOCK_COMMENT = {
    OPEN_BLOCK_OF_COMMENT: '(*',
    CLOSE_BLOCK_OF_COMMENT: '(*'
}
export {
    COMMENT_INLINE,
    BLOCK_COMMENT,
    RESERVED_WORDS,
    SPECIAL_CHARACTERS,
    SPECIAL_NAMES,
    DITTO_MARK,
    OPERATORS
}