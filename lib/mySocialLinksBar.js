
/*****************************************
 * metodo que cria div com itens da barra 
 ****************************************/
function mySocialLinksBar() {

	var path = './';
	var xml, path_img, posx, posy, minimized, label, label_min;

	var css = new Array();


	/***********************************************
	 * metodo que faz chamada de leitura do xml
	 * e depois executa processos para montar barra
	 ***********************************************/
	this.load = function() {

		$.ajax({

			type: "GET",
			dataType: "xml",
			url : path + "config.xml",

			error : function() {
				return false;
			},

			success : function(data) {
				xml = data;
				mySocialLinksBar.config();
				mySocialLinksBar.links();
				mySocialLinksBar.border();
				mySocialLinksBar.position();
				mySocialLinksBar.view();		
			}
		}); // ajax	

	};// load
	

	/******************************************
	 * setando configuracoes inicial da toolbar
	 ******************************************/
	this.config = function() {
		path_img  = $(xml).find('path_img').text();
		posx      = $(xml).find('positionx').text();
		posy      = $(xml).find('positiony').text();
		minimized = $(xml).find('minimized').text();
		label     = $(xml).find('label').text();
		label_min = $(xml).find('label_min').text();
	};


	/**********************************
	 * montando div da barra com links 
	 *********************************/
	this.links = function() {

		// criando div da toolbar
		$('body').append('<div id="mySocialLinksBar"></div>');

		$(xml).find('link').each(function(){

			//variaveis do link
			var id     = $(this).attr('class');
			var url    = $(xml).find('url.'+id).text();
			var value  = $(this).text();

			// se o valor do id da social media for false ou vazio, ignora item
			if(value!=false || value!='') { 

				//montando img
				var img   = ($(this).attr('img')==null || $(this).attr('img')=='') ? id : $(this).attr('img');
				img       =  '<img src="' + path + path_img + img + '.png" alt="' + id + '">';

				// montando url
				var link  =  '<a href="' + url + value +'" title="' + id + '" target="_blank">' + img + '</a>';

				// montando div
				var div   =  '<div id="mySocialLinksBar-' + id + '">' + link + '</div>'	
		
				// incluindo div na toolbar
				$('#mySocialLinksBar').append(div);
			}
		});

		// definindo posicao (horizontal) / inclusao do label da toolbar
		if(posx=='left') {
			$('#mySocialLinksBar').prepend('<div id="mySocialLinksBarLabel">' + label + '</div>');
		}
		else {
			$('#mySocialLinksBar').append('<div id="mySocialLinksBarLabel">' + label + '</div>');
		}

	};

		
	/*******************************************
	 * funcao q arredonda bordas especificas da
	 * toolbar, conforme definido nas config.
	 ******************************************/
	this.border = function() {
		if(posy=='top') {
			$('#mySocialLinksBar').css('-webkit-border-bottom-left-radius', '10px');
			$('#mySocialLinksBar').css('-moz-border-radius-bottomleft', '10px');
			$('#mySocialLinksBar').css('-webkit-border-bottom-right-radius', '10px');
			$('#mySocialLinksBar').css('-moz-border-radius-bottomright', '10px');
		
			$('#mySocialLinksBar').css('-webkit-box-shadow', '1px 1px 1px #666');
			$('#mySocialLinksBar').css('-moz-box-shadow', '1px 1px 1px #666');
		}
		else {
			$('#mySocialLinksBar').css('-webkit-border-top-left-radius', '10px');
			$('#mySocialLinksBar').css('-moz-border-radius-topleft', '10px');
			$('#mySocialLinksBar').css('-webkit-border-top-right-radius', '10px');
			$('#mySocialLinksBar').css('-moz-border-radius-topright', '10px');

			$('#mySocialLinksBar').css('-webkit-box-shadow', '1px -1px 1px #666');
			$('#mySocialLinksBar').css('-moz-box-shadow', '1px -1px 1px #666');
		}
	};


	/***************************************************
	 * busca definioes de posicionamento em variavel
	 * e seta com 0 posicionamento das opcoes definidas 
	 ***************************************************/
	this.position = function() {
		var position = new Array();

		// posicionamento x (left/right) 
		position[posx] = 0;
	
		// posicionamento y (top/bottom) 
		position[posy] = 0;

		// setando os 2 itens do css
		for(var i in position) {
			$('#mySocialLinksBar').css(i, position[i]);
		}
	};
	
	
	/*************************************
	 * busca array com config. adicionais 
	 * de css para toolbar a aplica
	 *************************************/
	this.css = function() {
		for(var i in css) {
			$('#mySocialLinksBar').css(i, css[i]);
		}
	};
	
	
	/******************************************************
	 * alterna view da toolbar entre minimizada e completa
	 *****************************************************/
	this.view = function() {
		$('#mySocialLinksBar').slideUp(this.show).slideDown(500);
	};


	/********************************************************
	 * prepara html/css da div de acordo com a view min/full
	 *******************************************************/
	this.show = function() {
		if(minimized==1) {
			label_link = '<a href="Javascript:void(0)" onClick="Javascript:mySocialLinksBar.view();" title="' + label_min + '">' + label_min + '</a>';
			$('#mySocialLinksBarLabel').html(label_link);
			$('#mySocialLinksBar div').css('display', 'none');
			$('#mySocialLinksBarLabel').css('display', 'block');
			minimized = false;
		}
		else {
			label_link = '<a href="Javascript:void(0)" onClick="Javascript:mySocialLinksBar.view();" title="' + label + '">' + label + '</a>';
			$('#mySocialLinksBarLabel').html(label_link);
			$('#mySocialLinksBar div').css('display', 'block');
			minimized = true;
		}
	}

	/*******************************
	 * atualizando path default
	 ******************************/
	this.setPath = function(new_path) {
		path = new_path;
	}
	
	/***********************************************
	 * metodo que faz chamada de leitura do xml
	 * e depois executa processos para montar form
	 ***********************************************/
	this.form = function() {

		$.ajax({

			type: "GET",
			dataType: "xml",
			url : path + "config.xml",

			error : function() {
				return false;
			},

			success : function(data) {
				xml = data;

				path_img  = $(xml).find('path_img').text();

				// urls from social links
				//***********************
				$(xml).find('url').each(function() {

					var id     = $(this).attr('class');
					var url    = (id=='feed') ? '(feed)' : $(this).text();
					var value  = $(xml).find('link.'+id).text();

					//montando img
					var img   = ($(this).attr('img')==null || $(this).attr('img')=='') ? id : $(this).attr('img');
					img       =  '<img src="' + path + path_img + img + '.png" alt="' + id + '">';

					// montando input
					var input =  img+' <span>'+url+'</span><input id="'+id+'" name="'+id+'" value="'+value+'" />';

					// montando div
					var div   =  '<div id="mySocialLinksBar-' + id + '" class="bar-urls">' + input + '</div>'
		
					// incluindo div na toolbar
					$('#mySocialLinksBar-links').append(div);

				});// loop urls



				// configuration
				//***************
				$(xml).find('configuration').children().each(function() {

					var id     = $(this).get(0).tagName;
					var desc   = $(this).attr('desc');
					var value  = $(this).text();

					// montando campos

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
					
					// montando div
					var div   =  '<div id="mySocialLinksBar-' + id + '" class="bar-config">' + input + '</div>'
		
					// incluindo div na toolbar
					$('#mySocialLinksBar-config').append(div);
					
					// selecionando item do combo
					$('#'+id+' option[value='+value+']').attr('selected','selected');


				});// loop config


			} // success
			
		}); // ajax	

	};// form
	
}

