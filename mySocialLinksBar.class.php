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
		// disabling original jquery file, error in file of version 3.0.1, registering new file
		wp_deregister_script('jquery');
		wp_register_script('jquery', 'http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js', false, '1.4.2');
		wp_enqueue_script('jquery');
		wp_register_script('mySocialLinksBar', WP_PLUGIN_URL . '/mySocialLinksBar/lib/mySocialLinksBar.js', false, false);
		wp_enqueue_script('mySocialLinksBar');
		wp_register_style('mySocialLinksBarCSS', WP_PLUGIN_URL . '/mySocialLinksBar/lib/mySocialLinksBar.css');
		wp_enqueue_style( 'mySocialLinksBarCSS');
	}

	/**
	 * REGISTERING TOOLBAR LOAD LIB IN WP BLOG 
	 */
	public function load() {
		wp_register_script('mySocialLinksBar_wp_load', WP_PLUGIN_URL . '/mySocialLinksBar/mySocialLinksBar_wp_load.js', false, false);
		wp_enqueue_script('mySocialLinksBar_wp_load');
	}

	//*********************//
	//   ADMIN FUNCTIONS   //
	//*********************//

	/** 
	 * REGISTERING LIB TO ADMIN PAGE 
	 */
	public function adminScript() {
		wp_register_script('mySocialLinksBar_wp_admin', WP_PLUGIN_URL . '/mySocialLinksBar/mySocialLinksBar_wp_admin.js', false, false);
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

		include('mySocialLinksBar_admin.html');
	}
	
	
	/** 
	 * SAVE LINKS AND CONFIGURATION OF SOCIAL MEDIAS 
	 * ON XML CONFIG FILE 
	 * 
	 * @param		array 		$data ($_POST) 			array with items of links + config
	 * @return 		boolean		true/false				return true/false if process exec correctly
	 */
	public function adminSave($data) {

		//TODO validacoes para retornar erro, caso exista
		
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
}
