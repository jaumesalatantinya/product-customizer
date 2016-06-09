<?php

	$type = $_GET['type'];
	header('Content-Type: application/json');
	$error;
	$img_height;
	$target_dir = '../img/custom/';
	$target_file = pathinfo($_FILES['file-to-upload']['name'],PATHINFO_FILENAME) . '_' . time() . '.' . pathinfo($_FILES['file-to-upload']['name'],PATHINFO_EXTENSION);
	$target_dir_file = $target_dir . basename($target_file);
	$uploadOk = 1;
	$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);

	if ($_FILES["file-to-upload"]["size"] > 2097152) {
	    $error = 'Imagen demasiado grande';
	    $uploadOk = 0;
	}

	if($imageFileType != 'jpg' && $imageFileType != 'png' && $imageFileType != 'jpeg' && $imageFileType != 'gif' ) {
	    $error = 'Los formatos aceptados son jpg, png, jpeg y gif';
	    $uploadOk = 0;
	}

	$size = getimagesize($_FILES['file-to-upload']['tmp_name']);
    if($type == 'view' && ($size == false || $size[0] < 600) ) {
        $error = 'La imagen debe de ser más grande o igual a 600 de ancho o está vacia';
        $uploadOk = 0;
    }

	if ($uploadOk == 0) {
	    echo ('{"status": "fail", "error": "Error: '.$error.'"}');
	} else {
	    if (move_uploaded_file($_FILES['file-to-upload']['tmp_name'], $target_dir_file)) {
	    	$img_height = $size[1];
	    	if ($type == 'view' && $size[0] > 600) {
    			$w_src = $size[0];  $h_src = $size[1];
    			$w_des = 600;       $h_des = (600*$h_src)/$w_src;
    			if ($imageFileType == 'jpg' || $imageFileType == 'jpeg') 	{ $src_img = imagecreatefromjpeg($target_dir_file); }      				
        		if ($imageFileType == 'png') 								{ $src_img = imagecreatefrompng($target_dir_file);  }
        		if ($imageFileType == 'gif')								{ $src_img = imagecreatefromgif($target_dir_file);  }
    			$des_img = imagecreatetruecolor($w_des, $h_des);
    			imagecopyresampled($des_img, $src_img, 0, 0, 0, 0, $w_des, $h_des, $w_src, $h_src);
				imagejpeg($des_img, $target_dir_file);
				imagedestroy($des_img);
				$img_height = $h_des;
    		}
	    	echo ('{"status": "success", "file": "' . basename($target_file) . '", "height": "'.$img_height.'"}');	        
	    } else {
	    	echo ('{"status": "fail", "error": "Error: No permision to move file to target dir"}');
	    }
	}
?>
