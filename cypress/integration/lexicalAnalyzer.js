import {tokenFilter} from '../support/auxiliaryLexicons'

const title = 'Lexical analyzer'
// change the value of the `pathForFileInCOOL ` variable to the path of the file you want to compile.
// EX: 'cypress/fixtures/examples/helloWorld.cl'

const pathForFileInCOOL = 'cypress/fixtures/examples/helloWorld.cl'
// TODO fix handling for block comment and improve logic of logical comparisons
describe(title, () => {
    it(title, () => {
      cy.readFile(pathForFileInCOOL).then(code => {
          const tokens = tokenFilter(code)
          console.log(tokens)
      })
    })
})
