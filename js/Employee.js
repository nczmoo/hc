class Employee{
	acronyms = [
		'is', 'it', 'l', 'lj', 'm', 'sm', 'st'
	];
	count = [];
	numOfHired = 0;
	possibleProduction = [];	

	productionRates = [
		[1],
		[1, 1, 1],
		[1, 10],
		[1],
		[10, 10, 10],
		[100],
		[1, 1, 1],
	];
	productionTypes = [
		['iron ingots'],
		['iron axe', 'iron pickaxe', 'iron saw'],
		['stone', 'wood'],
		['logs'],
		['coal', 'iron ore', 'stone'],
		['wood'],
		['stone axe', 'stone pickaxe', 'stone saw'],
	];
	productionCostAmounts = [
		[[10, 1]],
		[[1, 1], [1, 1], [1, 1]],
		[null, null],
		[null],
		[null, null, null],
		[[1]],
		[[1, 1], [1, 1], [1, 1]],
	];
	productionCostTypes = [
		[['iron ore', 'coal']],
		[['iron ingots', 'wood'], ['iron ingots', 'wood'], ['iron ingots', 'wood']],
		[null, null],
		[null],
		[null, null, null],
		[['logs']],
		[['stone', 'wood'], ['stone', 'wood'], ['stone', 'wood']],
	];
	productionEquipment = [
		null,
		null,
		null,
		['iron axe', 'stone axe'],
		['iron pickaxe', 'stone pickaxe'],
		['iron saw', 'stone saw'],
		null,
	];
	
	roles = ['iron smelter', 'iron toolmaker', 'laborer', 'lumberjack', 
		'miner', 'sawmiller', 'stone toolmaker' ];
	roleWorking = [];
	wagesPerHour = 0;

	working = [
		[false],
		[false, false, false],
		[false, false],
		[false],
		[false, false, false],
		[false],
		[false, false, false],
	];

	constructor(){
		for (let i in this.productionTypes){
			let arr = [];
			for (let n in this.productionTypes[i]){
				arr.push(0)
			}
		}
		for (let i in this.roles){
			this.count.push(0);
			this.roleWorking.push(true);
		}
	}

		canTheyDoThis(role, capital){		
		
		let roleID = this.roles.indexOf(role);
		let capitalProductionID = this.productionTypes[roleID].indexOf(capital);
		let costAmount = this.productionAmountCost[roleID][capitalProductionID];
		let costType = this.productionCapitalCost[roleID][capitalProductionID];
		let equipmentReq = this.productionEquipment[roleID];
		let theyHaveReqEquip = false;
		if (costType == null && equipmentReq == null){
			return true;
		}
		for (let i in costType){
			if(this.stock[costType[i]] < costAmount[i]){
				return false;
			}
		}
		if (equipmentReq == null){
			return true;
		}
		for (let i in equipmentReq){
			if (this.stock[this.capital.indexOf(equipmentReq[i])] > 0){
				theyHaveReqEquip = true;
			}
		}
		if (!theyHaveReqEquip){
			return false;
		}
		return true;
	}

	changeRoleWorking(roleID, working){
		console.log(roleID, working);
		this.roleWorking[roleID] = working;
	}
	changeWork(roleID, productionTypeID, working){
		this.working[roleID][productionTypeID] = working;
		let itemTypeID = game.items.types.indexOf(this.productionTypes[roleID][productionTypeID]);
		
		let typeIDsToBeProduced = this.fetchWhatRoleIsProducing(roleID);		
		for(let eachProductionTypeID of typeIDsToBeProduced){
			let laborMultiplier = this.fetchLaborMultiplier(roleID, typeIDsToBeProduced.length);			
			let itemTypeID = game.items.types.indexOf(this.productionTypes[roleID][eachProductionTypeID]);
			game.items.production[itemTypeID] = this.productionRates[roleID][eachProductionTypeID] * laborMultiplier;
			//THIS CODE WILL GET FUCKED UP FOR WHEN MULTIPLE ROLES ARE PRODUCING THE SAME ITEM			
		}
		
	}
	fetchLaborMultiplier(roleID, numOfItemsBeingMade){
		return this.count[roleID] / numOfItemsBeingMade;	
	}
	fetchWhatRoleIsProducing(roleID){
		let typeIDsToBeProduced = [];
		for (let productionTypeID in this.working[roleID]){				
			if(this.working[roleID][productionTypeID]){					
				typeIDsToBeProduced.push(productionTypeID);
			}			
		}
		return typeIDsToBeProduced;
	}
	 fire (roleID){
		this.count[roleID]--;
		this.numOfHired --;
		this.wagesPerHour --;
		
	}

	hire (roleID, wage){
		if (this.numOfHired >= 10){
			return;
		}		

		this.count[roleID] ++;
		this.wagesPerHour += wage;		
		this.numOfHired ++;
		for(let itemType of this.productionTypes[roleID]){
			if (!this.possibleProduction.includes(itemType)){
				this.possibleProduction.push(itemType)
			}
		}
	}
	make(roleID, typeIDsToBeProduced, laborMultiplier){
		if (this.productionEquipment[roleID] != null 
			&& !game.items.isThereEnoughEquipment(this.productionEquipment[roleID], this.count[roleID])){
			console.log('not enough equipment');
			this.stopWorking(roleID, typeIDsToBeProduced);
			return;
		}
		if (this.productionEquipment[roleID] != null ){
			game.items.useEquipment(this.productionEquipment[roleID], this.count[roleID]);
			
		}
		for (let productionTypeID of typeIDsToBeProduced){
			if (this.productionCostTypes[roleID][productionTypeID] != null 
				&& !game.items.isThereEnoughMaterials(this.productionCostTypes[roleID][productionTypeID], 
				this.productionCostAmounts[roleID][productionTypeID], this.count[roleID] * laborMultiplier)){
				console.log('not enough materials');
				this.stopWorking(roleID, [productionTypeID]);
				return;
			}
			if (this.productionCostTypes[roleID][productionTypeID] != null){
				game.items.useMaterials(this.productionCostTypes[roleID][productionTypeID], 
				this.productionCostAmounts[roleID][productionTypeID], this.count[roleID] * laborMultiplier)
			}
			let itemType = this.productionTypes[roleID][productionTypeID];
			let numBeingMade = this.productionRates[roleID][productionTypeID] * laborMultiplier;
			
			game.items.stock[game.items.types.indexOf(itemType)] += numBeingMade;
		}
		game.money -= this.count[roleID];
	}
	work(){
		for (let roleID in this.working){
			if (!this.roleWorking[roleID] || this.count[roleID] < 1 ){
				continue;
			}
			let typeIDsToBeProduced = this.fetchWhatRoleIsProducing(roleID);
			if (typeIDsToBeProduced.length > 0){
				let laborMultiplier = this.fetchLaborMultiplier(roleID, typeIDsToBeProduced.length);
				this.make(roleID, typeIDsToBeProduced, laborMultiplier);
			}
		}
	}
	stopWorking(roleID, productionTypeIDs){
		for (let productionTypeID of productionTypeIDs){
			this.working[roleID][productionTypeID] = false;
		}
	}
}