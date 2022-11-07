import {
  RESERVED_WORDS,
  SPECIAL_CHARACTERS,
  OPERATORS,
  SPECIAL_NAMES
} from './constantObjects'

// eslint-disable-next-line import/namespace
import { SyntaticTree } from './syntacticTreeStructure'
const syntaticTree = new SyntaticTree()
syntaticTree.addNewClass({ oneNewClass: { a: 10 } })
syntaticTree.printMyTree()
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

// EX: auxPrintForDebug({ Tokens, index , extraInformation: 'phrase to help debug' })
function auxPrintForDebug({ Tokens, extraInformation= '' , index }){
  console.log(`Token: ${extraInformation}`, Tokens[index], 'index: ', index)
}

function auxPrintForError({ Tokens, index , session = 'Generic a' }){
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
        auxPrintForError({ Tokens, index: idx, session: 'Class switch' })
      }
      break
    default:
      const tokenOfDefault = Tokens[index].token
      switch (tokenOfDefault){
        case CLASS:
          return auxiliaryParser({ Tokens, index: index + 1, actualCase: CLASS })
        default:
          auxPrintForError({ Tokens,index , session: 'Class switch 2' })
          return auxiliaryParser({ Tokens, index: -1, actualCase: 'ERROR' })
      }
  }
}

async function handleClass({ Tokens, index }){
  let idxAfterInherits
  let indexOfEndClass
  const { type } = Tokens[index]
  if (type === IDENTIFIER) {
    let indexAux = index+1
    let conditional = true
    const { token } = Tokens[indexAux]
    switch (token){
      case INHERITS:
        idxAfterInherits = handleInherits({ Tokens, index: indexAux+1 })
        indexAux = idxAfterInherits
        while (conditional){
          indexAux = handleFeature({ Tokens, index: indexAux })
          const { token } = Tokens[indexAux]
          if (token === SEMICOLON){
            conditional = false
          }
        }

        indexOfEndClass = indexAux
        break
      case OPEN_BRACES:
        indexAux++
        while (conditional){
          indexAux = handleFeature({ Tokens, index: indexAux })
          const { token } = Tokens[indexAux]
          if (token === SEMICOLON){
            conditional = false
          }
        }
        indexOfEndClass = indexAux
        break
      default:
        auxPrintForError({ Tokens, index: indexAux , session: 'Inside handleClass - switch' })
        indexOfEndClass = -1
    }
  } else {
    auxPrintForError({ Tokens, index , session: 'Inside handleClass - else' })
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
      auxPrintForError({ Tokens, index: index + 1 , session: 'Inside handleInherits - 1' })
      endIndexOfInherits = -1
    }
  } else {
    auxPrintForError({ Tokens, index, session: 'Inside handleInherits - 2' })
    endIndexOfInherits = -1
  }
  return endIndexOfInherits
}

function handleFeature({ Tokens, index }){
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
        const localToken = Tokens[idxAfterColonCase].token
        if (localToken === SEMICOLON){
          idxAfterColonCase = idxAfterColonCase + 1
        }
        endIndexOfFeature = idxAfterColonCase
        break
      case OPEN_PARENTHESES:
        idxAfterOpenParenthesesCase = handleFeatureOpenParenthesesCase({ Tokens,index: index + 2 })
        idxAfterCloseParenthesesCase = handleFeatureAfterCloseParenthesesCase({ Tokens,index: idxAfterOpenParenthesesCase })
        const { token } = Tokens[idxAfterCloseParenthesesCase]
        if (token === CLOSE_BRACES){
          const { token } = Tokens[idxAfterCloseParenthesesCase + 1]
          if (token === SEMICOLON){
            endIndexOfFeature = idxAfterCloseParenthesesCase + 2
          } else {
            auxPrintForError({ Tokens, index: idxAfterCloseParenthesesCase + 1, session: 'Inside handleFeature - Else \';\'' })
            endIndexOfFeature = -1
          }
        } else {
          auxPrintForError({ Tokens, index: idxAfterCloseParenthesesCase , session: 'Inside handleFeature - Else \'}\' - 2' })
          endIndexOfFeature = -1
        }
        break
      default:
        auxPrintForError({ Tokens, index: index + 1 , session: 'Inside handleFeature - Default' })
        endIndexOfFeature = -1
    }
  } else {
    auxPrintForError({ Tokens, index , session: 'Inside handleFeature - Else out' })
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
      endIndexOfFeature = handleExtraFormals({ Tokens, index: index + 1 })
      const { token } = Tokens[endIndexOfFeature]
      if (token === CLOSE_PARENTHESES){
        endIndexOfFeature = endIndexOfFeature + 1
      } else {
        auxPrintForError({ Tokens, index: endIndexOfFeature, session: 'Inside handleFeatureOpenParenthesesCase - 1' })
        endIndexOfFeature = -1
      }
    } else {
      auxPrintForError({ Tokens, index: index + 1, session: 'Inside handleFeatureOpenParenthesesCase - 2' })
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
          auxPrintForError({ Tokens, index: index + 3 , session: 'Inside handleExtraFormals - 1' })
          endIndexOfFormal = -1
        }
      } else {
        // Formal case exit
        endIndexOfFormal = index + 2
      }
    } else {
      auxPrintForError({ Tokens, index: index + 1 , session: 'Inside handleExtraFormals - 2' })
      endIndexOfFormal = -1
    }
  } else {
    auxPrintForError({ Tokens, index , session: 'Inside handleExtraFormals - 3' })
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
        endIndexOfExpressionGroup1 = handleExpressionGroupBeta({ Tokens, index: endIndexOfExpressionGroup1 })
        endIndexOfFeature = endIndexOfExpressionGroup1
      } else {
        auxPrintForError({ Tokens, index: index + 2 , session: 'Inside handleFeatureAfterCloseParenthesesCase - 1' })
        endIndexOfFeature = -1
      }
    } else {
      auxPrintForError({ Tokens, index: index + 1 , session: 'Inside handleFeatureAfterCloseParenthesesCase - 2' })
      endIndexOfFeature = -1
    }
  } else {
    auxPrintForError({ Tokens, index , session: 'Inside handleFeatureAfterCloseParenthesesCase - 3' })
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
    if (token === SEMICOLON){
      endIndexOfFeature = index + 2
    } else if (token === ASSIGNMENT) {
      endIndexOfExpressionGroup1 = handleExpressionGroup1({ Tokens, index: index + 2 })
      endIndexOfExpressionGroup1 = handleExpressionGroupBeta({ Tokens, index: endIndexOfExpressionGroup1 })
      endIndexOfFeature = endIndexOfExpressionGroup1
    } else {
      endIndexOfFeature = index + 1
    }
  } else {
    auxPrintForError({ Tokens, index, session: 'Inside handleFeatureColonCase' })
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
      if (!isNaN(token)){
        endIndexOfFeature = index + 1
      } else {
        endIndexOfFeature = handleExpressionOfIdentifier({ Tokens, index: index + 1 })
        endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index: endIndexOfFeature })
      }
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
            auxPrintForError({ Tokens, index: index + 1, session: 'Inside GroupExpression1 - NEW' })
            endIndexOfFeature = -1
          }
          break

        case ISVOID:
          endIndexOfFeature = handleExpressionGroup1({ Tokens, index: index + 1 })
          endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index: endIndexOfFeature })
          break

        case NOT:
          endIndexOfFeature = handleExpressionGroup1({ Tokens, index: index + 1 })
          endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index: endIndexOfFeature })
          break

        case TILDE:
          endIndexOfFeature = handleExpressionGroup1({ Tokens, index: index + 1 })
          endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index: endIndexOfFeature })
          break

        case OPEN_PARENTHESES:
          const { token: tokenAfterOpenParentheses } = Tokens[index + 1]
          if (tokenAfterOpenParentheses === CLOSE_PARENTHESES){
            endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index: index + 2 })
          } else {
            let conditional = true
            endIndexOfFeature = index + 1
            while (conditional){
              endIndexOfFeature = handleExpressionGroup1({ Tokens, index: endIndexOfFeature })
              endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index: endIndexOfFeature })

              const { token } = Tokens[endIndexOfFeature]

              if (token === CLOSE_PARENTHESES){
                endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index: endIndexOfFeature + 1 })
                conditional = false
              } else if (token === COMMA){
                endIndexOfFeature++
              } else {
                auxPrintForError({ Tokens, index: endIndexOfFeature, session: 'Inside GroupExpression1 - OPEN_PARENTHESES' })
                endIndexOfFeature = -1
                conditional = false
              }
            }
          }
          break

        case OPEN_BRACES:
          let conditional = true
          let indexAux = index + 1
          while (conditional){
            indexAux = handleExpressionGroup1({ Tokens, index: indexAux })
            indexAux = handleExpressionGroupBeta({ Tokens, index: indexAux })

            const { token: endOfExpressionToken } = Tokens[indexAux]

            if (endOfExpressionToken === SEMICOLON){
              const { token: endOfExpressionToken } = Tokens[indexAux + 1]
              if (endOfExpressionToken === CLOSE_BRACES){
                conditional = false
                indexAux = indexAux + 2
              } else {
                indexAux++
              }
            } else {
              conditional = false
              auxPrintForError({ Tokens, index: indexAux , session: 'Inside GroupExpression1 - OPEN_BRACES' })
            }
          }
          indexAux = handleExpressionGroupBeta({ Tokens, index: indexAux })
          endIndexOfFeature = indexAux
          break

        case CASE:
          endIndexOfFeature = handleExpressionCase({ Tokens, index: index + 1 })
          endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index: endIndexOfFeature })
          break

        case LET:
          endIndexOfFeature = handleExpressionLet({ Tokens, index: index + 1 })
          endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index: endIndexOfFeature })

          break

        case WHILE:
          endIndexOfFeature = handleExpressionWhile({ Tokens, index: index + 1 })
          endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index: endIndexOfFeature })

          break

        case IF:
          endIndexOfFeature = handleExpressionIF({ Tokens, index: index + 1 })
          endIndexOfFeature = handleExpressionGroupBeta({ Tokens, index: endIndexOfFeature })

          break

        default:
          auxPrintForError({ Tokens, index , session: 'Inside GroupExpression1 - Generic' })
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
  endIndexOfCASE = handleExpressionGroup1({ Tokens, index })
  endIndexOfCASE = handleExpressionGroupBeta({ Tokens, index: endIndexOfCASE })
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
            const { token: tokenInsideTheSecondIdentifier } = Tokens[indexAux + 3]
            if (tokenInsideTheSecondIdentifier === IMPLICATION){
              endIndexOfOF = handleExpressionGroup1({ Tokens, index: indexAux + 4 })
              endIndexOfOF = handleExpressionGroupBeta({ Tokens, index: endIndexOfOF })
              const { token: tokenInsideTheFinishedOF } = Tokens[endIndexOfOF]
              if (tokenInsideTheFinishedOF === SEMICOLON){
                const { token: tokenAfterSemicolon, type: typeAfterSemicolon } = Tokens[endIndexOfOF + 1]
                if (tokenAfterSemicolon === ESAC){
                  conditional = false
                  endIndexOfExpressionCASECase = endIndexOfOF + 2
                } else if (typeAfterSemicolon === IDENTIFIER){
                  indexAux = endIndexOfOF + 1
                } else {
                  conditional = false
                  auxPrintForError({ Tokens, index: endIndexOfOF + 1, session: 'Case - ESAC or IDENTIFIER - 3' })
                  endIndexOfExpressionCASECase = -1
                }
              } else {
                conditional = false
                auxPrintForError({ Tokens, index: endIndexOfOF, session: 'Case - SEMICOLON' })
                endIndexOfExpressionCASECase = -1
              }
            } else {
              conditional = false
              auxPrintForError({ Tokens, index: indexAux + 3 , session: 'Case - IMPLICATION' })
              endIndexOfExpressionCASECase = -1
            }

          } else {
            conditional = false
            auxPrintForError({ Tokens, index: indexAux + 2, session: 'Case - IDENTIFIER - 2' })
            endIndexOfExpressionCASECase = -1
          }
        } else {
          conditional = false
          auxPrintForError({ Tokens, index: indexAux + 1, session: 'Case - COLON' })
          endIndexOfExpressionCASECase = -1
        }
      } else {
        conditional = false
        auxPrintForError({ Tokens, index: indexAux, session: 'Case - IDENTIFIER - 1' })
        endIndexOfExpressionCASECase = -1
      }
    }
  } else {
    auxPrintForError({ Tokens, index: endIndexOfCASE, session: 'Case - OF' })
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
          endIndexOfExpressionLETCase = handleExpressionGroupBeta({ Tokens, index: endIndexOfExpressionLETCase })
        } else {
          auxPrintForError({ Tokens, index: endIndexOfInsideTheLet, session: 'Inside handleExpressionLet - 1' })
          endIndexOfExpressionLETCase = -1
        }
      } else {
        auxPrintForError({ Tokens, index: index + 2 , session: 'Inside handleExpressionLet - 2' })
        endIndexOfExpressionLETCase = -1
      }
    } else {
      auxPrintForError({ Tokens, index: index + 1 , session: 'Inside handleExpressionLet - 3' })
      endIndexOfExpressionLETCase = -1
    }

  } else {
    auxPrintForError({ Tokens, index, session: 'Inside handleExpressionLet - OUT' })
    endIndexOfExpressionLETCase = -1
  }

  return endIndexOfExpressionLETCase
}

function handleInsideTheLet({ Tokens, index }){
  let endIndexOfInsideTheLet = index
  const { token } = Tokens[index]
  let conditional = true
  switch (token) {
    case IN:
      endIndexOfInsideTheLet = index
      break
    case ASSIGNMENT:
      endIndexOfInsideTheLet = handleExpressionGroup1({ Tokens, index: endIndexOfInsideTheLet + 1 })
      endIndexOfInsideTheLet = handleExpressionGroupBeta({ Tokens, index: endIndexOfInsideTheLet })
      while (conditional){
        const { token } = Tokens[endIndexOfInsideTheLet]
        if (token === COMMA){
          const { type } = Tokens[endIndexOfInsideTheLet + 1]
          if (type === IDENTIFIER){
            const { token } = Tokens[endIndexOfInsideTheLet + 2]
            if (token === COLON){
              const { type } = Tokens[endIndexOfInsideTheLet + 3]
              if (type === IDENTIFIER){
                const { token } = Tokens[endIndexOfInsideTheLet + 4]
                switch (token) {
                  case ASSIGNMENT:
                    endIndexOfInsideTheLet = handleExpressionGroup1({ Tokens, index: endIndexOfInsideTheLet + 5 })
                    endIndexOfInsideTheLet = handleExpressionGroupBeta({ Tokens, index: endIndexOfInsideTheLet })
                    conditional = true
                    break
                  case IN:
                    endIndexOfInsideTheLet = endIndexOfInsideTheLet + 4
                    conditional = false
                    break
                  default:
                    auxPrintForError({ Tokens, index: endIndexOfInsideTheLet + 4 , session: 'Inside handleInsideTheLet - ASSIGNMENT - 1' })
                    conditional = false
                    endIndexOfInsideTheLet = -1
                }
              } else {
                auxPrintForError({ Tokens, index: endIndexOfInsideTheLet + 3 , session: 'Inside handleInsideTheLet - ASSIGNMENT- 2' })
                conditional = false
                endIndexOfInsideTheLet = -1
              }
            } else {
              auxPrintForError({ Tokens, index: endIndexOfInsideTheLet + 2 , session: 'Inside handleInsideTheLet - ASSIGNMENT - 3' })
              conditional = false
              endIndexOfInsideTheLet = -1
            }
          } else {
            auxPrintForError({ Tokens, index: endIndexOfInsideTheLet + 1, session: 'Inside handleInsideTheLet - ASSIGNMENT - 4' })
            conditional = false
            endIndexOfInsideTheLet = -1
          }
        } else if (token === IN){
          conditional = false
        } else {
          auxPrintForError({ Tokens, index: endIndexOfInsideTheLet, session: 'Inside handleInsideTheLet - ASSIGNMENT - 0' })
          conditional = false
          endIndexOfInsideTheLet = -1
        }
      }
      break
    case COMMA:
      while (conditional){
        const { token } = Tokens[endIndexOfInsideTheLet]
        if (token === COMMA){
          const { type } = Tokens[endIndexOfInsideTheLet + 1]
          if (type === IDENTIFIER){
            const { token } = Tokens[endIndexOfInsideTheLet + 2]
            if (token === COLON){
              const { type } = Tokens[endIndexOfInsideTheLet + 3]
              if (type === IDENTIFIER){
                const { token } = Tokens[endIndexOfInsideTheLet + 4]
                switch (token) {
                  case ASSIGNMENT:
                    endIndexOfInsideTheLet = handleExpressionGroup1({ Tokens, index: endIndexOfInsideTheLet + 5 })
                    endIndexOfInsideTheLet = handleExpressionGroupBeta({ Tokens, index: endIndexOfInsideTheLet })
                    conditional = true
                    break
                  case IN:
                    endIndexOfInsideTheLet = endIndexOfInsideTheLet + 4
                    conditional = false
                    break
                  default:
                    auxPrintForError({ Tokens, index: endIndexOfInsideTheLet + 4 , session: 'Inside handleInsideTheLet - COMMA - 1' })
                    conditional = false
                    endIndexOfInsideTheLet = -1
                }
              } else {
                auxPrintForError({ Tokens, index: endIndexOfInsideTheLet + 3 , session: 'Inside handleInsideTheLet - COMMA - 2' })
                conditional = false
                endIndexOfInsideTheLet = -1
              }
            } else {
              auxPrintForError({ Tokens, index: endIndexOfInsideTheLet + 2 , session: 'Inside handleInsideTheLet - COMMA - 3' })
              conditional = false
              endIndexOfInsideTheLet = -1
            }
          } else {
            auxPrintForError({ Tokens, index: endIndexOfInsideTheLet + 1, session: 'Inside handleInsideTheLet - COMMA - 4' })
            conditional = false
            endIndexOfInsideTheLet = -1
          }
        } else if (token === IN){
          conditional = false
        } else {
          auxPrintForError({ Tokens, index: endIndexOfInsideTheLet, session: 'Inside handleInsideTheLet - COMMA - 0' })
          conditional = false
          endIndexOfInsideTheLet = -1
        }
      }
      break
    default:
      auxPrintForError({ Tokens, endIndexOfInsideTheLet, session: 'Inside handleInsideTheLet - GERAL' })
      endIndexOfInsideTheLet = -1
  }

  return endIndexOfInsideTheLet
}

function handleExpressionWhile({ Tokens, index }){
  let endIndexOfWHILE
  let endIndexOfLOOP
  let endIndexOfExpressionWHILECase

  endIndexOfWHILE = handleExpressionGroup1({ Tokens, index: index })
  endIndexOfWHILE = handleExpressionGroupBeta({ Tokens, index: endIndexOfWHILE })

  const { token } = Tokens[endIndexOfWHILE]
  if (token === LOOP){
    endIndexOfLOOP = handleExpressionGroup1({ Tokens, index: endIndexOfWHILE + 1 })
    endIndexOfLOOP = handleExpressionGroupBeta({ Tokens, index: endIndexOfLOOP })
    const { token } = Tokens[endIndexOfLOOP]
    if (token === POOL){
      endIndexOfExpressionWHILECase = endIndexOfLOOP + 1
    } else {
      auxPrintForError({ Tokens, index: endIndexOfLOOP , session: 'Inside WHILE - POOL' })
      endIndexOfExpressionWHILECase = -1
    }
  } else {
    auxPrintForError({ Tokens, index: endIndexOfWHILE, session: 'Inside WHILE - LOOP' })
    endIndexOfExpressionWHILECase = -1
  }

  return endIndexOfExpressionWHILECase
}

function handleExpressionIF({ Tokens, index }){
  let endIndexOfIF
  let endIndexOfTHEN
  let endIndexOfELSE
  let endIndexOfExpressionIFCase
  endIndexOfIF = handleExpressionGroup1({ Tokens, index })
  endIndexOfIF = handleExpressionGroupBeta({ Tokens, index: endIndexOfIF })
  const { token } = Tokens[endIndexOfIF]
  if (token === THEN){
    endIndexOfTHEN = handleExpressionGroup1({ Tokens, index: endIndexOfIF + 1 })
    endIndexOfTHEN = handleExpressionGroupBeta({ Tokens, index: endIndexOfTHEN })
    const { token } = Tokens[endIndexOfTHEN]
    if (token === ELSE){
      endIndexOfELSE = handleExpressionGroup1({ Tokens, index: endIndexOfTHEN + 1 })
      endIndexOfELSE = handleExpressionGroupBeta({ Tokens, index: endIndexOfELSE })
      const { token } = Tokens[endIndexOfELSE]
      if (token === FI){
        endIndexOfExpressionIFCase = endIndexOfELSE + 1
      } else {
        auxPrintForError({ Tokens, index: endIndexOfELSE , session: 'Inside IF expression - FI' })
        endIndexOfExpressionIFCase = -1
      }
    } else {
      auxPrintForError({ Tokens, index: endIndexOfTHEN, session: 'Inside IF expression - ELSE' })
      endIndexOfExpressionIFCase = -1
    }
  } else {
    auxPrintForError({ Tokens, index: endIndexOfIF, session: 'Inside IF expression - THEN' })
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
      endIndexOfExpressionStartedWithID = handleExpressionGroupBeta({ Tokens, index: endIndexOfExpressionStartedWithID })
      break
    case COMMA:
      endIndexOfExpressionStartedWithID = index
      break
    case OPEN_PARENTHESES:
      let indexAux = index + 1
      indexAux = handleExpressionGroup1({ Tokens, index })
      endIndexOfExpressionStartedWithID = handleExpressionGroupBeta({ Tokens, index: indexAux })
      break
    default:
      endIndexOfExpressionStartedWithID = handleExpressionGroupBeta({ Tokens, index })
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
      endIndexOfExprBeta = handleExpressionGroupBeta({ Tokens, index: endIndexOfExprBeta })
      break
    case MINUS_SIGN:
      endIndexOfExprBeta = handleExpressionGroup1({ Tokens, index: indexAux })
      endIndexOfExprBeta = handleExpressionGroupBeta({ Tokens, index: endIndexOfExprBeta })
      break
    case LESS_THAN_OR_EQUAL_SIGN:
      endIndexOfExprBeta = handleExpressionGroup1({ Tokens, index: indexAux })
      endIndexOfExprBeta = handleExpressionGroupBeta({ Tokens, index: endIndexOfExprBeta })

      break
    case LESS_THAN_SIGN:
      endIndexOfExprBeta = handleExpressionGroup1({ Tokens, index: indexAux })
      endIndexOfExprBeta = handleExpressionGroupBeta({ Tokens, index: endIndexOfExprBeta })

      break
    case DIVISION_SIGN:
      endIndexOfExprBeta = handleExpressionGroup1({ Tokens, index: indexAux })
      endIndexOfExprBeta = handleExpressionGroupBeta({ Tokens, index: endIndexOfExprBeta })

      break
    case MULTIPLICATION_SIGN:
      endIndexOfExprBeta = handleExpressionGroup1({ Tokens, index: indexAux })
      endIndexOfExprBeta = handleExpressionGroupBeta({ Tokens, index: endIndexOfExprBeta })

      break
    case PLUS_SIGN:
      endIndexOfExprBeta = handleExpressionGroup1({ Tokens, index: indexAux })
      endIndexOfExprBeta = handleExpressionGroupBeta({ Tokens, index: endIndexOfExprBeta })
      break
    case AT_SIGN:
      const typeAtSign = Tokens[indexAux].type
      if (typeAtSign === IDENTIFIER){
        endIndexOfExprBeta = handleExpressionGroup1({ Tokens, index: indexAux })
        endIndexOfExprBeta = handleExpressionGroupBeta({ Tokens, index: endIndexOfExprBeta })
      } else {
        auxPrintForError({ Tokens, index: indexAux, session: 'AT_SIGN - @ - handleExpressionGroupBeta' })
        endIndexOfExprBeta = -1
        break
      }
    case DOT:
      const { type: typeAtDot } = Tokens[indexAux]

      if (typeAtDot === IDENTIFIER){
        endIndexOfExprBeta = handleExpressionOfIdentifier({ Tokens, index: indexAux + 1 })
        endIndexOfExprBeta = handleExpressionGroupBeta({ Tokens, index: endIndexOfExprBeta })
      } else {
        auxPrintForError({ Tokens, index: indexAux, session: 'Inside DOT expression beta' })
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
