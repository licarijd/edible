$(document).ready(function () {
	
	$('#slider').nivoSlider({
		directionNav:false,pauseTime: 5000
	});
	
	setEqualHeight($('.collaborators'))
	
});// end document ready

//Box align justify

function alignJustify (){
	var col = $('.collaborators');
	for (var i=0; i < col.length; i+=3) {
		col.eq(i).addClass("marg")
	};
	
}
function setEqualHeight(columns){
	var tallestcolumn = 0;
	columns.each(function(){
		currentHeight = $(this).outerHeight(true);
		if(currentHeight > tallestcolumn){
			tallestcolumn  = currentHeight + 50;
		}
	});
	columns.height(tallestcolumn);
}