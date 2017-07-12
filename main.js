var Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    Graphics = PIXI.Graphics,
    Sprite = PIXI.Sprite,
    ticker = new PIXI.ticker.Ticker();

var stage = new Container(),
    game = new Container(),
    final = new Container(),
    renderer = autoDetectRenderer(348, 348);

var steps = [-3, 1, 3, -1]
var matrix = Array(9)
var cords = [
    [22, 22],
    [124, 22],
    [226, 22],
    [22, 124],
    [124, 124],
    [226, 124],
    [22, 226],
    [124, 226],
    [226, 226]
];

var createCell = function(x, y, id) {
    var stoneTexture = TextureCache['stone' + id + '.png'];
    var cell = new Sprite(stoneTexture);

    cell.position.set(x, y);

    var message = new PIXI.Text(id, {
        fontFamily: "Serif", fontSize: 60, fill: 0x222222, fontWeight: 'bold',
        dropShadow: true, dropShadowDistance: 1, dropShadowColor: 0xd6d6d6
    });
    message.alpha = 0.9
    message.anchor.x = 0.5;
    message.anchor.y = 0.5;
    message.position.set(50, 50);
    cell.addChild(message);

    cell.id = id;
    cell.interactive = true;
    cell.buttonMode = true;

    cell.on('click', clickOnCell);

    game.addChild(cell);

    return cell;
};

var clickOnCell = function(e) {
    var self = this;
    let currentPos = _.findIndex(matrix, {id: this.id})
    var newPosition = undefined;
    steps.forEach((s) => {
    let pos = currentPos + s
    if (pos >= 0 && pos < matrix.length && matrix[pos] == undefined) {
      newPosition = pos;
      return false;
    }
    })

    if (newPosition !== undefined) {
        //ticker.add(function() {
        //  console.log(self.x, self.y);
        //
        //  var toX = cords[newPosition][0];
        //  var toY = cords[newPosition][1];
        //  console.log(toX, toY);
        //
        //  if (self.x != toX) {
        //    if (self.x < toX) {
        //      self.x++;
        //    } else {
        //      self.x--;
        //    }
        //  }
        //  if (self.y !== toY) {
        //    if (self.y < toY) {
        //      self.y++;
        //    } else {
        //      self.y--;
        //    }
        //  }
        //
        //  console.warn(self.x, self.y);
        //
        //  if (self.x == toX && self.y == toY) {
        //    ticker.stop();
        //    ticker.remove()
        //  } // 124, 226 -> [226, 226]
        //  //self.x += 1;
        //  //self.y += 2;
        //  renderer.render(stage);
        //})
        //ticker.start();

        this.position.set(cords[newPosition][0], cords[newPosition][1]);
        matrix[currentPos] = undefined;
        matrix[newPosition] = {id: this.id}

        renderer.render(stage);

        setTimeout(checkVictory, 500);
    }
}

var checkVictory = function() {
    let res = matrix.map((el) => {
        if (el == undefined) return;
        return el.id;
    })

    let shouldBe = _.range(1, 9);
    shouldBe.push(undefined);

    if (_.isEqual(res, shouldBe)) {
        game.visible = false;
        final.visible = true;
    }
}

PIXI.loader
    .add("images/assets.json")
    .load(function() {
        $('#game').append(renderer.view);

        var gameTexture = TextureCache["frame.png"];
        game = new Sprite(gameTexture);
        game.visible = true;
        stage.addChild(game)

        // Create cells
        var cells = _.shuffle(_.range(8));
        for (var i = 0; i < cells.length; i++) {
            let cellPos = cells[i];
            var cell = createCell(
                cords[cellPos][0],
                cords[cellPos][1],
                i + 1 // Cell ID starts from 1
            );
            matrix[cellPos] = {id: cell.id};
        }
        delete(cells);

        final.visible = false;
        let msg = new PIXI.Text('You won!', {font: "20px Future", fill: "white"});
        msg.position.set(30, 30);
        final.addChild(msg);
        stage.addChild(final)

        renderer.render(stage)
    });

