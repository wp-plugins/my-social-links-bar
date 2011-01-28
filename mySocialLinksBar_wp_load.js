/**********************************************
 * loading page, read configs from xml
 * set vars, and call method to create the bar
 **********************************************/

var mySocialLinksBar = new mySocialLinksBar();

jQuery(document).ready( function() { 

	mySocialLinksBar.setPath('./wp-content/plugins/my-social-links-bar/lib/');

	jQuery.ajax({

		type: "GET",
		dataType: "xml",
		url : "./wp-content/plugins/my-social-links-bar/mySocialLinksBar_wp_xml.php",
		
		error : function() {
			return false;
		},

		success : function(data) {
			mySocialLinksBar.loadXML(data);
			mySocialLinksBar.loadBar();
		}
		
	}); // ajax	

});
