
/***********************************
 * object to create and manipulate 
 * my social links bar 
 ***********************************/
function mySocialLinksBar() {

	// path indicates where load my-social-links-bar is located
	var path = './';

	// path indicates where are the icons used in bar's links 	
	var path_img = 'icons/default/';
	
	// vars that set configuration's bar	
	var posx = 'right', posy = 'top', minimized = 0, label = '>', label_min = '<';

	// xml var is the data information to make the bar
	var xml;

	// css array can put additional css layout in bar
	var css = new Array();


	/*************************************
	 * call and load xml data to var xml 
	 * if sucess call method to load bar 
	 ************************************/
	this.load = function() {

		jQuery.ajax({
			type: "GET",
			dataType: "xml",
			url : path + "config.xml",

			error : function() {
				return false;
			},

			success : function(data) {
				xml = data;
				mySocialLinksBar.loadBar();
			}
		}); // ajax	

	};// load


	/********************************************
	 * load xml var with data (wordpress plugin) 
	 * used when xml data is not from config.xml 
	 ********************************************/
	this.loadXML = function(data) {
		xml = data;
	}
	
	/*****************************
	 * method loads bar in page 
	 ****************************/
	this.loadBar = function() {
		this.config();
		this.links();
		this.border();
		this.position();
		this.view();	
	}

	/*********************************
	 * set initial config of toolbar
	 ********************************/
	this.config = function() {
		path_img  = ( jQuery(xml).find('path_img').text()   == '' ) ? path_img  : jQuery(xml).find('path_img').text();
		posx      = ( jQuery(xml).find('positionx').text()  == '' ) ? posx      : jQuery(xml).find('positionx').text();			
		posy      = ( jQuery(xml).find('positiony').text()  == '' ) ? posy      : jQuery(xml).find('positiony').text();
		minimized = ( jQuery(xml).find('minimized').text()  == '' ) ? minimized : jQuery(xml).find('minimized').text();
		label     = ( jQuery(xml).find('label').text()      == '' ) ? label     : jQuery(xml).find('label').text();
		label_min = ( jQuery(xml).find('label_min').text()  == '' ) ? label_min : jQuery(xml).find('label_min').text();
	};


	/******************************
	 * building bar div with links  
	 *****************************/
	this.links = function() {

		// creating div toolbar
		jQuery('body').append('<div id="mySocialLinksBar"></div>');

		jQuery(xml).find('link').each(function(){
	
			// link vars
			var id     = jQuery(this).attr('class');
			var url    = jQuery(xml).find('url.'+id).text();
			var value  = jQuery(this).text();

			// make the link only to social media id's that value is not false or empty
			if(value!=false || value!='') { 

				//creating img
				var img   = (jQuery(this).attr('img')==null || jQuery(this).attr('img')=='') ? id : jQuery(this).attr('img');
				img       =  '<img src="' + path + path_img + img + '.png" alt="' + id + '">';

				// creating url
				if(id=='feed') {
					var link  =  '<a href="' + value + '" title="' + id + '" target="_blank">' + img + '</a>';
				}
				else if(id=='blogger') {
					var link  =  '<a href="' + url.replace('http://', 'http://' + value + '.') +'" title="' + id + '" target="_blank">' + img + '</a>';
				}
				else {
					var link  =  '<a href="' + url + value +'" title="' + id + '" target="_blank">' + img + '</a>';
				}
				
				// creating div
				var div   =  '<div id="mySocialLinksBar-' + id + '">' + link + '</div>'	
		
				// putting div in the bar
				jQuery('#mySocialLinksBar').append(div);
			}
		});

		// set postiong of bar's label
		if(posx=='left') {
			jQuery('#mySocialLinksBar').prepend('<div id="mySocialLinksBarLabel">' + label + '</div>');
		}
		else {
			jQuery('#mySocialLinksBar').append('<div id="mySocialLinksBarLabel">' + label + '</div>');
		}

	};

		
	/*******************************************
	 * applying radius effect on bar border
	 * it will be applicable in specifics
	 * borders depending of vertical position
	 ******************************************/
	this.border = function() {
		if(posy=='top') {
			jQuery('#mySocialLinksBar').css('-webkit-border-bottom-left-radius', '10px');
			jQuery('#mySocialLinksBar').css('-moz-border-radius-bottomleft', '10px');
			jQuery('#mySocialLinksBar').css('-webkit-border-bottom-right-radius', '10px');
			jQuery('#mySocialLinksBar').css('-moz-border-radius-bottomright', '10px');
		
			jQuery('#mySocialLinksBar').css('-webkit-box-shadow', '1px 1px 1px #666');
			jQuery('#mySocialLinksBar').css('-moz-box-shadow', '1px 1px 1px #666');
		}
		else {
			jQuery('#mySocialLinksBar').css('-webkit-border-top-left-radius', '10px');
			jQuery('#mySocialLinksBar').css('-moz-border-radius-topleft', '10px');
			jQuery('#mySocialLinksBar').css('-webkit-border-top-right-radius', '10px');
			jQuery('#mySocialLinksBar').css('-moz-border-radius-topright', '10px');

			jQuery('#mySocialLinksBar').css('-webkit-box-shadow', '1px -1px 1px #666');
			jQuery('#mySocialLinksBar').css('-moz-box-shadow', '1px -1px 1px #666');
		}
	};


	/***************************************************
	 * verify bar's position definied to set it  
	 ***************************************************/
	this.position = function() {
		var position = new Array();

		// posicionamento x (left/right) 
		position[posx] = 0;
	
		// posicionamento y (top/bottom) 
		position[posy] = 0;

		// setando os 2 itens do css
		for(var i in position) {
			jQuery('#mySocialLinksBar').css(i, position[i]);
		}
	};
	
	
	/*************************************
	 * check css array var to add in bar 
	 *************************************/
	this.css = function() {
		for(var i in css) {
			jQuery('#mySocialLinksBar').css(i, css[i]);
		}
	};
	
	
	/******************************************************
	 * chenge tollbar view ( minimized and full )
	 *****************************************************/
	this.view = function() {
		jQuery('#mySocialLinksBar').slideUp(this.show).slideDown(500);
	};


	/********************************************************
	 * set html/css acording config view defined min/full
	 *******************************************************/
	this.show = function() {
		if(minimized==1) {
			label_link = '<a href="Javascript:void(0)" onClick="Javascript:mySocialLinksBar.view();" title="' + label_min + '">' + label_min + '</a>';
			jQuery('#mySocialLinksBarLabel').html(label_link);
			jQuery('#mySocialLinksBar div').css('display', 'none');
			jQuery('#mySocialLinksBarLabel').css('display', 'block');
			minimized = false;
		}
		else {
			label_link = '<a href="Javascript:void(0)" onClick="Javascript:mySocialLinksBar.view();" title="' + label + '">' + label + '</a>';
			jQuery('#mySocialLinksBarLabel').html(label_link);
			jQuery('#mySocialLinksBar div').css('display', 'block');
			minimized = true;
		}
	}


	/********************
	 * get default path
	 *******************/
	this.getPath = function() {
		return path;
	}


	/********************
	 * get img path
	 *******************/
	this.getPathImg = function() {
		return path_img;
	}
	
	
	/********************
	 * set default path
	 *******************/
	this.setPath = function(new_path) {
		path = new_path;
	}


	/********************
	 * set img path
	 *******************/
	this.setPathImg = function(new_path) {
		path_img = new_path;
	}

	
	/********************************************
	 * call and load xml, and execute process to 
	 * create a form to management data
	 ********************************************/
	this.form = function() {
		
		jQuery.ajax({

			type: "GET",
			dataType: "xml",			
			url : path + "config.xml",
			
			error : function() {
				return false;
			},

			success : function(data) {
				xml = data;

				path_img  = jQuery(xml).find('path_img').text();

				// urls from social links
				//***********************
				jQuery(xml).find('url').each(function() {

					var id     = jQuery(this).attr('class');
					var url    = (id=='feed') ? '(feed)' : jQuery(this).text();
					var value  = jQuery(xml).find('link.'+id).text();

					// creating img
					var img   = (jQuery(this).attr('img')==null || jQuery(this).attr('img')=='') ? id : jQuery(this).attr('img');
					img       =  '<img src="' + path + path_img + img + '.png" alt="' + id + '">';

					// creating input
					var input =  img+' <span>'+url+'</span><input id="'+id+'" name="'+id+'" value="'+value+'" />';

					// creating div
					var div   =  '<div id="mySocialLinksBar-' + id + '" class="bar-urls">' + input + '</div>'
		
					// putting div in the toolbar
					jQuery('#mySocialLinksBar-links').append(div);

				});// loop urls



				// configuration
				//***************
				jQuery(xml).find('configuration').children().each(function() {

					var id     = jQuery(this).get(0).tagName;
					var desc   = jQuery(this).attr('desc');
					var value  = jQuery(this).text();

					// creating fields
					if(id=='path' || id=='path_img' || id=='modal') {
						return;
					}
					
					if(id=='minimized') {
						var input =  '<span>'+desc+'</span> \
						<select id="'+id+'" name="'+id+'"> \
						<option value="1">Yes</option> \
						<option value="0">No</option> \
						</select>';
					}

					if(id=='positionx') {
						var input =  '<span>'+desc+'</span> \
						<select id="'+id+'" name="'+id+'"> \
						<option value="left">Left</option> \
						<option value="right">Right</option> \
						</select>';
					}

					if(id=='positiony') {
						var input =  '<span>'+desc+'</span> \
						<select id="'+id+'" name="'+id+'"> \
						<option value="top">Top</option> \
						<option value="bottom">Bottom</option> \
						</select>';
					}
					
					if(id=='label' || id=='label_min') {
						var input =  '<span>'+desc+'</span><input id="'+id+'" name="'+id+'" value="'+value+'" />';					
					}
					
					// creating div
					var div   =  '<div id="mySocialLinksBar-' + id + '" class="bar-config">' + input + '</div>'
		
					// putting div in the toolbar
					jQuery('#mySocialLinksBar-config').append(div);
					
					// selecting combo item
					jQuery('#'+id+' option[value='+value+']').attr('selected','selected');


				});// loop config


			} // success
			
		}); // ajax	

	};// form
	
}