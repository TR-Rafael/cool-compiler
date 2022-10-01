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
  OPEN_BRACES,
  OPEN_PARENTHESES,
  SEMICOLON
} = SPECIAL_CHARACTERS

const {
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
  const { token, type } = Tokens[index]

  if (token === CLOSE_BRACES){
    endIndexOfFeature = index + 1
  } else if (type === IDENTIFIER) {
    // TODO AQUI vai ser as variações de Features
    const { token } = Tokens[index + 1]
    switch (token){
      case INHERITS:
        // TODO temporario
        endIndexOfFeature = -1
        break
      case OPEN_BRACES:
        // TODO temporario
        endIndexOfFeature = -1
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

export { auxiliaryParser }
