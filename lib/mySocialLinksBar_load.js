
/**********************************************
 * during load the page, read config from xml
 * set vars, and call method to create the bar
 *********************************************/
 
jQuery(document).ready( function() { 
	mySocialLinksBar = new mySocialLinksBar();
	mySocialLinksBar.load();
});
