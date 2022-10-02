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
  CLOSE_BRACES,
  CLOSE_PARENTHESES,
  COLON,
  COMMA,
  OPEN_BRACES,
  OPEN_PARENTHESES,
  SEMICOLON
} = SPECIAL_CHARACTERS

const {
  ASSIGNMENT,
  EQUAL_SIGN,
  LESS_THAN_SIGN,
  MINUS_SIGN,
  MULTIPLICATION_SIGN
} = OPERATORS

const {
  CLASS,
  INHERITS
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

function handleExpressionGroup1({ Tokens, index }){
  let endIndexOfFeature
  const { token } = Tokens[index]
  if (token){
    // Lógica aqui para o caso de hello mundo
    console.log('Não ta pronto')
    return 1
  } else {
    console.log('Erro')
    endIndexOfFeature = -1
  }
  return endIndexOfFeature
}

export { auxiliaryParser }
