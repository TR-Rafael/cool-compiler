import {RESERVED_WORDS, SPECIAL_CHARACTERS, IDENTIFIER, DITTO_MARK} from './constantObjects'

const arrayOfReservedWords = Object.values(RESERVED_WORDS)
const arrayOfSpecialCharacter = Object.values(SPECIAL_CHARACTERS)
/**
 * @todo
 *
 * @param { string } code - Full analysis code.
 */
function tokenFilter(code) {
    let DittoMarkCounter = 0
    let line = 1
    let cacheOfAnalyser = ''
    const tokens = []
    cy.wrap(code.split(''))
        .each((char, index, code) => {
            const cacheOfAnalyserWithNewChar = cacheOfAnalyser + char
            switch (char) {
                case '\n':
                    cacheOfAnalyser = ''
                    line++
                    break
                default:
                    if(char === ' '){ // OK
                        if(DittoMarkCounter === 0 && cacheOfAnalyserWithNewChar !== ' '){
                            tokens.push({
                                case: '1',
                                token: cacheOfAnalyserWithNewChar,
                                type: IDENTIFIER,
                                line
                            })
                            cacheOfAnalyser = ''
                        } else if(DittoMarkCounter !== 0){
                            cacheOfAnalyser = cacheOfAnalyserWithNewChar
                        } else{
                            cacheOfAnalyser = ''
                        }
                    }
                    else if( // OK
                        arrayOfReservedWords.includes(cacheOfAnalyserWithNewChar)
                        && index + 1 !== code.length
                        && [' ', '\n'].includes(code[index + 1])
                    ){
                        tokens.push({
                            case: '2',
                            token: cacheOfAnalyserWithNewChar,
                            type: 'Reserved Word',
                            line
                        })
                        cacheOfAnalyser = ''
                    } else if(arrayOfSpecialCharacter.includes(char)){
                        if(cacheOfAnalyserWithNewChar.length > 1){
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
                            type: 'Special Character',
                            line
                        })
                        cacheOfAnalyser = ''
                    }else if(char === DITTO_MARK) {
                        if(DittoMarkCounter > 0){
                            tokens.push({
                                case: '5',
                                token: cacheOfAnalyserWithNewChar,
                                type: 'String',
                                line
                            })
                            DittoMarkCounter = 0
                            cacheOfAnalyser = ''
                        }else{
                            cacheOfAnalyser = cacheOfAnalyserWithNewChar
                            DittoMarkCounter++
                        }
                    }
                    else{
                        cacheOfAnalyser = cacheOfAnalyserWithNewChar
                    }

            }
    })
    console.log(tokens)
}

export { tokenFilter }
