<?php
    require_once('Connections/bd_SELLOS.php');
    require_once('product-customizer/api/api-requests.php');
    $apiRequests = new ApiRequests();

    $error = '';
    $idCustom = 0;
    $idProvar = 0;
    $idCart = 0;
    $idPro = $_GET['IDpro'];
    $env = $_GET['env'];
    $idClient = ( isset($row_RecordsetUser['IDcli']) ? $row_RecordsetUser['IDcli'] : 0);
    $hideAddToCart = ( isset($_GET['hideAddToCart']) ? $_GET['hideAddToCart'] : false);
    $productName = $apiRequests->getProduct($idPro)[0]['Producto_esp'];
    if (!isset($_GET['env']) || $_GET['env']=='' || !isset($_GET['IDpro']) || $_GET['IDpro']=='' || is_null($productName)) {
        $error = 'Error Env o IDpro incorrectos';
    }
    else {
        if ($env == 'webmaster') {
            if (isset($_GET['IDcus']) && $_GET['IDcus']!=''){
                $idCustom = $_GET['IDcus'];
            }
            else {
                $idCustom = $apiRequests->getTemplateId($idPro)[0]['IDcus'];
                if ($idCustom === NULL){
                    $idCustom = 0; $error = 'Producto no tiene Customización template. No es customizable';
                }
            }
        }
        if ($env == 'front') {
            if (!isset($_GET['IDprovar']) || $_GET['IDprovar']=='') {
                $error = 'Error IDprovar incorrecto';
            }
            else {
                $idProvar = $_GET['IDprovar'];
                $idCart = $_SESSION["NumCarrito"];
                $imgVar = $apiRequests->getImgVar($idPro, $idProvar)[0]['Imagen_var'];
                $imgPro = $apiRequests->getImgPro($idPro)[0]['Imagen'];
                $idCustom = $apiRequests->getCustomUserId($idPro, $idCart, $idClient);
                if (is_null($idCustom)) {
                    $idCustom = $apiRequests->putCustom($idPro, $idCart, $idProvar, $idClient);
                }
            }
        }
    }
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Sellos y Rótulos</title>
    <link href="css/style.css" rel="stylesheet" type="text/css" />
    <link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css" rel="stylesheet" type="text/css" />
    <link href="product-customizer/vendor/colorpicker/jquery.colorpicker.css" rel="stylesheet" type="text/css" />
    <link href="product-customizer/styles.css" rel="stylesheet" type="text/css" />
    <link href='https://fonts.googleapis.com/css?family=Roboto+Slab' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js" type="text/javascript"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js"></script>
    <script src="product-customizer/vendor/colorpicker/jquery.colorpicker.js"></script>
    <script src="https://www.promisejs.org/polyfills/promise-6.1.0.js"></script>
    <script src="product-customizer/custom-elements.js" type="text/javascript"></script>
    <script src="product-customizer/view.js" type="text/javascript"></script>
    <script src="product-customizer/product-customizer.js" type="text/javascript"></script>
    <script type="text/javascript"> 
        $(document).ready(function(){
            $(document).tooltip();
            $.ajaxSetup({ cache: false });
            var idCustom = <?=$idCustom?>;
            var idProvar = <?=$idProvar?>;
            var idCart = '<?=$idCart?>';
            var error = '<?=$error?>';
            var idClient = <?=$idClient?>;
            var env = '<?=$env?>';
            var hideAddToCart = '<?=$hideAddToCart?>'

            var productCustomizer = new ProductCustomizer();
            if (error != '' || idCustom == 0) {
                productCustomizer.showMsg('Error', error);
            }
            else {
                productCustomizer.idCustom = idCustom;
                productCustomizer.idProvar = idProvar;
                productCustomizer.idCart = idCart;
                productCustomizer.idClient = idClient;
                productCustomizer.env = env;
                productCustomizer.hideAddToCart = hideAddToCart;
                productCustomizer.init();
            }
        });
    </script>
</head>

<body>
    <div id="product-customizer">
        <div class="col-1">
            <?php if(isset($imgVar) && $imgVar!='') { ?>
                <img class="prod-img" src="../js/timthumb.php?src=/../img/variant/max-<?=$imgVar?>&w=100&h=100&zc=1"/></li>
            <?php } else if ( $imgVar=='' && isset($imgPro) && $imgPro!='') { ?>
                <img class="prod-img" src="../js/timthumb.php?src=/../img/product/max-<?=$imgPro?>&w=100&h=100&zc=1"/></li>
            <?php } else { ?>
                <img class="prod-img" src="../js/timthumb.php?src=img/no-foto.png&w=100&h=100&zc=1" />
            <?php } ?>
            <ul id="nav-main"></ul>
        </div>
        <div class="col-2">
            <h1><?=$productName?></h1>
            <div id="wrapper-aux-menu"><div id="aux-menu"></div></div>
            <div id="toast"></div>
            <div id="saved"><span class="icon icon-save"></span>Guardado automáticamente</div>
            <div id="wrapper-view">
                <div id="view-col-1">
                    <div id="view"></div>
                </div>
                <div id="view-col-2">
                    <button id="btn-add-to-cart" type="button">Añadir a la cesta</button>
                    <ul id="nav-views"></ul>
                </div>
            </div>
            <div id="wrapper-msg-modal"></div>
            <div id="wrapper-upload-form"></div>
            <div id="wrapper-svg-picker"></div>
            <div id="wrapper-reset"></div>
            <div id="wrapper-edit-text"></div>
        </div>
        <div class="clear"></div>
    </div>
</body>
</html>
