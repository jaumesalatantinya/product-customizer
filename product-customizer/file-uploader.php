<?php

	$type = $_GET['type'];
	header('Content-Type: application/json');
	$error;
	$target_dir = '../../img/custom/';
	$target_file = $target_dir . basename($_FILES['file-to-upload']['name']);
	$uploadOk = 1;
	$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);

    $size = getimagesize($_FILES['file-to-upload']['tmp_name']);
    if($type == 'view' && ($size == false || $size[0] != 600 || $size[1] != 600) ) {
        $error = 'La imagen debe de ser 600x600 o está vacia';
        $uploadOk = 0;
    }

	if ($_FILES["file-to-upload"]["size"] > 500000) {
	    $error = 'Imagen demasiado grande';
	    $uploadOk = 0;
	}

	if($imageFileType != 'jpg' && $imageFileType != 'png' && $imageFileType != 'jpeg' && $imageFileType != 'gif' ) {
	    $error = 'Los formatos aceptados son jpg, png, jpeg y gif';
	    $uploadOk = 0;
	}

	if ($uploadOk == 0) {
	    echo ('{"status": "fail", "error": "Error: '.$error.'"}');
	} else {
	    if (move_uploaded_file($_FILES["file-to-upload"]["tmp_name"], $target_file)) {
	    	echo ('{"status": "success", "file": "'.basename($_FILES['file-to-upload']['name']).'"}');	        
	    } else {
	    	echo ('{"status": "fail", "error": "Error: No permision to move file to target dir"}');
	    }
	}
?>
