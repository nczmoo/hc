class Item {
	types = ['coal', 'iron axe', 'iron ingots', 'iron ore', 
		'iron pickaxe', 'iron saw', 'logs', 'stone', 
		'stone axe', 'stone pickaxe', 'stone saw', 'wood'];
	production = [];

	producers = [
		['miner'],
		['iron toolmaker'],		
		['iron smelter'],
		['miner'],
		['iron toolmaker'],
		['iron toolmaker'],
		['lumberjack'],
		['laborer', 'miner'],
		['stone toolmaker'],
		['stone toolmaker'],
		['stone toolmaker'],
		['laborer', 'sawmiller'],
	]
	stock = [];
	constructor(){
		for (let i in this.types){
			this.stock.push(0);
			this.production.push(0);
		}
	}
	fetchDurability(equipmentName){
		if (equipmentName.substring(0, 4) == 'iron'){
			return 1000;
		} else if (equipmentName.substring(0, 'stone'.length) == 'stone'){
			return 100;
		}
	}

	isThereEnoughEquipment(acceptableEquipment, numOfWorkers){
		for (let itemName of acceptableEquipment){
			if(this.stock[this.types.indexOf(itemName)] >= numOfWorkers){
				return true;
			}
		}
		return false;
	}
	isThereEnoughMaterials(reqMaterials, reqAmountArr, numReq){
		for (let i in reqMaterials){
			if(this.stock[this.types.indexOf(reqMaterials[i])] < reqAmountArr[i] * numReq){
				return false;
			}
		}
		return true;
	}

	useEquipment(acceptableEquipment, numOfWorkers){
		for (let itemName of acceptableEquipment){
			let durability = this.fetchDurability(itemName);
			if(this.stock[this.types.indexOf(itemName)] >= numOfWorkers){
				for (let i = 0; i < numOfWorkers; i++){
					let doesItBreak = randNum(1, durability) == 1;
					if (doesItBreak){
						this.stock[this.types.indexOf(itemName)] --;
					}
				}
			}
		}
	}
	useMaterials(reqMaterials, reqAmountArr, numReq){
		for (let i in reqMaterials){
			this.stock[this.types.indexOf(reqMaterials[i])] -= reqAmountArr[i] * numReq;		
		}		
	}
}