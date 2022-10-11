import {
  RESERVED_WORDS,
  SPECIAL_CHARACTERS,
  DITTO_MARK,
  OPERATORS,
  SPECIAL_NAMES,
  BLOCK_COMMENT,
  JUMP_LINE,
  TAB,
  EMPTY_STRING,
  SPACE,
  GREATER_THAN_SIGN
} from './constantObjects'

const arrayOfReservedWords = Object.values(RESERVED_WORDS)
const arrayOfSpecialCharacter = Object.values(SPECIAL_CHARACTERS)
const arrayOfOperators = Object.values(OPERATORS)

const {
  IDENTIFIER,
  OPERATOR,
  RESERVED_WORD,
  SPECIAL_CHARACTER,
  STRING
} = SPECIAL_NAMES

const {
  CLOSE_BLOCK_OF_COMMENT
} = BLOCK_COMMENT

const {
  OPEN_PARENTHESES,
  SEMICOLON
} = SPECIAL_CHARACTERS

const {
  EQUAL_SIGN,
  LESS_THAN_SIGN,
  MINUS_SIGN,
  MULTIPLICATION_SIGN
} = OPERATORS


/**
 * Function responsible for analyzing COOL code and returning array of tokens, in other words performing lexical analysis of the code.
 *
 * @param { object } param
 * @param { string } param.codeRaw - Full analysis code.
 * @returns {[tokens]} - Token array.
 */
function lexiconAnalyzer({ codeRaw }) {
  let dittoMarkCounter = 0
  let line = 1
  let cacheOfAnalyser = EMPTY_STRING
  let indexOfEndOfBlockComment = -1
  let isInlineComment = false
  const tokens = []
  cy.wrap(codeRaw.split(EMPTY_STRING))
    .each((char, index, code) => {
      const cacheOfAnalyserWithNewChar = cacheOfAnalyser + char
      if (dittoMarkCounter === 0
          && char === OPEN_PARENTHESES
          && !isInlineComment
          && [MULTIPLICATION_SIGN].includes(code[index + 1])
          && indexOfEndOfBlockComment === -1
      ){
        indexOfEndOfBlockComment = code.join(EMPTY_STRING).slice(index).indexOf(CLOSE_BLOCK_OF_COMMENT) + 2 + index
      } else {
        if (indexOfEndOfBlockComment === -1){
          switch (char) {
            case JUMP_LINE:
              if (isInlineComment){
                isInlineComment = false
              }
              cacheOfAnalyser = EMPTY_STRING
              line++
              break

            case MINUS_SIGN:
              if (dittoMarkCounter === 0
                  && arrayOfOperators.includes(cacheOfAnalyserWithNewChar)
                  && !isInlineComment
              ){
                if ([MINUS_SIGN].includes(code[index + 1])){
                  cacheOfAnalyser = EMPTY_STRING
                  isInlineComment = true
                } else {
                  tokens.push({
                    line,
                    token: cacheOfAnalyserWithNewChar,
                    type: OPERATOR
                  })
                  cacheOfAnalyser = EMPTY_STRING
                }
              } else if (dittoMarkCounter !== 0 && !isInlineComment){
                cacheOfAnalyser = cacheOfAnalyserWithNewChar
              } else if (!isInlineComment){
                cacheOfAnalyser = EMPTY_STRING
              }
              break

            case EQUAL_SIGN:
              if (dittoMarkCounter === 0
                  && arrayOfOperators.includes(cacheOfAnalyserWithNewChar)
                  && !isInlineComment
              ){
                if ([GREATER_THAN_SIGN].includes(code[index + 1])){
                  cacheOfAnalyser = cacheOfAnalyserWithNewChar
                } else {
                  tokens.push({
                    line,
                    token: cacheOfAnalyserWithNewChar,
                    type: OPERATOR
                  })
                  cacheOfAnalyser = EMPTY_STRING
                }
              } else if (dittoMarkCounter !== 0 && !isInlineComment){
                cacheOfAnalyser = cacheOfAnalyserWithNewChar
              } else if (!isInlineComment) {
                cacheOfAnalyser = EMPTY_STRING
              }
              break

            case LESS_THAN_SIGN:
              if (dittoMarkCounter === 0
                  && arrayOfOperators.includes(cacheOfAnalyserWithNewChar)
                  && !isInlineComment
              ){
                if ([MINUS_SIGN, EQUAL_SIGN].includes(code[index + 1])){
                  cacheOfAnalyser = cacheOfAnalyserWithNewChar
                } else {
                  tokens.push({
                    line,
                    token: cacheOfAnalyserWithNewChar,
                    type: OPERATOR
                  })
                  cacheOfAnalyser = EMPTY_STRING
                }

              } else if (dittoMarkCounter !== 0 && !isInlineComment){
                cacheOfAnalyser = cacheOfAnalyserWithNewChar
              } else if (!isInlineComment){
                cacheOfAnalyser = EMPTY_STRING
              }
              break

            case SPACE :
            case TAB:
              if (dittoMarkCounter === 0
                  && ![SPACE, TAB].includes(cacheOfAnalyserWithNewChar)
                  && !isInlineComment
              ){
                tokens.push({
                  line,
                  token: cacheOfAnalyser,
                  type: IDENTIFIER
                })
                cacheOfAnalyser = EMPTY_STRING
              } else if (dittoMarkCounter !== 0 && !isInlineComment){
                cacheOfAnalyser = cacheOfAnalyserWithNewChar
              } else if (!isInlineComment){
                cacheOfAnalyser = EMPTY_STRING
              }
              break

            case DITTO_MARK:
              if (dittoMarkCounter > 0 && !isInlineComment){
                tokens.push({
                  line,
                  token: cacheOfAnalyserWithNewChar,
                  type: STRING
                })
                dittoMarkCounter = 0
                cacheOfAnalyser = EMPTY_STRING
              } else if (!isInlineComment){
                cacheOfAnalyser = cacheOfAnalyserWithNewChar
                dittoMarkCounter++
              }
              break

            default:
              if (dittoMarkCounter === 0
                  && arrayOfOperators.includes(cacheOfAnalyserWithNewChar)
                  && !isInlineComment
              ){
                console.log({
                  line,
                  token: cacheOfAnalyserWithNewChar,
                  type: OPERATOR
                }, 'case Operator')
                tokens.push({
                  line,
                  token: cacheOfAnalyserWithNewChar,
                  type: OPERATOR
                })
                cacheOfAnalyser = EMPTY_STRING
              } else if (
                arrayOfReservedWords.includes(cacheOfAnalyserWithNewChar)
                && index + 1 !== code.length
                && [SPACE, JUMP_LINE, SEMICOLON].includes(code[index + 1])
                && dittoMarkCounter === 0
                && !isInlineComment
              ){
                tokens.push({
                  line,
                  token: cacheOfAnalyserWithNewChar,
                  type: RESERVED_WORD
                })
                cacheOfAnalyser = EMPTY_STRING
              } else if (
                arrayOfSpecialCharacter.includes(char)
                  && dittoMarkCounter === 0
              ){
                if (cacheOfAnalyserWithNewChar.length > 1 && !isInlineComment){
                  // console.log({
                  //   line,
                  //   token: cacheOfAnalyser,
                  //   type: IDENTIFIER
                  // }, 'Case Default')
                  tokens.push({
                    line,
                    token: cacheOfAnalyser,
                    type: IDENTIFIER
                  })
                }
                if (!isInlineComment){
                  tokens.push({
                    line,
                    token: char,
                    type: SPECIAL_CHARACTER
                  })
                }
                cacheOfAnalyser = EMPTY_STRING
              } else if (cacheOfAnalyserWithNewChar.length === 1 && !isNaN(char)){
                tokens.push({
                  line,
                  token: char,
                  type: IDENTIFIER
                })
                cacheOfAnalyser = EMPTY_STRING
              } else if (!isInlineComment){
                cacheOfAnalyser = cacheOfAnalyserWithNewChar
                if (
                  cacheOfAnalyserWithNewChar.length > 1 &&
                    arrayOfOperators.includes(cacheOfAnalyserWithNewChar.slice(-1))
                ){
                  tokens.push({
                    line,
                    token: cacheOfAnalyserWithNewChar.slice(0,-1),
                    type: IDENTIFIER
                  })
                  tokens.push({
                    line,
                    token: char,
                    type: OPERATOR
                  })
                  cacheOfAnalyser = EMPTY_STRING
                }
              }
          }
        } else if (index === indexOfEndOfBlockComment){
          if (char === JUMP_LINE) {
            line++
          }
          indexOfEndOfBlockComment = -1
          cacheOfAnalyser = EMPTY_STRING
        } else {
          if (char === JUMP_LINE) {
            line++
          }
        }
      }
    })
  return tokens
}

export { lexiconAnalyzer }
