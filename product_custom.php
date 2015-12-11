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
    <link href="product-customizer/styles.css" rel="stylesheet" type="text/css" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script>
    <script src="product-customizer/custom-elements.js" type="text/javascript"></script>
    <script src="product-customizer/view.js" type="text/javascript"></script>
    <script src="product-customizer/product-customizer.js" type="text/javascript"></script>
    <script type="text/javascript"> 
        $(document).ready(function(){
            <?php require_once('menu_jquery.php'); ?>
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
    <script type="text/javascript" src="fancybox/jquery.mousewheel-3.0.4.pack.js"></script>
    <script type="text/javascript" src="fancybox/jquery.fancybox-1.3.4.pack.js"></script>
    <link rel="stylesheet" type="text/css" href="fancybox/jquery.fancybox-1.3.4.css" media="screen" />
</head>

<body>
    <div id="div_centrado">
        <div id="div_header">
            <div class="col_1">
                <a href="home.php" title="Sellos y Rótulos"><img src="imagesWEB/logo.png" alt="Sellos y Rótulos" /></a>
            </div>
            <div class="col_2">
                <ul>
                    <li><a href="#" title="<?php echo $_SESSION['MM_Empresa']; ?>" class="user"><?php echo $_SESSION['MM_Empresa']; ?></a></li>
                    <li><a href="<?php echo $logoutAction ?>" title="Cerrar sesión" class="session">Cerrar sesión</a></li>
                </ul>
            </div>
        </div>
        <div id="div_body">
            <h1>Productos</h1>
            <div class="col_1">
                <?php require_once('menu.php'); ?>
            </div>
            <div class="col_2">
                <ul class="menu">
                    <li><a href="list_product.php?<?php echo $queri; ?>" title="Productos">Productos</a></li>
                    <li><a href="#" title="Personalizar" class="activat">Personalizar</a></li>
                    <li></li>
                    <div class="clear"></div>
                </ul>
                <!-- <div class="row">
                    <form ACTION="<?php echo $page; ?>" method="get" id="form" name="form" >          
                        <label>
                            <a id="fancy" class="fancy show_popup" data-fancybox-type="iframe" href="product-customizer/api/file-uploader-view.php">Añadir imágenes</a>
                        </label>
                        <h2 class="red"><span>Producto:</span> <?php echo $row_Recordset2['Producto_esp']?></h2>
                        <div class="clear"></div>
                        <label>
                            <input name="Order2" id="Order2" type="hidden" value="POS_ima ASC" />
                        </label>
                        <label>
                            <input name="IDpro" id="IDpro" type="hidden" value="<?php echo $row_Recordset2['IDpro']?>" />
                        </label>
                    </form>
                </div> -->
                <div class="list">
                    <div id="product-customizer">
                        <div id="view"></div>
                        <ul id="nav-main"></ul>
                        <ul id="nav-views"></ul>
                        <div id="wrapper-modal">
                            <div class="modal">
                                <img /><p></p><a>close</a>
                            </div>
                        </div>
                        <div id="wrapper-upload-form">
                            <div class="modal">
                                <a href="#" class="btn-close">Close</a>
                                <form method="post" enctype="multipart/form-data" action="">
                                    <p>Añadir imágenes <span>(JPG - Medidas óptimas: 600x600 píxels)</span></p>
                                    <span>Seleccionar imagen</span><br/>
                                    <input id="file-to-upload" name="file-to-upload" type="file">
                                    <input id ="btn-submit" name="send" type="submit" value="Enviar imágenes">
                                    <img src="imagesWEB/loading.gif" class="loading" />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="clear"></div>
        </div>
    </div>
    <div id="div_footer">© Sellos y Rótulos</div>
</body>
</html>
