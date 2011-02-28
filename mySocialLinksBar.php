<?php
/*
Plugin Name: My Social Links Bar
Plugin URI: http://flechaweb.com.br
Description: An WP Plugin that show/hidde a toolbar with social links of the wp blog/site owner 
Version: 0.9.1
Author: Flechaweb Developing 
Author URI: http://www.flechaweb.com.br
License: GPL2

This program is free software; you can redistribute it and/or modify 
it under the terms of the GNU General Public License as published by 
the Free Software Foundation; version 2 of the License.

This program is distributed in the hope that it will be useful, 
but WITHOUT ANY WARRANTY; without even the implied warranty of 
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the 
GNU General Public License for more details. 

You should have received a copy of the GNU General Public License 
along with this program; if not, write to the Free Software 
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301 USA 
*/

if(!class_exists('mySocialLinksBar')) {
	require_once('mySocialLinksBar.class.php');
}

//*********************//
//  EXECUTING PROCESS  //
//*********************//

$mySocialLinksBar = new mySocialLinksBar();

add_action('init', array($mySocialLinksBar, 'init'));

// loading Scripts
if( is_admin() ) {
	add_action('init', array($mySocialLinksBar, 'adminScript'));
	add_action('admin_menu', array($mySocialLinksBar, 'adminMenu')); // adminMenu load adminLoad
}
else {
	add_action('init', array($mySocialLinksBar, 'load'));
    add_action('wp_head', array($mySocialLinksBar, 'loadPath'));
}