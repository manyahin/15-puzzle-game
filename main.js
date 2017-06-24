var Container = PIXI.Container,
	autoDetectRenderer = PIXI.autoDetectRenderer,
	Graphics = PIXI.Graphics;

var stage = new Container(),
		game = new Container(),
		final = new Container();
renderer = autoDetectRenderer(150, 150);

var steps = [-3, 1, 3, -1]
var matrix = Array(9)
var cords = [
	[0, 0],
	[50, 0],
	[100, 0],
	[0, 50],
	[50, 50],
	[100, 50],
	[0, 100],
	[50, 100],
	[100, 100]
];

var createCell = function(x, y, id) {
	var cell = new Graphics();

	cell.beginFill(0xFFFFFF);
	cell.lineStyle(-1, 0xFF3300, 1);
	cell.drawRect(0, 0, 50, 50);
	cell.endFill();

	cell.position.set(x, y);

	var message = new PIXI.Text(id,
		{fontFamily: "Arial", fontSize: 32, fill: "pink"}
	);
	message.position.set(15, 7);
	cell.addChild(message);

	cell.id = id;
	cell.interactive = true;
	cell.buttonMode = true;

	cell.on('click', clickOnCell);

	game.addChild(cell);

	return cell;
};

var clickOnCell = function(e) {
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

$(function() {

	$('#game').append(renderer.view);

	renderer.backgroundColor = 0x061639;
	renderer.view.style.border = "1px dashed black";

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

	game.visible = true;
	stage.addChild(game)

	final.visible = false;
	let msg = new PIXI.Text('You won!', {font: "20px Future", fill: "white"});
	msg.position.set(30, 30);
	final.addChild(msg);
	stage.addChild(final)

	renderer.render(stage)
})