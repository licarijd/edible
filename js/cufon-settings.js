function initCufon() {
	Cufon.replace('#nav', { fontFamily: 'DroidSans', hover: true});
	Cufon.replace('.nivo-controlNav, .nivo-caption .title, #main-inner h2, #sidebar .info-box ul, .collaborators .inner', { fontFamily: 'DroidSans'});
	Cufon.replace('.news li strong, #sidebar .info-box strong, #sidebar address em, #contact span, #main-inner .title.bold', { fontFamily: 'DroidSansB'});
}

$(document).ready(function(){
	initCufon();
});