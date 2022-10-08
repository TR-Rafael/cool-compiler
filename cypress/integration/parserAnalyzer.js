import { lexiconAnalyzer } from '../support/auxiliaryLexicons'
import { auxiliaryParser } from '../support/auxiliaryParser'

const title = 'Parser analyzer'
// change the value of the `pathForFileInCOOL ` variable to the path of the file you want to compile.
// EX: 'cypress/fixtures/examples/helloWorld.cl'

const pathForFileInCOOL = 'cypress/fixtures/examples/helloWorld2.cl'
describe(title, () => {
  it(title, () => {
    cy.readFile(pathForFileInCOOL).then(async codeRaw => {
      console.log(codeRaw)
      cy.wrap(lexiconAnalyzer({ codeRaw })).then(async Tokens => {
        const result = await auxiliaryParser({
          Tokens ,
          index: 0
        })
        const message = result === 1? 'Passou na análise': 'Ta zikado o código primo'
        console.log(message)
      })
    })
  })
})
