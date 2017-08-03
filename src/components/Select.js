
class Select extends createjs.Shape {
  constructor(app) {
    super()

    this.app = app

    this.lines = []
    this.labels = []
    for (let i = 0; i < 2; i++) {
      this.lines[i] = new createjs.Shape()
      this.labels[i] = new createjs.Text("", "18px Arial", "#000")
      this.labels[i].hitArea = this.getHitArea()
      this.app.stage.addChild(this.lines[i])
      this.app.stage.addChild(this.labels[i])
    }
  }

  clear() {
    for (let object of this.app.stage.children) {
      if (!object.circle) continue
      object.circle.graphics.clear()
    }

    for (let i = 0; i < 2; i++) {
      this.lines[i].graphics.clear()
      this.labels[i].text = ''
    }

    this.app.update = true
  }

  move(pos) {
    if (!pos) {
      pos = {
        x: this.app.stage.mouseX,
        y: this.app.stage.mouseY
      }
    }

    this.clear()

    let objects = this.app.stage.children.filter(object => object.select)

    for (let object of objects) {
      object.circle.graphics.beginFill('#00f')
      object.circle.graphics.drawCircle(0, 0, 20)
      object.circle.x = object.x
      object.circle.y = object.y
    }

    if (objects.length === 1) {
      for (let i = 0; i < 2; i++) {
        this.lines[i].graphics.setStrokeStyle(3)
        this.lines[i].graphics.beginStroke('#aaa')
        this.lines[i].graphics.moveTo(pos.x*i, pos.y*(1-i))
        this.lines[i].graphics.lineTo(pos.x, pos.y)
        this.lines[i].graphics.endStroke()
      }
      this.labels[0].text = Math.floor(pos.x)
      this.labels[0].x = pos.x / 2
      this.labels[0].y = pos.y + 10
      this.labels[1].text = Math.floor(pos.y)
      this.labels[1].x = pos.x + 10
      this.labels[1].y = pos.y / 2
    }

    if (objects.length === 2) {
      this.lines[0].graphics.setStrokeStyle(3)
      this.lines[0].graphics.beginStroke('#aaa')
      this.lines[0].graphics.moveTo(objects[0].x, objects[0].y)
      this.lines[0].graphics.lineTo(objects[1].x, objects[1].y)
      this.lines[0].graphics.endStroke()

      let dist = Math.sqrt(
        (objects[1].x - objects[0].x)**2
        + (objects[1].y - objects[0].y)**2
      )
      this.labels[0].text = Math.floor(dist)
      this.labels[0].x = (objects[0].x + objects[1].x) / 2 + 10
      this.labels[0].y = (objects[0].y + objects[1].y) / 2 + 10

    }

    this.app.update = true
  }

  getHitArea() {
    let hit = new createjs.Shape();
    hit.graphics.beginFill("#000")
    hit.graphics.drawRect(0, 0, 50, 30);
    return hit
  }

}

export default Select
