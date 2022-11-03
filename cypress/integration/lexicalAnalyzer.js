import { lexiconAnalyzer } from '../support/auxiliaryLexicons'

const title = 'Lexical analyzer'
// change the value of the `pathForFileInCOOL ` variable to the path of the file you want to compile.
// EX: 'cypress/fixtures/examples/helloWorld.cl'

const pathForFileInCOOL = 'cypress/fixtures/examples/hs.cl'
describe(title, () => {
  it(title, () => {
    console.log(pathForFileInCOOL.split('/').slice(-1)[0])
    cy.readFile(pathForFileInCOOL).then(codeRaw => {
      console.log(codeRaw)
      const tokens = lexiconAnalyzer({ codeRaw })
      console.log(tokens)
    })
  })
})
