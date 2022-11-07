class treeClassNode{
  token
  #treeFeatureNode = []
  constructor({ InitialNode }){
    this.token = InitialNode
  }

  addFeatureNode({ treeFeatureNode }){
    this.treeFeatureNode.push(treeFeatureNode)
  }

  printMyFeatureNode(){
    this.#treeFeatureNode.forEach(FeatureNode => {
      FeatureNode.printMyFeatureNode()
    })
  }
}

class treeFeatureNode{
  token
  constructor({ InitialNode }){
    this.token = InitialNode
  }
}

class SyntaticTree {
  #myClass = []

  addNewClass({ oneNewClass }){
    this.#myClass.push(oneNewClass)
  }

  printMyTree(){
    this.#myClass.forEach(FeatureNode => {
      FeatureNode.printMyFeatureNode()
    })
  }
}

export { SyntaticTree }