class Game{
	employees = new Employee();
	items = new Item();
	credit = -1000;	
	money = 1000;
	gameLoop = null;
	map = [];
	production = [];	
	type = 'barren'; // init to null
	size = 8;	// init to null

  constructor(){


	this.gameLoop = setInterval(this.loop, 1000);
  }

 	loop(){
		game.employees.work();
		ui.refresh();
	}
	
  rent(size, type){	  
	  this.size = size;
	  this.type = type;
  }

	
}
