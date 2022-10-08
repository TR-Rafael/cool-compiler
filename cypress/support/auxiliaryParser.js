import {
  RESERVED_WORDS,
  SPECIAL_CHARACTERS,
  OPERATORS,
  SPECIAL_NAMES
} from './constantObjects'


const {
  IDENTIFIER,
  STRING
} = SPECIAL_NAMES

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

function auxPrintForDebug({ Tokens, extraInformation= '' , index }){
  console.log(`Token: ${extraInformation}`, Tokens[index], 'index: ', index)
}

function auxPrintForError({ Tokens, index , session = 'Generic' }){
  console.log('Erro no token: ', Tokens[index], 'index: ', index, session)
}


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
        auxPrintForError({ Tokens, index: idx })
      }
      break
    default:
      const tokenOfDefault = Tokens[index].token
      switch (tokenOfDefault){
        case CLASS:
          return auxiliaryParser({ Tokens, index: index + 1, actualCase: CLASS })
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
        idxAfterFeature = await handleFeature({ Tokens, index: index + 2 })
        indexOfEndClass = idxAfterFeature
        break
      default:
        auxPrintForError({ Tokens, index: index +1 })
        indexOfEndClass = -1
    }
  } else {
    auxPrintForError({ Tokens, index })
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
      endIndexOfInherits = index + 2
    } else {
      auxPrintForError({ Tokens, index: index + 1 })
      endIndexOfInherits = -1
    }
  } else {
    auxPrintForError({ Tokens, index })
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
          const { token } = Tokens[idxAfterCloseParenthesesCase + 1]
          if (token === SEMICOLON){
            const { token } = Tokens[idxAfterCloseParenthesesCase + 2]
            if (token === CLOSE_BRACES){
              endIndexOfFeature = idxAfterCloseParenthesesCase + 3
            } else {
              auxPrintForError({ Tokens, index: idxAfterCloseParenthesesCase + 2 })
              endIndexOfFeature = -1
            }
          } else {
            auxPrintForError({ Tokens, index: idxAfterCloseParenthesesCase + 1 })
            endIndexOfFeature = -1
          }
        } else {
          auxPrintForError({ Tokens, index: idxAfterCloseParenthesesCase })
          endIndexOfFeature = -1
        }
        break
      default:
        auxPrintForError({ Tokens, index: index + 1 })
        endIndexOfFeature = -1
    }
  } else {
    auxPrintForError({ Tokens, index })
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
      auxPrintForError({ Tokens, index: index + 1 })
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
          auxPrintForError({ Tokens, index: index + 3 })
          endIndexOfFormal = -1
        }
      } else {
        // Formal case exit
        endIndexOfFormal = index + 2
      }
    } else {
      auxPrintForError({ Tokens, index: index + 1 })
      endIndexOfFormal = -1
    }
  } else {
    auxPrintForError({ Tokens, index })
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
        endIndexOfExpressionGroup1 = handleExpressionGroup1({ Tokens, index: index + 3 })
        endIndexOfFeature = endIndexOfExpressionGroup1
      } else {
        auxPrintForError({ Tokens, index: index + 2 })
        endIndexOfFeature = -1
      }
    } else {
      auxPrintForError({ Tokens, index: index + 1 })
      endIndexOfFeature = -1
    }
  } else {
    auxPrintForError({ Tokens, index })
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
    auxPrintForError({ Tokens, index })
    endIndexOfFeature = -1
  }
  return endIndexOfFeature
}

function handleExpressionGroup1({ Tokens, index }){
  let endIndexOfFeature
  const { token, type } = Tokens[index]
  switch (type) {
    case STRING:
      endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index: index + 1 })
      break
    case IDENTIFIER:
      endIndexOfFeature = handleExpressionOfIdentifier({ Tokens, index: index + 1 })
      break
    default:
      switch (token){
        // Beta group start
        case EQUAL_SIGN:
          endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index })
          break
        
        case MINUS_SIGN:
          endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index })
          break

        case LESS_THAN_OR_EQUAL_SIGN:
          endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index })
          break

        case LESS_THAN_SIGN:
          endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index })
          break

        case DIVISION_SIGN:
          endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index })
          break

        case MULTIPLICATION_SIGN:
          endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index })
          break

        case PLUS_SIGN:
          endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index })
          break

        case AT_SIGN:
          endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index })
          break

        case DOT:
          endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index })
          break
        // Beta group end
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
            auxPrintForError({ Tokens, index: index + 1 })
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
            endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index: endIndexOfFeature + 1 })
          } else {
            auxPrintForError({ Tokens, index: endIndexOfFeature })
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
                indexAux = handleExpressionGroupBeta({ Tokens, index: indexAux + 2 })
              } else {
                indexAux++
              }
            } else {
              conditional = false
              auxPrintForError({ Tokens, index: indexAux })
            }
          }
          endIndexOfFeature = indexAux
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
          auxPrintForError({ Tokens, index })
          endIndexOfFeature = -1
          // const { type: actualTokenType } = Tokens[index]
          // switch (actualTokenType) {
          //   case STRING:
          //     endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index: index + 1 })
          //     break
          //   case IDENTIFIER:
          //     endIndexOfFeature = handleExpressionOfIdentifier({ Tokens, index: index + 1 })
          //     break
          //   default:
          // auxPrintForError({ Tokens, index })
          // endIndexOfFeature = -1
          // }
      }
  }

  return endIndexOfFeature
}

function handleExpressionCase({ Tokens, index }){
  let endIndexOfCASE
  let endIndexOfOF
  let indexAux
  let endIndexOfExpressionCASECase

  endIndexOfCASE = handleExpressionGroup1({ Tokens, index })
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
                  auxPrintForError({ Tokens, index: endIndexOfOF + 1 })
                  endIndexOfExpressionCASECase = -1
                }
              } else {
                conditional = false
                auxPrintForError({ Tokens, index: endIndexOfOF })
                endIndexOfExpressionCASECase = -1
              }
            } else {
              conditional = false
              auxPrintForError({ Tokens, index: indexAux + 3 })
              endIndexOfExpressionCASECase = -1
            }

          } else {
            conditional = false
            auxPrintForError({ Tokens, index: indexAux + 2 })
            endIndexOfExpressionCASECase = -1
          }
        } else {
          conditional = false
          auxPrintForError({ Tokens, index: indexAux + 1 })
          endIndexOfExpressionCASECase = -1
        }
      } else {
        conditional = false
        auxPrintForError({ Tokens, index: indexAux })
        endIndexOfExpressionCASECase = -1
      }
    }
  } else {
    auxPrintForError({ Tokens, index: endIndexOfCASE })
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
          auxPrintForError({ Tokens, index: endIndexOfInsideTheLet })
          endIndexOfExpressionLETCase = -1
        }
      } else {
        auxPrintForError({ Tokens, index: index + 2 })
        endIndexOfExpressionLETCase = -1
      }
    } else {
      auxPrintForError({ Tokens, index: index + 1 })
      endIndexOfExpressionLETCase = -1
    }

  } else {
    auxPrintForError({ Tokens, index })
    endIndexOfExpressionLETCase = -1
  }

  return endIndexOfExpressionLETCase
}

function handleInsideTheLet({ Tokens, index }){
  let endIndexOfInsideTheLet = index
  const { token } = Tokens[index]
  let conditionalForAssigment = true
  switch (token) {
    case IN:
      endIndexOfInsideTheLet = index
      break
    case ASSIGNMENT:
      endIndexOfInsideTheLet = handleExpressionGroup1({ Tokens, index: index + 1 })

      let auxIndexForAssigment = endIndexOfInsideTheLet
      while (conditionalForAssigment){
        const { token } = Tokens[auxIndexForAssigment]
        if (token === COMMA){
          const { type } = Tokens[auxIndexForAssigment + 1]
          if (type === IDENTIFIER){
            const { token } = Tokens[auxIndexForAssigment + 2]
            if (token === COLON){
              const { type } = Tokens[auxIndexForAssigment + 3]
              if (type === IDENTIFIER){
                const { token } = Tokens[auxIndexForAssigment + 4]
                switch (token) {
                  case ASSIGNMENT:
                    auxIndexForAssigment = handleExpressionGroup1({ Tokens, index: auxIndexForAssigment + 5 })
                    conditionalForAssigment = true
                    break
                  case IN:
                    auxIndexForAssigment = auxIndexForAssigment + 4
                    conditionalForAssigment = false
                    break
                  default:
                    auxPrintForError({ Tokens, index: auxIndexForAssigment + 4 })
                    conditionalForAssigment = false
                    auxIndexForAssigment = -1
                }
              } else {
                auxPrintForError({ Tokens, index: auxIndexForAssigment + 3 })
                conditionalForAssigment = false
                auxIndexForAssigment = -1
              }
            } else {
              auxPrintForError({ Tokens, index: auxIndexForAssigment + 2 })
              conditionalForAssigment = false
              auxIndexForAssigment = -1
            }
          } else {
            auxPrintForError({ Tokens, index: auxIndexForAssigment + 1 })
            conditionalForAssigment = false
            auxIndexForAssigment = -1
          }
        } else {
          conditionalForAssigment = false
        }
      }

      endIndexOfInsideTheLet = auxIndexForAssigment
      break
    case COMMA:
      let conditional = false
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
                    auxIndex = handleExpressionGroup1({ Tokens, index: auxIndex + 5 })
                    break
                  case IN:
                    auxIndex = auxIndex + 4
                    conditional = false
                    break
                  default:
                    auxPrintForError({ Tokens, index: auxIndex + 4 })
                    conditional = false
                    auxIndex = -1
                }
              } else {
                auxPrintForError({ Tokens, index: auxIndex + 3 })
                conditional = false
                auxIndex = -1
              }
            } else {
              auxPrintForError({ Tokens, index: auxIndex + 2 })
              conditional = false
              auxIndex = -1
            }
          } else {
            auxPrintForError({ Tokens, index: auxIndex + 1 })
            conditional = false
            auxIndex = -1
          }
        } else {
          conditional = false
        }
      }
      endIndexOfInsideTheLet = auxIndex
      break
    default:
      auxPrintForError({ Tokens, index })
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
      auxPrintForError({ Tokens, index: endIndexOfLOOP })
      endIndexOfExpressionWHILECase = -1
    }
  } else {
    auxPrintForError({ Tokens, index: endIndexOfWHILE })
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
        auxPrintForError({ Tokens, index: endIndexOfELSE })
        endIndexOfExpressionIFCase = -1
      }
    } else {
      auxPrintForError({ Tokens, index: endIndexOfTHEN })
      endIndexOfExpressionIFCase = -1
    }
  } else {
    auxPrintForError({ Tokens, index: endIndexOfIF })
    endIndexOfExpressionIFCase = -1
  }

  return endIndexOfExpressionIFCase
}

function handleExpressionOfIdentifier({ Tokens, index }){
  let endIndexOfExpressionStartedWithID
  const { token } = Tokens[index]
  switch (token) {
    case DOT:
      endIndexOfExpressionStartedWithID = handleExpressionGroupBeta({ Tokens, index })
      break
    case ASSIGNMENT:
      endIndexOfExpressionStartedWithID = handleExpressionGroup1({ Tokens, index: index + 1 })
      break
    case OPEN_PARENTHESES:
      let conditional = true
      let indexAux = index + 1
      while (conditional){
        const { token: tokenAfterExpression } = Tokens[indexAux]
        if (tokenAfterExpression === CLOSE_PARENTHESES){
          conditional = false
          break
        }
        indexAux = handleExpressionGroup1({ Tokens, index: indexAux })
        if (tokenAfterExpression === CLOSE_PARENTHESES){
          conditional = false
        } else if (tokenAfterExpression === COMMA){
          indexAux++
        } else {
          conditional = false
        }
      }
      endIndexOfExpressionStartedWithID = handleExpressionGroupBeta({ Tokens, index: indexAux + 1 })
      break
    default:
      endIndexOfExpressionStartedWithID = handleExpressionGroupBeta({ Tokens, index: index })

  }
  return endIndexOfExpressionStartedWithID
}

function handleExpressionGroupBeta({ Tokens, index }){
  let endIndexOfExprBeta
  let indexAux = index + 1
  const { token , type } = Tokens[index]
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
        auxPrintForError({ Tokens, index: indexAux })
        endIndexOfExprBeta = -1
        break
      }
      // eslint-disable-next-line no-fallthrough
    case DOT:
      const { type: typeAtDot } = Tokens[indexAux]
      if (typeAtDot === IDENTIFIER){
        endIndexOfExprBeta = handleExpressionGroup1({ Tokens, index: indexAux })
      } else {
        auxPrintForError({ Tokens, index: indexAux })
        endIndexOfExprBeta = -1
      }
      break
    default:
      if (type === IDENTIFIER){
        endIndexOfExprBeta = indexAux
      } else {
        endIndexOfExprBeta = index
      }

  }
  return endIndexOfExprBeta
}

export { auxiliaryParser }
