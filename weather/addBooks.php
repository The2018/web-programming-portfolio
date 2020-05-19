<?php

$filename = "data/data.json";

if (file_exists($filename)){
	$data = file_get_contents($filename);
	$dataToAugment = json_decode($data);

	$books = json_decode($_REQUEST["data"]);
	$dataToAugment[count($dataToAugment)] = array("user"=>$_REQUEST["user"], "data"=>$books);
}
else
{
	$dataToAugment = array();
	$books = json_decode($_REQUEST["data"]);
	$dataToAugment[count($dataToAugment)] = array("user"=>$_REQUEST["user"], "data"=>$books);
}

$data = json_encode($dataToAugment);

$file = fopen($filename, 'w');
fwrite($file, $data);
fclose($file);
?>