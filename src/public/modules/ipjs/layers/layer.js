/**
 * @class Layer
 */
export default class Layer {
  visible = false
  name = null
  imageData = null
  id = 0

  constructor(id, name) {
    this.id = id
    this.name = name
  }

  static id = -1
  static createNew() {
    return new Layer(Layer.id++, `New Layer ${Layer.id}`)
  }
}
