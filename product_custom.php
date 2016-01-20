<?php
    require_once('Connections/bd_start.php'); 
?>
<?php
    $colname_Recordset2 = "-1";
    if (isset($_GET['IDpro']) && $_GET['IDpro']!='') {
        $colname_Recordset2 = $_GET['IDpro'];
    }

    $query_Recordset2 = sprintf("SELECT * FROM bd_productos WHERE IDpro=%s", GetSQLValueString($colname_Recordset2, "int"));
    $Recordset2 = mysql_query($query_Recordset2, $bd_SELLOS) or die(mysql_error());
    $row_Recordset2 = mysql_fetch_assoc($Recordset2);
    $totalRows_Recordset2 = mysql_num_rows($Recordset2);

    if ($totalRows_Recordset2<1){
        echo "<script language='Javascript'>location.href='list_product.php';</script>";
        exit;
    }
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Sellos y Rótulos</title>
    <link href="styles/style.css" rel="stylesheet" type="text/css" />
    <link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css" rel="stylesheet" type="text/css" />
    <link href="product-customizer/vendor/colorpicker/jquery.colorpicker.css" rel="stylesheet" type="text/css" />
    <link href="product-customizer/styles.css" rel="stylesheet" type="text/css" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js" type="text/javascript"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js"></script>
    <script src="product-customizer/vendor/colorpicker/jquery.colorpicker.js"></script>
    <script src="product-customizer/custom-elements.js" type="text/javascript"></script>
    <script src="product-customizer/view.js" type="text/javascript"></script>
    <script src="product-customizer/product-customizer.js" type="text/javascript"></script>
    <script type="text/javascript"> 
        $(document).ready(function(){
            var idProd = <?=$_GET['IDpro']?>;
            var productCustomizer = new ProductCustomizer();
            $.getJSON('product-customizer/api/api.php?request=get-custom-template-id&IDpro='+idProd)
            .done(function(custom){
                if (custom){
                    productCustomizer.idCustom = custom[0].IDcus;
                    productCustomizer.init();
                }
                else { productCustomizer.showMsg('Error', 'No template customization to load'); }
            })
            .fail(function(){ productCustomizer.showMsg('Error', 'API No template customization to load'); });
        });
    </script> 
</head>

<body>
    <div id="product-customizer">
        <div class="col-1">
            <img src="imagesWEB/logo.png" width="228" alt="Sellos y Rótulos" />
            <ul id="nav-main"></ul>
        </div>
        <div class="col-2">
            <h1><?php echo $row_Recordset2['Producto_esp']?></h1>
            <div id="wrapper-aux-menu"><div id="aux-menu"></div></div>
            <div id="toast"></div>
            <div id="wrapper-view"><div id="view"></div></div>
            <ul id="nav-views"></ul>
            <div id="wrapper-msg-modal"></div>
            <div id="wrapper-upload-form"></div>
            <div id="wrapper-svg-picker"></div>
        </div>
        <div class="clear"></div>
    </div>
</body>
</html>
