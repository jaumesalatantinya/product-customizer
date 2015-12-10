<?php
if ($_GET['check-file'] == true){
	echo(hello);
	
	// $target_dir = "../img/custom/";
	// $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
	// $uploadOk = 1;
	// $imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
	// // Check if image file is a actual image or fake image
	// if(isset($_POST["submit"])) {
	//     $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
	//     if($check !== false) {
	//         echo "File is an image - " . $check["mime"] . ".";
	//         $uploadOk = 1;
	//     } else {
	//         echo "File is not an image.";
	//         $uploadOk = 0;
	//     }
	// }
}
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Sellos y Rótulos</title>
<link href="styles/style_window.css" rel="stylesheet" type="text/css" />
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"> </script> 

 
<script type="text/javascript"> 
$(document).ready(function(){
 
	$('.buttony').bind("click", function(e){
		e.preventDefault();
		$(this).css( {'display': 'none'} );	
		$('.loading').css( {'display': 'inline'} );
		 $.fancybox(
        {
            'href'              : 'http://www.google.com'
        }
        console.log('hello');
    ); 
	})
})	
</script> 

</head>
<body>
<div id="div_centrado">

    <h1>Añadir imágenes <span>(JPG - Medidas óptimas: 600x600 píxels)</span></h1>          
    <form method="post" enctype="multipart/form-data" action="">
    <div class="clear">
       <div class="col">
       <span>Seleccionar imagen</span><br/>
       	<input name="view-file" type="FILE" id="view-file">
       </div>
       <div class="clear"></div>
    </div>
       <input name="Submit" type="submit" value="Enviar imágenes" class="buttony"><img src="imagesWEB/loading.gif" class="loading" />
	</form>
    
</div>
</body>
</html>
