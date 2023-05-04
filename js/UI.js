class UI{
	landTypes = ['barren', 'forest', 'mountains', 'plains'];
	
  constructor(){
	  this.initLabor();
  }
  refresh(){
/*
	let txt = '';
    for (let i of this.landTypes){
		txt += "<option>" + i + "</option>";		
	}
	$("#landType").html(txt);
	let landSize = $("#landSize").val();
	$("#landSizeCaption").html(landSize + "x" + landSize);
	$("#landRentCost").html("$" + Math.pow(landSize, 2) + " per day");
	
	if (game.type != null){
		$("#landLeasing").addClass('d-none');
		this.displayMap();
	} 
*/
	$("#numOfHired").html(game.employees.numOfHired);
	this.displayLabor();
	this.displayCapital();
	$("#money").html(game.money.toLocaleString());
  }

	displayCapital(){		
		let txt = "";
		for (let i in game.items.types){			
			if (game.items.stock[i] > 0 || game.employees.possibleProduction.includes(game.items.types[i])){
				txt += "<div>" + game.items.types[i] + ": " + Math.round(game.items.stock[i])
					+ " (" + game.items.production[i] + ") "
					+ this.displayProduction(game.items.types[i]) + " </div>";
			}
		}
		$("#capital").html(txt);

	}


  displayLabor(){
	  let txt = '';
	  for (let roleID in game.employees.roles){
		  if (game.employees.count[roleID] > 0){
				let roleWorkingClass = '';
				if(game.employees.roleWorking[roleID]){
					roleWorkingClass = ' checked ';
				}
			  txt += "<div><span class='fw-bold'>";
				txt += "<button id='fire-" + roleID + "' class='btn btn-danger m-2 fire'>x</button>"
			  txt += game.employees.roles[roleID] + "</span>: " + game.employees.count[roleID] 
				+ "<input type='checkbox' id='roleWorking-" + roleID 
				+ "' class='roleWorking ms-3' " + roleWorkingClass + "></div>";			  
		  }
	  }		
	  $("#hired").html(txt);
  }
  
  displayMap(){
	  let txt = '';
	  for (let y = 0 ; y < game.size; y++){
		  txt += "<div class='y'>";
		  for (let x = 0; x < game.size; x++){
			  txt += "<div class='cell " + game.type + "'>&nbsp;</div>";
		  }		  
		  txt += "</div>";
	  }
	  $("#map").html(txt);
  }
	displayProduction(itemType){
		let txt = '';
		for (let role of game.items.producers[game.items.types.indexOf(itemType)]){
			
			let roleID = game.employees.roles.indexOf(role);
			if (game.employees.count[roleID] < 1){
				continue;
			}
			let checkedClass = ''
			if (game.employees.working[roleID][game.employees.productionTypes[roleID].indexOf(itemType)] ){
				checkedClass = ' checked ';
			}
			txt += game.employees.acronyms[roleID] + ": <input type='checkbox' id='work-" + roleID 
				+ "-" + game.employees.productionTypes[roleID].indexOf(itemType) 
				+ "' class='work me-2' " + checkedClass + ">";
		}
		return txt;
	}
	initLabor(){
		let txt = '<option></option>';
		for (let i in game.employees.roles){
			txt += "<option value='" + i + "'>" + game.employees.roles[i] + "</option>";
		}
		$("#jobs").html(txt);
	}
}
