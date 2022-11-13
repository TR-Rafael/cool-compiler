class ClassNode{
  initialToken
  classFeatures = []
  myInherits
  IdentifierOfClass

  constructor({ InitialNode }){
    this.initialToken = InitialNode
  }

  addFeatureNode({ newFeature }){
    this.classFeatures.push(new FeatureNode({ InitialNode: newFeature }))
    return this.classFeatures.length - 1
  }

  addInherits({ father }){
    this.myInherits = father
  }

  addIdentifierOfClass({ token }){
    this.IdentifierOfClass = token
  }

  printMyFeatures(){
    console.log(this.myInherits)
    if (this.myInherits){
      console.log('My Inherits: ', this.myInherits)
    } else {
      console.log('There are no Inherits')
    }

    console.log('My Features')
    this.classFeatures.forEach(feature => {
      feature.printFeature()
    })
  }
}

class FeatureNode {
  initialToken
  myFormals = []
  myTypeOfReturn
  expression = []

  constructor({ InitialNode }){
    this.initialToken = InitialNode
  }

  addFormal({ newFormal }){
    this.myFormals.push(new FormalNode({ InitialNode: newFormal }))
    return this.myFormals.length - 1
  }

  addMyTypeOfReturn({ type }){
    this.myTypeOfReturn = type
  }

  addExpression({ token }){
    this.expression = new ExpressionNode({ token })
  }


  printFeature(){
    console.log('My initial Token: ', this.initialToken ? this.initialToken : 'Não tem')
    console.log('My type of Return: ', this.myTypeOfReturn)
    if (this.myFormals){
      this.myFormals.forEach(formal => formal.printFormal())
    } else {
      console.log('No have formals')
    }

    if (this.expression){
      this.expression.forEach(expression => expression.printExpression())
    } else {
      console.log('No have expression')
    }

  }

}

class FormalNode {
  initialToken
  returnType

  constructor({ InitialNode }){
    this.initialToken = InitialNode
  }

  addReturnType({ token }){
    this.returnType = token
  }

  printFormal(){
    console.log('Content of formal:\n', this.initialToken)
    this.content.forEach(token => {
      console.log(token)
    })
  }
}

class ExpressionNode {
  content = []

  constructor({ InitialNode }){
    this.content.push(InitialNode)
  }

  addContentInExpression({ token }){
    this.content.push(token)
    return this.content.length - 1
  }

  printExpression(){
    console.log('Expression tokens: \n')
    this.content.forEach(x => console.log(x))
  }
}

class SyntaticTree {
  programClasses = []

  addNewClass({ oneNewClass }){
    this.programClasses.push(new ClassNode({ InitialNode: oneNewClass }))
    return this.programClasses.length - 1
  }

  printMyTree(){
    console.log(this.programClasses)
    // this.programClasses.forEach(FeatureNode => {
    //   FeatureNode.printMyFeatures()
    // })
  }
}

export { SyntaticTree }