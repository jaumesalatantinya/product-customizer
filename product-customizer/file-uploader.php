<?php

	$type = $_GET['type'];
	header('Content-Type: application/json');
	$error;
	$target_dir = '../../img/custom/';
	$target_file = pathinfo($_FILES['file-to-upload']['name'],PATHINFO_FILENAME) . '_' . time() . '.' . pathinfo($_FILES['file-to-upload']['name'],PATHINFO_EXTENSION);
	$target_dir_file = $target_dir . basename($target_file);
	$uploadOk = 1;
	$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);

    $size = getimagesize($_FILES['file-to-upload']['tmp_name']);
    if($type == 'view' && ($size == false || $size[0] >= 600) ) {
        $error = 'La imagen debe de ser más grande o igual a 600 de ancho o está vacia';
        $uploadOk = 0;
    }

	if ($_FILES["file-to-upload"]["size"] > 20000000) {
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
	    if (move_uploaded_file($_FILES['file-to-upload']['tmp_name'], $target_dir_file)) {
	    	echo ('{"status": "success", "file": "' . basename($target_file) . '", "height": "'.$size[1].'"}');	        
	    } else {
	    	echo ('{"status": "fail", "error": "Error: No permision to move file to target dir"}');
	    }
	}
?>
