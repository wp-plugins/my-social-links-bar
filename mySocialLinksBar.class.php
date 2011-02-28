<?php

/**
 * Class mySocialLinksBar
 * 
 * Class contains all the methods to set up the bar on wordpress blog
 * loading bar on blog, or load the configuration on wp-admin session
 */

class mySocialLinksBar {

	/**
	 * INIT PROCESS - REGISTERING: JQUERY (correctly) LIB / SOCIAL MEDIA TOOLBAR LIB 
	 */
	public function init() {

		wp_enqueue_script('jquery');

		// disabling original jquery file, error in file of version 3.0.1, registering new file
        //wp_deregister_script('jquery');
        /*
		wp_register_script('jquery', WP_PLUGIN_URL . '/my-social-links-bar/lib/jquery/jquery.js', false, '1.4.2');
		wp_enqueue_script('jquery');

		wp_register_script('jquery', 'http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js', false, '1.4.2');
		wp_enqueue_script('jquery');
        */
		wp_register_script('mySocialLinksBar', WP_PLUGIN_URL . '/my-social-links-bar/lib/mySocialLinksBar.js', false, false);
		wp_enqueue_script('mySocialLinksBar');
		wp_register_style('mySocialLinksBarCSS', WP_PLUGIN_URL . '/my-social-links-bar/lib/mySocialLinksBar.css');
		wp_enqueue_style( 'mySocialLinksBarCSS');
	}

	/**
	 * REGISTERING TOOLBAR LOAD LIB IN WP BLOG 
	 */
	public function load() {
		wp_register_script('mySocialLinksBar_wp_load', WP_PLUGIN_URL . '/my-social-links-bar/mySocialLinksBar_wp_load.js', false, false);
		wp_enqueue_script('mySocialLinksBar_wp_load');
		
	}

    public function loadPath() {
        echo '<script type="text/javascript">
              var mySocialLinksBarWPPath = "' . WP_PLUGIN_URL . '";
              </script>';
    }

	/**
	 * CREATING XML TO AJAX LOAD 
	 *
	 */
	public function loadXML() {
	
		$xml   = new SimpleXMLElement('<mySocialLinksBar/>');

		$links  = $xml->addChild('links');
		$urls   = $xml->addChild('urls');
		$config = $xml->addChild('config');

		$array = $this->data();
		
		foreach($array['links'] as $item) {
			$link = $links->addChild('link', $item['value']);
			$link->addAttribute('class', $item['id']);
			$link->addAttribute('img', '');

			$url = $urls->addChild('url', $item['url']);
			$url->addAttribute('class', $item['id']);
		}
		
		foreach($array['config'] as $item) {
			$opt = $config->addChild($item['id'], $item['value']);
			$opt->addAttribute('desc', $item['desc']);
		}
		
		return $xml->asXML();
	}
	
	/**
	 * GETING DATA FROM LINKS AND CONFIGURATION
	 */
	public function data() {

		// loading xml
		$file  = file_get_contents(dirname(__FILE__) . '/lib/config.xml');
		$xml   = simplexml_load_string($file);
		
		$data = array();

		// geting id from urls 
		for($i=0; $i<count($xml->urls[0]); $i++) {
			$id                          = (string)$xml->urls[0]->url[$i]['class'];
			$id_wp                       = 'mySocialLinksBar-links-' . $id;
			$data['links'][$i]['id']     = $id;
			$data['links'][$i]['url']    = ($id=='feed') ? '(Feed)' : (string)$xml->urls[0]->url[$i];
			$data['links'][$i]['value']  = get_option($id_wp);
		}

		// setting configurations
		$i = 0;
		foreach($xml->configuration[0] as $item) {
			$tag                         = $item->getName();
			$id_wp                       = 'mySocialLinksBar-config-' . $tag;
			$data['config'][$i]['id']    = $tag;
			$data['config'][$i]['value'] = get_option($id_wp);
			$data['config'][$i]['desc']  = $item['desc'];
			$i++;
		}
		
		return $data;	
	}
	

	//*********************//
	//   ADMIN FUNCTIONS   //
	//*********************//

	/** 
	 * REGISTERING LIB TO ADMIN PAGE 
	 */
	public function adminScript() {
		wp_register_script('mySocialLinksBar_wp_admin', WP_PLUGIN_URL . '/my-social-links-bar/mySocialLinksBar_wp_admin.js', false, false);
		wp_enqueue_script('mySocialLinksBar_wp_admin');
	}

	/**
	 * ADDING MENU IN ADMIN PAGE 
	 */
	function adminMenu() {
		//add_options_page('Social Media Toolbar Options', "Toolbar Options", 'administrator', 'mySocialLinksBar', 'wp_toolbar_admin');
		add_menu_page('My Social Links Bar : Config', 'My Social Links Bar Configuration', 'administrator', 'mySocialLinksBar', array($this, 'adminLoad') );
	}

	/**
	 * LOADING TEMPLATE 
	 */
	public function adminLoad() {

		if(isset($_POST) && count($_POST)>0) {
			$return = $this->adminSave($_POST);
			// TODO - testar retorno e apresentar msg de ok ou erro
		}
		
		// loading data
		$data = $this->data();
		
		// creates inputs
		$form = $this->adminInputs($data);

		// setting form
		$html = $this->adminForm($form);

		// return html
		echo $html;
	}
	
	
	/** 
	 * SAVE LINKS AND CONFIGURATION OF SOCIAL MEDIAS 
	 * WORDPRESS DATABASE 
	 * 
	 * @param	array 		$data ($_POST) 	array with items of links + config
	 * @return 	boolean		true/false	return true/false if process exec correctly
	 */
	public function adminSave($data) {

		// loading xml
		$file = file_get_contents(dirname(__FILE__) . '/lib/config.xml');
		$xml  = simplexml_load_string($file);

		// setting id from urls 
		for($i=0; $i<count($xml->urls[0]); $i++) {
			$id    = (string)$xml->urls[0]->url[$i]['class'];
			$id_wp = 'mySocialLinksBar-links-' . $id;
			$value = $data[$id];
			delete_option($id_wp);
			add_option($id_wp, $value);
		}
		
		// setting configurations
		foreach($xml->configuration[0] as $item=>$value) {		
		
			if($item=='path' || $item=='path_img' || $item=='modal') { continue; }

			$id_wp = 'mySocialLinksBar-config-' . $item;
			$value = $data[$item];
			delete_option($id_wp);
			add_option($id_wp, $value);
		}
	}
	
	
	/** 
	 * SAVE LINKS AND CONFIGURATION OF SOCIAL MEDIAS 
	 * ON XML CONFIG FILE 
	 * 
	 * IMPORTANT: It not being used because a lot wp installs have permission denied to write in subfolders
	 * 
	 * @param	array 		$data ($_POST) 	array with items of links + config
	 * @return 	boolean		true/false	return true/false if process exec correctly
	 */
	public function adminSaveXML($data) {
		
		// loading xml
		$file = file_get_contents(dirname(__FILE__) . '/lib/config.xml');
		$xml  = simplexml_load_string($file);

		// setting id from urls 
		for($i=0; $i<count($xml->links[0]); $i++) {
			$id = (string)$xml->links[0]->link[$i]['class'];
			$xml->links[0]->link[$i] = $data[$id];
		}
		
		// setting configurations
		foreach($xml->configuration[0] as $item=>$value) {
			if(!isset($data[$item])) { continue; }
			$xml->configuration[0]->$item = $data[$item];
		}
		
		// wrinting xml 
		file_put_contents(dirname(__FILE__) . '/lib/config.xml', $xml->asXML());
		
		return true;
	}


	/**
	 * CREATING HTML OF FORM
	 *
	 * @param	$form	array with data/html to put on the form 
	 * @return	$html	form's html
	 */
	public function adminForm($form) {

		return '
		<div class="wrap">
			<h2>My Social Links Bar Configurations</h2>
			<fieldset>	
			<form id="mySocialLinksBar-form" method="post" action="' . $_SERVER["REQUEST_URI"] . '">
				<h3>Complete the IDs of the Social Links that the blog/you use:</h3>
		
				<div id="mySocialLinksBar-links">
					' . $form['links'] . '
				</div>
			
				<hr />

				<h3>My Social Links Configuration:</h3>

				<div id="mySocialLinksBar-config">
					' . $form['config'] . '
				</div>
		
				<input type="submit" name="mySocialLinksBar-save" id="mySocialLinksBar-save" value="Save" />
			</form>
			</fieldset>
		</div>';
	}
	
	
	/**
	 * CREATING INPUTS/SELECTS TO ADMIN WP FORM
	 * 
	 * @param	data 	item from array that specify the option
	 * @return 	input	item's html 
	 */
	public function adminInputs($data) {

		$inputs = array('links'=>'', 'config'=>'');

		// geting id from urls 
		foreach($data['links'] as $link) {
			// montando img		
			$img    =  '<img src="'.WP_PLUGIN_URL.'/my-social-links-bar/lib/icons/default/'.$link['id'].'.png" alt="'.strtoupper($link['id']).'">';
			// creating input
			$input  =  $img . ' <span>' . $link['url'] . '</span><input id="' . $link['id'] . '" name="' . $link['id'] . '" value="' . $link['value'] . '" />';
			// creating div
			$div    =  '<div id="mySocialLinksBar-' . $link['id'] . '" class="bar-urls">' . $input . '</div>' . chr(10) . chr(13);
			$inputs['links'] .=  $div;
		}

		// setting configurations
		foreach($data['config'] as $config) {

			// creating fields
			if($config['id']=='path' || $config['id']=='path_img' || $config['id']=='modal') {
				continue;
			}
					
			if($config['id']=='minimized') {

				$min_yes = '';
				$min_no  = '';
			
				if($config['value']==0) { $min_no  = 'selected="selected"'; }
				if($config['value']==1) { $min_yes = 'selected="selected"'; }
			
				$input =  '<span>'.$config['desc'].'</span> 
				<select id="'.$config['id'].'" name="'.$config['id'].'"> 
				<option value="1" '.$min_yes.'>Yes</option> 
				<option value="0" '.$min_no .'>No</option> 
				</select>';
			}

			if($config['id']=='positionx') {

				$pos_left   = '';
				$pos_right  = '';
			
				if($config['value']=='left')  { $pos_left  = 'selected="selected"'; }
				if($config['value']=='right') { $pos_right = 'selected="selected"'; }

				$input =  '<span>'.$config['desc'].'</span> 
				<select id="'.$config['id'].'" name="'.$config['id'].'"> 
				<option value="left" '.$pos_left.'>Left</option> 
				<option value="right" '.$pos_right.'>Right</option> 
				</select>';
			}

			if($config['id']=='positiony') {
			
				$pos_top    = '';
				$pos_bottom = '';
			
				if($config['value']=='top')  { $pos_top  = 'selected="selected"'; }
				if($config['value']=='bottom') { $pos_bottom = 'selected="selected"'; }	
			
				$input =  '<span>'.$config['desc'].'</span> 
				<select id="'.$config['id'].'" name="'.$config['id'].'"> 
				<option value="top" '.$pos_top.'>Top</option> 
				<option value="bottom" '.$pos_bottom.'>Bottom</option> 
				</select>';
			}
					
			if($config['id']=='label' || $config['id']=='label_min') {
				$input =  '<span>'.$config['desc'].'</span><input id="'.$config['id'].'" name="'.$config['id'].'" value="'.$config['value'].'" />';	
			}

			// creating div
			$div   =  '<div id="mySocialLinksBar-'.$config['id'].'" class="bar-config">'.$input.'</div>';
		
			$inputs['config'] .= $div;
		}

		return $inputs;

	}
}
