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
    COLON: ':'
}

const IDENTIFIER = 'Identifier'
const DITTO_MARK = '"'

export {
    RESERVED_WORDS,
    SPECIAL_CHARACTERS,
    IDENTIFIER,
    DITTO_MARK
}