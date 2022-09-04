import {
  RESERVED_WORDS,
  SPECIAL_CHARACTERS,
  DITTO_MARK,
  OPERATORS,
  SPECIAL_NAMES
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


/**
 * Function responsible for analyzing COOL code and returning array of tokens, in other words performing lexical analysis of the code.
 *
 * @param { object } param
 * @param { string } param.codeRaw - Full analysis code.
 * @returns {[tokens]} - Token array.
 */
function tokenFilter({codeRaw}) {
  let dittoMarkCounter = 0
  let line = 1
  let cacheOfAnalyser = ''
  let indexOfEndOfBlockComment = -1
  let isInlineComment = false
  let code = codeRaw
  const tokens = []
  cy.wrap(code.split(''))
    .each((char, index, code) => {
      const cacheOfAnalyserWithNewChar = cacheOfAnalyser + char
      if(dittoMarkCounter === 0 && char === '(' && !isInlineComment
            && ['*'].includes(code[index + 1]) && indexOfEndOfBlockComment === -1){
        indexOfEndOfBlockComment = code.join('').slice(index).indexOf('*)') + 2 + index
      }else {
        if(indexOfEndOfBlockComment === -1){
          switch (char) {
            case '\n':
              if(isInlineComment){
                isInlineComment = false
              }
              cacheOfAnalyser = ''
              line++
              break

            case '-':
              if(dittoMarkCounter === 0
                                && arrayOfOperators.includes(cacheOfAnalyserWithNewChar)
                                && !isInlineComment
              ){
                if(['-'].includes(code[index + 1])){
                  cacheOfAnalyser = ''
                  isInlineComment = true
                }else{
                  tokens.push({
                    case: '1',
                    token: cacheOfAnalyserWithNewChar,
                    type: OPERATOR,
                    line
                  })
                  cacheOfAnalyser = ''
                }
              }else if (dittoMarkCounter !== 0 && !isInlineComment){
                cacheOfAnalyser = cacheOfAnalyserWithNewChar
              } else if(!isInlineComment){
                cacheOfAnalyser = ''
              }
              break

            case '=':
              if(dittoMarkCounter === 0
                                && arrayOfOperators.includes(cacheOfAnalyserWithNewChar)
                                && !isInlineComment
              ){
                if(['>'].includes(code[index + 1])){
                  cacheOfAnalyser = cacheOfAnalyserWithNewChar
                }else{
                  tokens.push({
                    case: '1',
                    token: cacheOfAnalyserWithNewChar,
                    type: OPERATOR,
                    line
                  })
                  cacheOfAnalyser = ''
                }
              }else if (dittoMarkCounter !== 0 && !isInlineComment){
                cacheOfAnalyser = cacheOfAnalyserWithNewChar
              } else if(!isInlineComment) {
                cacheOfAnalyser = ''
              }
              break

            case '<':
              if(dittoMarkCounter === 0
                                && arrayOfOperators.includes(cacheOfAnalyserWithNewChar)
                                && !isInlineComment
              ){
                if(['-', '='].includes(code[index + 1])){
                  cacheOfAnalyser = cacheOfAnalyserWithNewChar
                } else{
                  tokens.push({
                    case: '1',
                    token: cacheOfAnalyserWithNewChar,
                    type: OPERATOR,
                    line
                  })
                  cacheOfAnalyser = ''
                }

              }else if (dittoMarkCounter !== 0 && !isInlineComment){
                cacheOfAnalyser = cacheOfAnalyserWithNewChar
              } else if(!isInlineComment){
                cacheOfAnalyser = ''
              }
              break

            case ' ' :
            case '\t':
              if (dittoMarkCounter === 0
                                && ![' ', '\t'].includes(cacheOfAnalyserWithNewChar)
                                && !isInlineComment
              ){
                tokens.push({
                  case: '1',
                  token: cacheOfAnalyser,
                  type: IDENTIFIER,
                  line
                })
                cacheOfAnalyser = ''
              } else if (dittoMarkCounter !== 0 && !isInlineComment){
                cacheOfAnalyser = cacheOfAnalyserWithNewChar
              } else if(!isInlineComment){
                cacheOfAnalyser = ''
              }
              break

            case DITTO_MARK:
              if (dittoMarkCounter > 0 && !isInlineComment){
                tokens.push({
                  case: '5',
                  token: cacheOfAnalyserWithNewChar,
                  type: STRING,
                  line
                })
                dittoMarkCounter = 0
                cacheOfAnalyser = ''
              } else if(!isInlineComment){
                cacheOfAnalyser = cacheOfAnalyserWithNewChar
                dittoMarkCounter++
              }
              break

            default:
              if(dittoMarkCounter === 0
                                && arrayOfOperators.includes(cacheOfAnalyserWithNewChar)
                                && !isInlineComment
              ){
                tokens.push({
                  case: '1',
                  token: cacheOfAnalyserWithNewChar,
                  type: OPERATOR,
                  line
                })
                cacheOfAnalyser = ''
              } else if (
                arrayOfReservedWords.includes(cacheOfAnalyserWithNewChar)
                                && index + 1 !== code.length
                                && [' ', '\n'].includes(code[index + 1])
                                && dittoMarkCounter === 0
                                && !isInlineComment
              ){
                tokens.push({
                  case: '2',
                  token: cacheOfAnalyserWithNewChar,
                  type: RESERVED_WORD,
                  line
                })
                cacheOfAnalyser = ''
              } else if (arrayOfSpecialCharacter.includes(char)
                                && dittoMarkCounter === 0
              ){
                if (cacheOfAnalyserWithNewChar.length > 1 && !isInlineComment){
                  tokens.push({
                    case: '3',
                    token: cacheOfAnalyser,
                    type: IDENTIFIER,
                    line
                  })
                }
                if(!isInlineComment){
                  tokens.push({
                    case: '40',
                    token: char,
                    type: SPECIAL_CHARACTER,
                    line
                  })
                }
                cacheOfAnalyser = ''
              } else if(!isInlineComment){
                cacheOfAnalyser = cacheOfAnalyserWithNewChar
              }
          }
        }else if (index === indexOfEndOfBlockComment){
          if (char === '\n') {
            line++
          }
          indexOfEndOfBlockComment = -1
          cacheOfAnalyser = ''
        }else{
          if (char === '\n') {
            line++
          }
        }

      }
    })
  return tokens
}

export { tokenFilter }
