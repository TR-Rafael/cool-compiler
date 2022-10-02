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
  AT_SIGN,
  CLOSE_BRACES,
  CLOSE_PARENTHESES,
  COLON,
  COMMA,
  DOT,
  OPEN_BRACES,
  OPEN_PARENTHESES,
  SEMICOLON,
  TILDE
} = SPECIAL_CHARACTERS

const {
  ASSIGNMENT,
  DIVISION_SIGN,
  EQUAL_SIGN,
  IMPLICATION,
  LESS_THAN_OR_EQUAL_SIGN,
  LESS_THAN_SIGN,
  MINUS_SIGN,
  MULTIPLICATION_SIGN,
  PLUS_SIGN
} = OPERATORS

const {
  CASE,
  CLASS,
  ELSE,
  ESAC,
  FALSE,
  FI,
  IF,
  IN,
  INHERITS,
  ISVOID,
  LET,
  LOOP,
  NEW,
  NOT,
  OF,
  POOL,
  THEN,
  TRUE,
  WHILE
} = RESERVED_WORDS

async function auxiliaryParser({ Tokens, actualCase = '', index }) {
  if (index === 0){
    console.log(Tokens)
  } else if (index === -1){
    console.log('ERROR')
    return -1
  }
  if (Tokens.length === index){
    return 1
  }

  switch (actualCase) {
    case CLASS:
      let idx
      idx = await handleClass({ Tokens, index })
      const tokenOfClass = Tokens[idx].token
      if (tokenOfClass === SEMICOLON){
        return auxiliaryParser({ Tokens, index: idx + 1, actualCase: '' })
      } else {
        console.log('ERROR')
      }
      break
    default:
      const tokenOfDefault = Tokens[index].token
      switch (tokenOfDefault){
        case CLASS:
          return auxiliaryParser({ Tokens, index: index + 1, actualCase: CLASS })
        case IDENTIFIER:
          break
        case OPERATOR:
          break
        case SPECIAL_CHARACTER:
          break
        case STRING:
          break
        default:
          console.log('Error')
          return auxiliaryParser({ Tokens, index: -1, actualCase: 'ERROR' })
      }
  }
}

async function handleClass({ Tokens, index }){
  let idxAfterInherits
  let idxAfterFeature
  let indexOfEndClass
  const { type } = Tokens[index]
  if (type === IDENTIFIER) {
    const { token } = Tokens[index+1]
    switch (token){
      case INHERITS:
        idxAfterInherits = handleInherits({ Tokens, index: index+2 })
        idxAfterFeature = await handleFeature({ Tokens, index: idxAfterInherits })
        indexOfEndClass = idxAfterFeature
        break
      case OPEN_BRACES:
        idxAfterFeature = await handleFeature({ Tokens, index: index+2 })
        indexOfEndClass = idxAfterFeature
        break
      default:
        console.log('Error')
        indexOfEndClass = -1
    }
  } else {
    console.log('Erro')
    indexOfEndClass = -1
  }
  return indexOfEndClass
}

function handleInherits({ Tokens, index }){
  let endIndexOfInherits
  const { type } = Tokens[index]
  if (type === IDENTIFIER) {
    const { token } = Tokens[index + 1]
    if (token === OPEN_BRACES){
      endIndexOfInherits = index+2
    } else {
      console.log('Erro')
      endIndexOfInherits = -1
    }
  } else {
    console.log('Erro')
    endIndexOfInherits = -1
  }
  return endIndexOfInherits
}

async function handleFeature({ Tokens, index }){
  let endIndexOfFeature
  let idxAfterColonCase
  let idxAfterOpenParenthesesCase
  let idxAfterCloseParenthesesCase
  const { token, type } = Tokens[index]

  if (token === CLOSE_BRACES){
    endIndexOfFeature = index + 1
  } else if (type === IDENTIFIER) {
    const { token } = Tokens[index + 1]
    switch (token){
      case COLON:
        idxAfterColonCase = handleFeatureColonCase({ Tokens,index: index + 2 })
        endIndexOfFeature = idxAfterColonCase
        break
      case OPEN_PARENTHESES:
        idxAfterOpenParenthesesCase = handleFeatureOpenParenthesesCase({ Tokens,index: index + 2 })
        idxAfterCloseParenthesesCase = handleFeatureAfterCloseParenthesesCase({ Tokens,index: idxAfterOpenParenthesesCase })
        const { token } = Tokens[idxAfterCloseParenthesesCase]
        if (token === CLOSE_BRACES){
          endIndexOfFeature = index + 1
        } else {
          console.log('Error')
          endIndexOfFeature = -1
        }
        break
      default:
        console.log('Error')
        endIndexOfFeature = -1
    }
  } else {
    console.log('Erro')
    endIndexOfFeature = -1
  }
  return endIndexOfFeature
}

function handleFeatureOpenParenthesesCase({ Tokens, index }){
  let endIndexOfFeature
  const { token, type } = Tokens[index]
  if (token === CLOSE_PARENTHESES){
    endIndexOfFeature = index + 1
  } else {
    if (type === IDENTIFIER) {
      handleExtraFormals({ Tokens, index: index + 1 })
    } else {
      console.log('Erro')
      endIndexOfFeature = -1
    }
  }
  return endIndexOfFeature
}

function handleExtraFormals({ Tokens, index }){
  let endIndexOfFormal
  const { token } = Tokens[index]
  if (token === COLON){
    const { type } = Tokens[index + 1]
    if (type === IDENTIFIER){
      const { token } = Tokens[index + 2]
      if (token === COMMA){
        const { type } = Tokens[index + 3]
        if (type === IDENTIFIER){
          endIndexOfFormal = handleExtraFormals({ Tokens, index: index + 4 })
        } else {
          console.log('Erro')
          endIndexOfFormal = -1
        }
      } else {
        // Formal case exit
        endIndexOfFormal = index + 2
      }
    } else {
      console.log('Erro')
      endIndexOfFormal = -1
    }
  } else {
    console.log('Erro')
    endIndexOfFormal = -1
  }
  return endIndexOfFormal
}

function handleFeatureAfterCloseParenthesesCase({ Tokens, index }){
  let endIndexOfFeature
  let endIndexOfExpressionGroup1
  const { token } = Tokens[index]
  if (token === COLON){
    const { type } = Tokens[index + 1]
    if (type === IDENTIFIER){
      const { token } = Tokens[index + 2]
      if (token === OPEN_BRACES){
        // TODO temporário
        endIndexOfExpressionGroup1 = handleExpressionGroup1({ Tokens, index: index + 3 })
        endIndexOfFeature = endIndexOfExpressionGroup1
      } else {
        console.log('Erro')
        endIndexOfFeature = -1
      }
    } else {
      console.log('Erro')
      endIndexOfFeature = -1
    }
  } else {
    console.log('Erro')
    endIndexOfFeature = -1
  }
  return endIndexOfFeature
}

function handleFeatureColonCase({ Tokens, index }){
  let endIndexOfFeature
  let endIndexOfExpressionGroup1
  const { type } = Tokens[index]
  if (type === IDENTIFIER){
    const { token } = Tokens[index + 1]
    if (token === ASSIGNMENT) {
      endIndexOfExpressionGroup1 = handleExpressionGroup1({ Tokens, index: index + 2 })
      endIndexOfFeature = endIndexOfExpressionGroup1
    } else {
      endIndexOfFeature = index + 1
    }
  } else {
    console.log('Erro')
    endIndexOfFeature = -1
  }
  return endIndexOfFeature
}
// TODO agora o bagulho vai ficar sério

function handleExpressionGroup1({ Tokens, index }){
  let endIndexOfFeature
  const { token } = Tokens[index]
  switch (token){
    case FALSE:
      endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index: index + 1 })
      break
    case TRUE:
      endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index: index + 1 })
      break
    case NEW:
      const { type } = Tokens[index + 1]
      if (type === IDENTIFIER){
        endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index: index + 2 })
      } else {
        console.log('Erro')
        endIndexOfFeature = -1
      }
      break
    case ISVOID:
      endIndexOfFeature = handleExpressionGroup1({ Tokens, index: index + 1 })
      break
    case NOT:
      endIndexOfFeature = handleExpressionGroup1({ Tokens, index: index + 1 })
      break
    case TILDE:
      endIndexOfFeature = handleExpressionGroup1({ Tokens, index: index + 1 })
      break
    case OPEN_PARENTHESES:
      endIndexOfFeature = handleExpressionGroup1({ Tokens, index: index + 1 })
      const { type: typeAfterOpenParentheses } = Tokens[endIndexOfFeature]
      if (typeAfterOpenParentheses === CLOSE_PARENTHESES){
        endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index: index + 2 })
      } else {
        console.log('Erro')
        endIndexOfFeature = -1
      }
      break
    case OPEN_BRACES:
      let conditional = true
      let indexAux = index + 1
      while (conditional){
        indexAux = handleExpressionGroup1({ Tokens, index: indexAux })
        const { token: endOfExpressionToken } = Tokens[indexAux]
        if (endOfExpressionToken === SEMICOLON){
          const { token: endOfExpressionToken } = Tokens[indexAux + 1]
          if (endOfExpressionToken === CLOSE_BRACES){
            conditional = false
            endIndexOfFeature = endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index: indexAux + 2 })
          } else {
            indexAux++
          }
        } else {
          conditional = false
          console.log('Erro')
          endIndexOfFeature = -1
        }
      }
      break
    case CASE:
      endIndexOfFeature = handleExpressionCase({ Tokens, index: index + 1 })
      break
    case LET:
      endIndexOfFeature = handleExpressionLet({ Tokens, index: index + 1 })
      break
    case WHILE:
      endIndexOfFeature = handleExpressionWhile({ Tokens, index: index + 1 })
      break
    case IF:
      endIndexOfFeature = handleExpressionIF({ Tokens, index: index + 1 })
      break
    default:
      const { type: actualTokenType } = Tokens[index]
      switch (actualTokenType) {
        case STRING:
          endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index: index + 1 })
          break
        case IDENTIFIER:
          endIndexOfFeature = handleExpressionOfIdentifier({ Tokens, index: index + 1 })
          break
        default:
          console.log('Erro')
          endIndexOfFeature = -1
      }
  }
  return endIndexOfFeature
}

function handleExpressionCase({ Tokens, index }){
  let endIndexOfCASE
  let endIndexOfOF
  let indexAux
  let endIndexOfExpressionCASECase

  endIndexOfCASE = handleExpressionGroup1({ Tokens, index: index })
  const { token } = Tokens[endIndexOfCASE]
  if (token === OF){
    let conditional = true
    indexAux = endIndexOfCASE + 1
    while (conditional){
      const { type: typeInsideTheOF } = Tokens[indexAux]
      if (typeInsideTheOF === IDENTIFIER){
        const { token: tokenInsideTheIdentifier } = Tokens[indexAux + 1]
        if (tokenInsideTheIdentifier === COLON){
          const { type: typeInsideTheColon } = Tokens[indexAux + 2]
          if (typeInsideTheColon === IDENTIFIER){
            const { type: typeInsideTheSecondIdentifier } = Tokens[indexAux + 3]
            if (typeInsideTheSecondIdentifier === IMPLICATION){
              endIndexOfOF = handleExpressionGroup1({ Tokens, index: indexAux + 4 })
              const { type: typeInsideTheFinishedOF } = Tokens[endIndexOfOF]
              if (typeInsideTheFinishedOF === SEMICOLON){
                const { token: tokenAfterSemicolon, type: typeAfterSemicolon } = Tokens[endIndexOfOF + 1]
                if (tokenAfterSemicolon === ESAC){
                  conditional = false
                  endIndexOfExpressionCASECase = endIndexOfOF + 2
                } else if (typeAfterSemicolon === IDENTIFIER){
                  indexAux = endIndexOfOF + 1
                } else {
                  conditional = false
                  console.log('Erro')
                  endIndexOfExpressionCASECase = -1
                }
              } else {
                conditional = false
                console.log('Erro')
                endIndexOfExpressionCASECase = -1
              }
            } else {
              conditional = false
              console.log('Erro')
              endIndexOfExpressionCASECase = -1
            }

          } else {
            conditional = false
            console.log('Erro')
            endIndexOfExpressionCASECase = -1
          }
        } else {
          conditional = false
          console.log('Erro')
          endIndexOfExpressionCASECase = -1
        }
      } else {
        conditional = false
        console.log('Erro')
        endIndexOfExpressionCASECase = -1
      }
    }
  } else {
    console.log('Erro')
    endIndexOfExpressionCASECase = -1
  }

  return endIndexOfExpressionCASECase
}

function handleExpressionLet({ Tokens, index }){
  let endIndexOfInsideTheLet
  let endIndexOfExpressionLETCase
  const { type } = Tokens[index]
  if (type === IDENTIFIER){
    const { token } = Tokens[index + 1]
    if (token === COLON){
      const { type } = Tokens[index + 2]
      if (type === IDENTIFIER){
        endIndexOfInsideTheLet = handleInsideTheLet({ Tokens, index: index + 3 })
        const { token } = Tokens[endIndexOfInsideTheLet]
        if (token === IN){
          endIndexOfExpressionLETCase = handleExpressionGroup1({ Tokens, index: endIndexOfInsideTheLet + 1 })
        } else {
          console.log('Erro')
          endIndexOfExpressionLETCase = -1
        }
      } else {
        console.log('Erro')
        endIndexOfExpressionLETCase = -1
      }
    } else {
      console.log('Erro')
      endIndexOfExpressionLETCase = -1
    }

  } else {
    console.log('Erro')
    endIndexOfExpressionLETCase = -1
  }

  return endIndexOfExpressionLETCase
}

function handleInsideTheLet({ Tokens, index }){
  let endIndexOfInsideTheLet = index
  const { token } = Tokens[index]
  switch (token) {
    case IN:
      endIndexOfInsideTheLet = index
      break
    case ASSIGNMENT:
      endIndexOfInsideTheLet = handleExpressionGroup1({ Tokens, index: index + 1 })
      // TODO verificar se não da problema aqui
      // eslint-disable-next-line no-fallthrough
    case COMMA:
      let conditional = true
      let auxIndex = endIndexOfInsideTheLet
      while (conditional){
        const { token } = Tokens[auxIndex]
        if (token === COMMA){
          const { type } = Tokens[auxIndex + 1]
          if (type === IDENTIFIER){
            const { token } = Tokens[auxIndex + 2]
            if (token === COLON){
              const { type } = Tokens[auxIndex + 3]
              if (type === IDENTIFIER){
                const { token } = Tokens[auxIndex + 4]
                switch (token) {
                  case ASSIGNMENT:
                    auxIndex = handleExpressionGroup1({ Tokens, index: index + 5 })
                    break
                  case IN:
                    endIndexOfInsideTheLet = index + 4
                    conditional = false
                    break
                  default:
                    console.log('Erro')
                    conditional = false
                    endIndexOfInsideTheLet = -1
                }

              } else {
                console.log('Erro')
                conditional = false
                endIndexOfInsideTheLet = -1
              }
            } else {
              console.log('Erro')
              conditional = false
              endIndexOfInsideTheLet = -1
            }
          } else {
            console.log('Erro')
            conditional = false
            endIndexOfInsideTheLet = -1
          }
        } else {
          conditional = false
          endIndexOfInsideTheLet = auxIndex
        }
      }
      break
    default:
      console.log('Erro')
      endIndexOfInsideTheLet = -1
  }

  return endIndexOfInsideTheLet
}

function handleExpressionWhile({ Tokens, index }){
  let endIndexOfWHILE
  let endIndexOfLOOP
  let endIndexOfExpressionWHILECase

  endIndexOfWHILE = handleExpressionGroup1({ Tokens, index: index })
  const { token } = Tokens[endIndexOfWHILE]
  if (token === LOOP){
    endIndexOfLOOP = handleExpressionGroup1({ Tokens, index: endIndexOfWHILE + 1 })
    const { token } = Tokens[endIndexOfLOOP]
    if (token === POOL){
      endIndexOfExpressionWHILECase = endIndexOfLOOP + 1
    } else {
      console.log('Erro')
      endIndexOfExpressionWHILECase = -1
    }
  } else {
    console.log('Erro')
    endIndexOfExpressionWHILECase = -1
  }

  return endIndexOfExpressionWHILECase
}

function handleExpressionIF({ Tokens, index }){
  let endIndexOfIF
  let endIndexOfTHEN
  let endIndexOfELSE
  let endIndexOfExpressionIFCase

  endIndexOfIF = handleExpressionGroup1({ Tokens, index: index })
  const { token } = Tokens[endIndexOfIF]
  if (token === THEN){
    endIndexOfTHEN = handleExpressionGroup1({ Tokens, index: endIndexOfIF + 1 })
    const { token } = Tokens[endIndexOfTHEN]
    if (token === ELSE){
      endIndexOfELSE = handleExpressionGroup1({ Tokens, index: endIndexOfTHEN + 1 })
      const { token } = Tokens[endIndexOfELSE]
      if (token === FI){
        endIndexOfExpressionIFCase = endIndexOfELSE + 1
      } else {
        console.log('Erro')
        endIndexOfExpressionIFCase = -1
      }
    } else {
      console.log('Erro')
      endIndexOfExpressionIFCase = -1
    }
  } else {
    console.log('Erro')
    endIndexOfExpressionIFCase = -1
  }

  return endIndexOfExpressionIFCase
}

function handleExpressionOfIdentifier({ Tokens, index }){
  let endIndexOfExpressionStartedWithID
  const { token } = Tokens[index]

  switch (token) {
    case ASSIGNMENT:
      endIndexOfExpressionStartedWithID = handleExpressionGroup1({ Tokens, index: index + 1 })
      break
    case OPEN_PARENTHESES:
      let conditional = true
      let indexAux = index + 1
      while (conditional){
        endIndexOfExpressionStartedWithID = handleExpressionGroup1({ Tokens, index: indexAux })
        const { token: tokenAfterExpression } = Tokens[endIndexOfExpressionStartedWithID]
        if (tokenAfterExpression !== COMMA){
          conditional = false
        } else {
          indexAux = endIndexOfExpressionStartedWithID + 1
        }
      }
      const { token: tokenAfterExpressionSequence } = Tokens[endIndexOfExpressionStartedWithID]
      if (tokenAfterExpressionSequence === CLOSE_PARENTHESES){
        endIndexOfExpressionStartedWithID = handleExpressionGroupBeta({ Tokens, index: endIndexOfExpressionStartedWithID + 1 })
      } else {
        console.log('Erro')
        endIndexOfExpressionStartedWithID = -1
      }
      break
    default:
      endIndexOfExpressionStartedWithID = handleExpressionGroupBeta({ Tokens, index: index + 1 })
  }
  return endIndexOfExpressionStartedWithID
}

function handleExpressionGroupBeta({ Tokens, index }){
  let endIndexOfExprBeta
  let endIndexOfCaseCallNewExpressionType1
  let indexAux = 1 + index
  const { token } = Tokens[index]
  switch (token){
    case EQUAL_SIGN:
      endIndexOfExprBeta = handleExpressionGroup1({ Tokens, index: indexAux })
      break
    case MINUS_SIGN:
      endIndexOfExprBeta = handleExpressionGroup1({ Tokens, index: indexAux })
      break
    case LESS_THAN_OR_EQUAL_SIGN:
      endIndexOfExprBeta = handleExpressionGroup1({ Tokens, index: indexAux })
      break
    case LESS_THAN_SIGN:
      endIndexOfExprBeta = handleExpressionGroup1({ Tokens, index: indexAux })
      break
    case DIVISION_SIGN:
      endIndexOfExprBeta = handleExpressionGroup1({ Tokens, index: indexAux })
      break
    case MULTIPLICATION_SIGN:
      endIndexOfExprBeta = handleExpressionGroup1({ Tokens, index: indexAux })
      break
    case PLUS_SIGN:
      endIndexOfExprBeta = handleExpressionGroup1({ Tokens, index: indexAux })
      break
    case AT_SIGN:
      const typeAtSign = Tokens[indexAux].type
      if (typeAtSign === IDENTIFIER){
        indexAux++
      } else {
        console.log('Erro')
        endIndexOfExprBeta = -1
        break
      }
      // eslint-disable-next-line no-fallthrough
    case DOT:
      const { type: typeAtDot } = Tokens[indexAux]
      if (typeAtDot === IDENTIFIER){
        const { token: tokenAtIdentifier } = Tokens[indexAux + 1]
        if (tokenAtIdentifier === OPEN_PARENTHESES){
          let conditional = true
          indexAux = indexAux + 2
          while (conditional){
            endIndexOfCaseCallNewExpressionType1 = handleExpressionGroup1({ Tokens, index: indexAux })
            const { token: tokenAtIdentifier } = Tokens[endIndexOfCaseCallNewExpressionType1]
            if (tokenAtIdentifier !== COMMA){
              conditional = false
            } else {
              indexAux = endIndexOfCaseCallNewExpressionType1 + 1
            }
          }
          endIndexOfCaseCallNewExpressionType1 = handleExpressionGroup1({ Tokens, index: endIndexOfCaseCallNewExpressionType1 })
          const { token: tokenAtEndOfThisCase } = Tokens[endIndexOfCaseCallNewExpressionType1]
          if (tokenAtEndOfThisCase === CLOSE_PARENTHESES){
            endIndexOfExprBeta = endIndexOfCaseCallNewExpressionType1 + 1
          } else {
            console.log('Erro')
            endIndexOfExprBeta = -1
          }
        } else {
          console.log('Erro')
          endIndexOfExprBeta = -1
        }
      } else {
        console.log('Erro')
        endIndexOfExprBeta = -1
      }
      break
    default:
      // CASE beta void
      endIndexOfExprBeta = indexAux

  }
  return endIndexOfExprBeta
}

export { auxiliaryParser }
