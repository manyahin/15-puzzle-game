let Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    Graphics = PIXI.Graphics,
    Sprite = PIXI.Sprite,
    ticker = new PIXI.ticker.Ticker();

let stage = new Container(),
    game = new Container(),
    final = new Container(),
    renderer = autoDetectRenderer(348, 348);

let matrix = Array(9)
let cords = [
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

let createCell = (x, y, id) => {
    let stoneTexture = TextureCache['stone' + id + '.png'];
    let cell = new Sprite(stoneTexture);
    cell.position.set(x, y);

    let message = new PIXI.Text(id, {
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

let clickOnCell = function(e) {
    let curPos = _.findIndex(matrix, {id: this.id})
    let newPos = undefined;
    [-3, 1, 3, -1].forEach((s) => {
        let tmpPos = curPos + s
        if (curPos == 2 && tmpPos == 3) return;
        if (curPos == 3 && tmpPos == 2) return;
        if (curPos == 5 && tmpPos == 6) return;
        if (curPos == 6 && tmpPos == 5) return;
        if (tmpPos >= 0 && tmpPos < matrix.length && matrix[tmpPos] == undefined) {
          newPos = tmpPos;
          delete(tmpPos);
          return false;
        }
    })

    if (newPos !== undefined) {
        // TODO: implement animation
        //ticker.add(function() {
        //  console.log(self.x, self.y);
        //
        //  let toX = cords[newPos][0];
        //  let toY = cords[newPos][1];
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

        this.position.set(cords[newPos][0], cords[newPos][1]);
        matrix[curPos] = undefined;
        matrix[newPos] = {id: this.id}

        renderer.render(stage);

        setTimeout(checkVictory, 500);
    }
}

let checkVictory = () => {
    let res = matrix.map((el) => {
        if (el == undefined) return;
        return el.id;
    })

    let shouldBe = _.range(1, 9);
    shouldBe.push(undefined);

    if (_.isEqual(res, shouldBe)) {
        game.visible = false;
        final.visible = true;
        renderer.render(stage);
    }
}

let initGame = () => {
    $('#game').append(renderer.view);

    let gameTexture = TextureCache['frame.png'];
    game = new Sprite(gameTexture);
    game.visible = true;
    stage.addChild(game)

    // Create tiles
    let cells = generatePuzzle();
    for (let i = 0; i < cells.length; i++) {
        let cellPos = cells[i];
        let cell = createCell(
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
}

const generatePuzzle = () => {
    let pos = _.shuffle(_.range(8))

    while (!checkPuzzleSolvability(pos))
      pos = _.shuffle(_.range(8))

    return pos 
}

// sum of invalid combination of each pair to check solvability
// for 3x3 field the count of invalid pairs should be not even number
const checkPuzzleSolvability = (arr) => {
    const snakePath = [arr[0], arr[1], arr[2], arr[5], arr[4], arr[3], arr[6], arr[7]]
    const res = {valid: 0, invalid: 0}

    for (let i in snakePath) {
      let range = snakePath.slice(+i+1, snakePath.length)
      for (let j in range) {
          if (snakePath[i] > range[j]) res.valid++
          else res.invalid++
      }
    }

    return (res.invalid % 2 !== 0)
}

PIXI.loader
    .add("images/assets.json")
    .load(initGame);

