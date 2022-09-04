import {
    RESERVED_WORDS,
    SPECIAL_CHARACTERS,
    DITTO_MARK,
    OPERATORS,
    SPECIAL_NAMES,
    COMMENT_INLINE,
    BLOCK_COMMENT
} from './constantObjects'

const arrayOfReservedWords = Object.values(RESERVED_WORDS)
const arrayOfSpecialCharacter = Object.values(SPECIAL_CHARACTERS)
const arrayOfOperators = Object.values(OPERATORS)

const {
    IDENTIFIER,
    OPERATOR,
    STRING,
    RESERVED_WORD,
    SPECIAL_CHARACTER
} = SPECIAL_NAMES

/**
 * @todo
 * @param { string } code - Full analysis code.
 */
function tokenFilter(code) {
    let DittoMarkCounter = 0
    let line = 1
    let cacheOfAnalyser = ''
    let findComment = false
    const tokens = []
    cy.wrap(code.split(''))
        .each((char, index, code) => {
            const cacheOfAnalyserWithNewChar = cacheOfAnalyser + char
            switch (char) {
                case '\n':
                    if(findComment){
                        findComment = false
                    }
                    cacheOfAnalyser = ''
                    line++
                    break

                case '-':
                    if(DittoMarkCounter === 0
                        && arrayOfOperators.includes(cacheOfAnalyserWithNewChar)
                        && !findComment
                    ){
                        if(['-'].includes(code[index + 1])){
                            cacheOfAnalyser = ''
                            findComment = true
                        }else{
                            tokens.push({
                                case: '1',
                                token: cacheOfAnalyserWithNewChar,
                                type: OPERATOR,
                                line
                            })
                            cacheOfAnalyser = ''
                        }
                    }else if (DittoMarkCounter !== 0 && !findComment){
                        cacheOfAnalyser = cacheOfAnalyserWithNewChar
                    } else if(!findComment){
                        cacheOfAnalyser = ''
                    }
                    break

                case '=':
                    if(DittoMarkCounter === 0
                        && arrayOfOperators.includes(cacheOfAnalyserWithNewChar)
                        && !findComment
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
                    }else if (DittoMarkCounter !== 0 && !findComment){
                        cacheOfAnalyser = cacheOfAnalyserWithNewChar
                    } else if(!findComment) {
                        cacheOfAnalyser = ''
                    }
                    break
                case '<':
                    if(DittoMarkCounter === 0
                        && arrayOfOperators.includes(cacheOfAnalyserWithNewChar)
                        && !findComment
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

                    }else if (DittoMarkCounter !== 0 && !findComment){
                        cacheOfAnalyser = cacheOfAnalyserWithNewChar
                    } else if(!findComment){
                        cacheOfAnalyser = ''
                    }
                    break
                case ' ' :
                case '\t':
                    if (DittoMarkCounter === 0
                        && ![' ', '\t'].includes(cacheOfAnalyserWithNewChar)
                        && !findComment
                    ){
                        tokens.push({
                            case: '1',
                            token: cacheOfAnalyser,
                            type: IDENTIFIER,
                            line
                        })
                        cacheOfAnalyser = ''
                    } else if (DittoMarkCounter !== 0 && !findComment){
                        cacheOfAnalyser = cacheOfAnalyserWithNewChar
                    } else if(!findComment){
                        cacheOfAnalyser = ''
                    }
                    break

                case DITTO_MARK:
                    if (DittoMarkCounter > 0 && !findComment){
                        tokens.push({
                            case: '5',
                            token: cacheOfAnalyserWithNewChar,
                            type: STRING,
                            line
                        })
                        DittoMarkCounter = 0
                        cacheOfAnalyser = ''
                    } else if(!findComment){
                        cacheOfAnalyser = cacheOfAnalyserWithNewChar
                        DittoMarkCounter++
                    }
                    break
                default:
                    if(DittoMarkCounter === 0
                        && arrayOfOperators.includes(cacheOfAnalyserWithNewChar)
                        && !findComment
                    ){
                        tokens.push({
                            case: '1',
                            token: cacheOfAnalyserWithNewChar,
                            type: OPERATOR,
                            line
                        })
                        cacheOfAnalyser = ''
                    }
                    else if (
                        arrayOfReservedWords.includes(cacheOfAnalyserWithNewChar)
                        && index + 1 !== code.length
                        && [' ', '\n'].includes(code[index + 1])
                        && DittoMarkCounter === 0
                        && !findComment
                    ){
                        tokens.push({
                            case: '2',
                            token: cacheOfAnalyserWithNewChar,
                            type: RESERVED_WORD,
                            line
                        })
                        cacheOfAnalyser = ''
                    } else if (arrayOfSpecialCharacter.includes(char)
                        && DittoMarkCounter === 0
                        && !findComment
                    ){
                        if (cacheOfAnalyserWithNewChar.length > 1 && !findComment){
                            tokens.push({
                                case: '3',
                                token: cacheOfAnalyser,
                                type: IDENTIFIER,
                                line
                            })
                        }
                        tokens.push({
                            case: '4',
                            token: char,
                            type: SPECIAL_CHARACTER,
                            line
                        })
                        cacheOfAnalyser = ''
                    } else if(!findComment){
                        cacheOfAnalyser = cacheOfAnalyserWithNewChar
                    }
            }
        })
    return tokens
}

export { tokenFilter }
