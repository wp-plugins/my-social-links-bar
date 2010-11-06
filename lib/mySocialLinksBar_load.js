
/**********************************************
 * ao carregar pagina, le xml de configuracao
 * seta variaveis, e chama metodo q cria barra
 *********************************************/
 
$(document).ready( function() { 
	mySocialLinksBar = new mySocialLinksBar();
	mySocialLinksBar.load();
});
