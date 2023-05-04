$(document).on('click', '.capitalProd', function(e){	
	game.changeProd(e.target.name.split('-')[1], e.target.name.split('-')[2], $(this).val());
	ui.refresh();
});

$(document).on('click', '.fire', function(e){	
	game.employees.fire(e.target.id.split('-')[1]);
	
})


$(document).on('click', '#hire', function(e){
	if ($("#jobs").val() == ''){
		return;
	}
	game.employees.hire($("#jobs").val(), Number($("#wage").val()));
	
})


$(document).on('click', '#rent', function(e){
	game.rent($("#landSize").val(), $("#landType").val());
	
})

$(document).on('click', '.roleWorking', function(e){
	game.employees.changeRoleWorking(e.target.id.split('-')[1], this.checked);
	
})

$(document).on('click', '.work', function(e){
	console.log();
	game.employees.changeWork(e.target.id.split('-')[1], e.target.id.split('-')[2], this.checked);
});

$(document).on('click', 'button', function(e){
  ui.refresh()
})
