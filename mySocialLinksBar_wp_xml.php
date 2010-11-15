<?php

if (!function_exists('add_action')) {
    require_once("../../../wp-config.php");
}

require_once('mySocialLinksBar.class.php');

$class = new mySocialLinksBar();

$xml_string = $class->loadXML();

header ("content-type: text/xml"); 

print $xml_string;