<?php require_once('../Connections/bd_SELLOS.php'); ?>
<?php $_SESSION['url']=$urli; ?>
<?php
/****************************************************************** Producto */
$colname_Recordset1 = "-1";
if (isset($_GET['IDpro']) && $_GET['IDpro']!='') {
  $colname_Recordset1 = $_GET['IDpro'];
}

$query_Recordset1 = sprintf("SELECT * FROM bd_productos LEFT JOIN bd_productos_ofertas ON (bd_productos.IDpro=bd_productos_ofertas.ID_pro) WHERE Producto_esp <> '' and IDpro=%s", GetSQLValueString($colname_Recordset1, "int"));
$Recordset1 = mysql_query($query_Recordset1, $bd_SELLOS);
$row_Recordset1 = mysql_fetch_assoc($Recordset1);
$totalRows_Recordset1 = mysql_num_rows($Recordset1);

if($totalRows_Recordset1<1){
    echo "<script language='Javascript'>location.href='index';</script>";
    exit;
}

/****************************************************************** Categoria seleccionada */
$colname_Recordset2 = "-1";
if (isset($row_Recordset1['ID_cat']) && $row_Recordset1['ID_cat']!='') {
  $colname_Recordset2 = $row_Recordset1['ID_cat'];
}
$query_Recordset2 = sprintf("SELECT * FROM bd_productos_categorias WHERE Categoria_esp <> '' and IDcat=%s", GetSQLValueString($colname_Recordset2, "int"));
$Recordset2 = mysql_query($query_Recordset2, $bd_SELLOS);
$row_Recordset2 = mysql_fetch_assoc($Recordset2);
$totalRows_Recordset2 = mysql_num_rows($Recordset2);  
//URLamigable
$id = $row_Recordset2['IDcat'];
$title = urls_amigables($row_Recordset2['Categoria_esp']);								 
$URLamigableCAT="landing/".$id."/".$title."";

$cate=$row_Recordset2['IDcat'];

/****************************************************************** Subcategoria seleccionada*/
$colname_Recordset3 = "-1";
if (isset($row_Recordset1['ID_subcat']) && $row_Recordset1['ID_subcat']!='') {
  $colname_Recordset3 = $row_Recordset1['ID_subcat'];
}
$query_Recordset3 = sprintf("SELECT * FROM bd_productos_subcat WHERE Subcategoria_esp <> '' and IDsubcat=%s", GetSQLValueString($colname_Recordset3, "int"));
$Recordset3 = mysql_query($query_Recordset3, $bd_SELLOS);
$row_Recordset3 = mysql_fetch_assoc($Recordset3);
$totalRows_Recordset3 = mysql_num_rows($Recordset3);  
//URLamigable
$id = $row_Recordset2['IDcat'];
$id2 = $row_Recordset3['IDsubcat'];
$title = urls_amigables($row_Recordset3['Subcategoria_esp']);								 
$URLamigableSUBCAT="subcategory/".$id."/".$id2."/".$title."";

$subcate=$row_Recordset3['IDsubcat'];

/****************************************************************** Subcategoria2 seleccionada*/
if (isset($row_Recordset1['ID_subcat2']) && $row_Recordset1['ID_subcat2']!='') {
	
	$colname_Recordset4 = $row_Recordset1['ID_subcat2'];
	
	$query_Recordset4 = sprintf("SELECT * FROM bd_productos_subcat2 WHERE Subcategoria2_esp <> '' and IDsubcat2=%s", GetSQLValueString($colname_Recordset4, "int"));
	$Recordset4 = mysql_query($query_Recordset4, $bd_SELLOS);
	$row_Recordset4 = mysql_fetch_assoc($Recordset4);
	$totalRows_Recordset4 = mysql_num_rows($Recordset4);  
	//URLamigable
	$id = $row_Recordset2['IDcat'];
	$id2 = $row_Recordset3['IDsubcat'];
	$id3 = $row_Recordset4['IDsubcat2'];
	$title = urls_amigables($row_Recordset4['Subcategoria2_esp']);								 
	$URLamigableSUBCAT2="subsubcategory/".$id."/".$id2."/".$id3."/".$title."";
	
	$subsubcate=$row_Recordset4['IDsubcat2'];
}

/****************************************************************** Marca*/
$colname_RecordsetMARCA = "-1";
if (isset($row_Recordset1['ID_mar']) && $row_Recordset1['ID_mar']!='') {
    $colname_RecordsetMARCA = $row_Recordset1['ID_mar'];
}
                                                    
$query_RecordsetMARCA = sprintf("SELECT * FROM bd_productos_marcas WHERE IDmar = %s LIMIT 1", GetSQLValueString($colname_RecordsetMARCA, "int"));
$RecordsetMARCA = mysql_query($query_RecordsetMARCA, $bd_SELLOS) or die(mysql_error());
$row_RecordsetMARCA = mysql_fetch_assoc($RecordsetMARCA);
$totalRows_RecordsetMARCA = mysql_num_rows($RecordsetMARCA);

/****************************************************************** Imagen */
$colname_RecordsetIMA = "-1";
if (isset($row_Recordset1['IDpro']) && $row_Recordset1['IDpro']!='') {
    $colname_RecordsetIMA = $row_Recordset1['IDpro'];
}
                                
$query_RecordsetIMA = sprintf("SELECT * FROM bd_productos_imagenes WHERE ID_pro=%s ORDER BY POS_ima", GetSQLValueString($colname_RecordsetIMA, "int"));
$RecordsetIMA = mysql_query($query_RecordsetIMA, $bd_SELLOS) or die(mysql_error());
$row_RecordsetIMA = mysql_fetch_assoc($RecordsetIMA);
$totalRows_RecordsetIMA = mysql_num_rows($RecordsetIMA);

/****************************************************************** PDF */
$colname_RecordsetPDF = "-1";
if (isset($row_Recordset1['IDpro']) && $row_Recordset1['IDpro']!='') {
    $colname_RecordsetPDF = $row_Recordset1['IDpro'];
}
                                
$query_RecordsetPDF = sprintf("SELECT * FROM bd_productos_documentos WHERE ID_pro=%s and Idioma = 'ESP' ORDER BY POS_doc", GetSQLValueString($colname_RecordsetPDF, "int"));
$RecordsetPDF = mysql_query($query_RecordsetPDF, $bd_SELLOS) or die(mysql_error());
$row_RecordsetPDF = mysql_fetch_assoc($RecordsetPDF);
$totalRows_RecordsetPDF = mysql_num_rows($RecordsetPDF);

/****************************************************************** Variantes*/
$colname_RecordsetEUROS = "-1";
if (isset($row_Recordset1['IDpro']) && $row_Recordset1['IDpro']!='') {
    $colname_RecordsetEUROS = $row_Recordset1['IDpro'];
}
$colname2_RecordsetEUROS = "-1";
if (isset($_GET['IDprovar']) && $_GET['IDprovar']!='') {
    $colname2_RecordsetEUROS = $_GET['IDprovar'];
}
if (isset($_POST['for']) && $_POST['for']!='') {
    $colname2_RecordsetEUROS = $_POST['for'];
}
if($colname_RecordsetEUROS!="-1" && $colname2_RecordsetEUROS=="-1"){                                               
    $query_RecordsetEUROS = sprintf("SELECT * FROM bd_productos_variantes WHERE ID_pro = %s ORDER BY POS_provar, IDprovar DESC LIMIT 1", GetSQLValueString($colname_RecordsetEUROS, "int"));
}else if($colname_RecordsetEUROS!="-1" && $colname2_RecordsetEUROS!="-1"){ 
    $query_RecordsetEUROS = sprintf("SELECT * FROM bd_productos_variantes WHERE ID_pro = %s and IDprovar = %s LIMIT 1", GetSQLValueString($colname_RecordsetEUROS, "int"), GetSQLValueString($colname2_RecordsetEUROS, "int"));
}
$RecordsetEUROS = mysql_query($query_RecordsetEUROS, $bd_SELLOS) or die(mysql_error());
$row_RecordsetEUROS = mysql_fetch_assoc($RecordsetEUROS);
$totalRows_RecordsetEUROS = mysql_num_rows($RecordsetEUROS);


/****************************************************************** Total de variantes 1 (talla, capacitat, color...) */
$colname_RecordsetEUROS_2 = "-1";
if (isset($row_Recordset1['IDpro']) && $row_Recordset1['IDpro']!='') {
    $colname_RecordsetEUROS_2 = $row_Recordset1['IDpro'];
}
                                                    
$query_RecordsetEUROS_2 = sprintf("SELECT * FROM bd_productos_variantes INNER JOIN bd_productos_variant ON (bd_productos_variantes.ID_var=bd_productos_variant.IDvar) WHERE ID_pro = %s GROUP BY ID_var ORDER BY POS_var", GetSQLValueString($colname_RecordsetEUROS_2, "int"));
$RecordsetEUROS_2 = mysql_query($query_RecordsetEUROS_2, $bd_SELLOS) or die(mysql_error());
$row_RecordsetEUROS_2 = mysql_fetch_assoc($RecordsetEUROS_2);
$totalRows_RecordsetEUROS_2 = mysql_num_rows($RecordsetEUROS_2);

/****************************************************************** Total de variantes 2 (talla, capacitat, color...) */
$colname_RecordsetEUROS_22 = "-1";
if (isset($row_Recordset1['IDpro']) && $row_Recordset1['IDpro']!='') {
    $colname_RecordsetEUROS_22 = $row_Recordset1['IDpro'];
}
                                                    
$query_RecordsetEUROS_22 = sprintf("SELECT * FROM bd_productos_variantes INNER JOIN bd_productos_variant ON (bd_productos_variantes.ID2_var=bd_productos_variant.IDvar) WHERE ID_pro = %s and ID2_var <> 0 GROUP BY ID2_var ORDER BY POS_var", GetSQLValueString($colname_RecordsetEUROS_22, "int"));
$RecordsetEUROS_22 = mysql_query($query_RecordsetEUROS_22, $bd_SELLOS) or die(mysql_error());
$row_RecordsetEUROS_22 = mysql_fetch_assoc($RecordsetEUROS_22);
$totalRows_RecordsetEUROS_22 = mysql_num_rows($RecordsetEUROS_22); 


//Contador de visitas
if ($totalRows_Recordset1 > 0) {
    $valor_visita=(int)$row_Recordset1['Visitas_esp']+1;
     $ssql = sprintf("UPDATE bd_productos SET Visitas_esp=$valor_visita WHERE IDpro=%s", GetSQLValueString($colname_Recordset1, "int"));
     $Result = mysql_query($ssql, $bd_SELLOS) or die(mysql_error());
}
?>

<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<title><?=$row_Recordset1['Producto_esp'];?> | Sellos y rótulos</title>
<?php include("includes/head.php"); ?>
<script type="text/javascript">
    $(document).ready(function(){
    });
</script>
</head>

<body id="product">
	<div id="div_wrapper">
    	<?php include("includes/header.php"); ?>
        <div id="div_ruta">
            <div class="contingut">
                <div class="container">
                    <a href="index" title="Inicio">Inicio</a> / <a href="<?php echo $URLamigableCAT; ?>" title="<?php echo $row_Recordset2['Categoria_esp']; ?>"><?php echo $row_Recordset2['Categoria_esp']; ?></a> / <a href="<?php echo $URLamigableSUBCAT; ?>" title="<?php echo $row_Recordset3['Subcategoria_esp']; ?>"><?php echo $row_Recordset3['Subcategoria_esp']; ?></a> 
                    <?php if($totalRows_Recordset4>0){ ?>
                        / <a href="<?php echo $URLamigableSUBCAT2; ?>" title="<?php echo $row_Recordset4['Subcategoria2_esp']; ?>"><?php echo $row_Recordset4['Subcategoria2_esp']; ?></a>
                    <?php } ?>
                        / <strong><?php echo $row_Recordset1['Producto_esp']; ?></strong>
                </div><!-- end container -->
            </div>
        </div><!-- end div_ruta --> 
                              
        <div id="div_content">
        	<div class="container">               
                <div id="div_titulo">
                    <div class="columna">
                    	<?php if(isset($row_RecordsetMARCA['Logo']) && $row_RecordsetMARCA['Logo']!=''){ ?>
                        <img src="../img/brand/logo_<?=$row_RecordsetMARCA['Logo']?>" alt="<?=$row_RecordsetMARCA['Marca']?>" width="113">
                        <?php } ?>
                        <h1 id="prod"><?=$row_Recordset1['Producto_esp'];?></h1>
                        <?php if ( isset($row_Recordset1['W_anchura']) && $row_Recordset1['W_anchura'] != '' && isset($row_Recordset1['H_altura']) && $row_Recordset1['H_altura'] != '' && isset($row_Recordset1['Unidad']) && $row_Recordset1['Unidad'] != '' ) { ?> 
                            <p><?=$row_Recordset1['W_anchura'];?>x<?=$row_Recordset1['H_altura'];?><?=$row_Recordset1['Unidad'];?></p>
                        <?php } ?>
                    </div>
                    <div class="columna precios">
                        <?php if(isset($row_RecordsetEUROS['Descuento_pro']) && $row_RecordsetEUROS['Descuento_pro']>0){ ?>
                            <p class="ant"><?=number_format($row_RecordsetEUROS['Precio_total']*$iva, 2, ",",".");?>€</p>
                            <p class="preu">
                                <?php
                                    $precio0=$row_RecordsetEUROS['Precio_total'];
                                    $precio1=($precio0*$row_RecordsetEUROS['Descuento_pro'])/100;   
                                    $precio2=number_format(($precio0-$precio1)*$iva, 2, ",",".");
                                    echo $precio2 . "€";
                                ?>
                            </p>
                        <?php }else { ?>
                        <p class="preu"><?php echo number_format($row_RecordsetEUROS['Precio_total']*$iva, 2, ",",".");?>€</p>
                        <?php } ?>
                    </div>
                </div>
                <div class="row">
                    <div class="column col-xs-6">
                        <div class="columna1">
                            <?php if(isset($row_RecordsetEUROS['Descuento_pro']) && $row_RecordsetEUROS['Descuento_pro']>0){ ?>
                               <div class="discount">-<?=$row_RecordsetEUROS['Descuento_pro'];?>%</div>
                            <?php } ?>
                            <?php if($totalRows_RecordsetIMA>0 || (isset($row_RecordsetEUROS['Imagen_var']) && $row_RecordsetEUROS['Imagen_var']!='')){ ?>
                                <ul id="glasscase" class="gc-start">
                                    <?php if(isset($row_RecordsetEUROS['Imagen_var']) && $row_RecordsetEUROS['Imagen_var']!=''){ ?>
                                    <li><img src="../js/timthumb.php?src=/../img/variant/max-<?php echo $row_RecordsetEUROS['Imagen_var']; ?>&w=585&h=440&zc=1" alt="<?php echo $row_Recordset1['Producto_esp']; ?>"/></li>
                                    <?php } ?>
									<?php do { ?>
                                        <li><img src="../js/timthumb.php?src=/../img/product/max-<?php echo $row_RecordsetIMA['Imagen']; ?>&w=585&h=440&zc=1" <?php if(isset($row_RecordsetIMA['Texti_esp']) && $row_RecordsetIMA['Texti_esp']!=''){ ?>alt="<?php echo $row_RecordsetIMA['Texti_esp']; ?>"<?php }else{ ?>alt="<?php echo $row_Recordset1['Producto_esp']; ?>"<?php } ?> /></li>
                                    <?php } while ($row_RecordsetIMA = mysql_fetch_assoc($RecordsetIMA)); ?>
                                </ul>
                            <?php }else { ?>
                                <div><img src="../js/timthumb.php?src=img/no-foto.png&w=530&h=409&zc=1" alt="<?php echo $row_Recordset1['Producto_esp']; ?>"></div>
                            <?php } ?> 
                        </div>
                    </div>
                    <div class="column col-xs-6">
                            <?php /************************************************************************/ ?>
                            <?php if($totalRows_RecordsetEUROS_2>0 && $totalRows_RecordsetEUROS_22<1){ ?>
                            <?php
                            /*********************************************** Valores variantes 1 (sense variants 2) (talla M, talla L, Color Blanc, Color negre..) */
                            $colname_RecordsetEUROS_3 = "-1";
                            if (isset($row_RecordsetEUROS_2['IDvar']) && $row_RecordsetEUROS_2['IDvar']!='') {
                                $colname_RecordsetEUROS_3 = $row_RecordsetEUROS_2['IDvar'];
                            }
                                                                                
                            $query_RecordsetEUROS_3 = sprintf("SELECT * FROM bd_productos_variantes INNER JOIN bd_productos_variant2 ON (bd_productos_variantes.ID_var2=bd_productos_variant2.IDvar2) WHERE ID_pro = %s and bd_productos_variantes.ID_var = %s GROUP BY Variante2_esp ORDER BY POS_provar", GetSQLValueString($colname_RecordsetEUROS_2, "int"), GetSQLValueString($colname_RecordsetEUROS_3, "int"));
                            $RecordsetEUROS_3 = mysql_query($query_RecordsetEUROS_3, $bd_SELLOS) or die(mysql_error());
                            $row_RecordsetEUROS_3 = mysql_fetch_assoc($RecordsetEUROS_3);
                            $totalRows_RecordsetEUROS_3 = mysql_num_rows($RecordsetEUROS_3);
                            ?>
                                <?php if($totalRows_RecordsetEUROS_3>0){ ?>
                                <form method="post" id="formFOR" name="formFOR" action="#">
                                      <div class="variable">
                                            <p><?php echo $row_RecordsetEUROS_2['Variante_esp']; ?></p>
                                            <select name="for" id="for" class="casella">
                                                <?php do{ ?>
                                                <option value="<?php echo $row_RecordsetEUROS_3['IDprovar']; ?>"<?php if($row_RecordsetEUROS_3['IDprovar']==$row_RecordsetEUROS['IDprovar']){ ?> selected<?php } ?>><?php echo $row_RecordsetEUROS_3['Variante2_esp']; ?></option>
                                                <?php } while ($row_RecordsetEUROS_3 = mysql_fetch_assoc($RecordsetEUROS_3)); ?>
                                                <?php mysql_free_result($RecordsetEUROS_3); ?>
                                            </select>
                                       </div>
                                </form>
                                <div class="clear"></div>
                                <?php } ?>
                            <?php } ?>
                            
                            <?php if($totalRows_RecordsetEUROS_2>0 && $totalRows_RecordsetEUROS_22>0){ ?>
                            <?php
                            /********************************************* Valores variantes 1 (amb variants 2)(talla M, talla L, Color Blanc, Color negre..) */
                            $colname_RecordsetEUROS_3 = "-1";
                            if (isset($row_RecordsetEUROS_2['IDvar']) && $row_RecordsetEUROS_2['IDvar']!='') {
                                $colname_RecordsetEUROS_3 = $row_RecordsetEUROS_2['IDvar'];
                            }
                                                                                
                            $query_RecordsetEUROS_3 = sprintf("SELECT * FROM bd_productos_variantes INNER JOIN bd_productos_variant2 ON (bd_productos_variantes.ID_var2=bd_productos_variant2.IDvar2) WHERE ID_pro = %s and bd_productos_variantes.ID_var = %s GROUP BY Variante2_esp ORDER BY POS_provar", GetSQLValueString($colname_RecordsetEUROS_2, "int"), GetSQLValueString($colname_RecordsetEUROS_3, "int"));
                            $RecordsetEUROS_3 = mysql_query($query_RecordsetEUROS_3, $bd_SELLOS) or die(mysql_error());
                            $row_RecordsetEUROS_3 = mysql_fetch_assoc($RecordsetEUROS_3);
                            $totalRows_RecordsetEUROS_3 = mysql_num_rows($RecordsetEUROS_3);
                            ?>
                                <?php if($totalRows_RecordsetEUROS_3>0){ ?>
                                <form method="post" id="formFOR_no" name="formFOR_no" action="#">
                                      <div class="variable">
                                            <p><?php echo $row_RecordsetEUROS_2['Variante_esp']; ?></p>
                                            <select name="for_no" id="for_no" class="casella_no">
                                                <?php do{ ?>
                                                <option value="<?php echo $row_RecordsetEUROS_3['IDprovar']; ?>"<?php if($row_RecordsetEUROS_3['ID_var2']==$row_RecordsetEUROS['ID_var2']){ ?> selected<?php } ?>><?php echo $row_RecordsetEUROS_3['Variante2_esp']; ?></option>
                                                <?php } while ($row_RecordsetEUROS_3 = mysql_fetch_assoc($RecordsetEUROS_3)); ?>
                                                <?php mysql_free_result($RecordsetEUROS_3); ?>
                                            </select>
                                       </div>
                                </form>
                                <?php } ?>
                            <?php } ?>
                            
                            <?php if($totalRows_RecordsetEUROS_22>0){ ?>
                            <?php
                            /****************************************************************** Valores variantes 2 (talla M, talla L, Color Blanc, Color negre..) */
                            $colname_RecordsetEUROS_33 = "-1";
                            if (isset($row_RecordsetEUROS_22['IDvar']) && $row_RecordsetEUROS_22['IDvar']!='') {
                                $colname_RecordsetEUROS_33 = $row_RecordsetEUROS_22['IDvar'];
                            }
                                                                                
                            $query_RecordsetEUROS_33 = sprintf("SELECT * FROM bd_productos_variantes INNER JOIN bd_productos_variant2 ON (bd_productos_variantes.ID2_var2=bd_productos_variant2.IDvar2) WHERE ID_pro = %s and bd_productos_variantes.ID_var2 = %s and bd_productos_variantes.ID2_var = %s ORDER BY POS_provar", GetSQLValueString($colname_RecordsetEUROS_22, "int"), GetSQLValueString($row_RecordsetEUROS['ID_var2'], "int"), GetSQLValueString($colname_RecordsetEUROS_33, "int"));
                            
                            $RecordsetEUROS_33 = mysql_query($query_RecordsetEUROS_33, $bd_SELLOS) or die(mysql_error());
                            $row_RecordsetEUROS_33 = mysql_fetch_assoc($RecordsetEUROS_33);
                            $totalRows_RecordsetEUROS_33 = mysql_num_rows($RecordsetEUROS_33);
                            ?>
                                <?php if($totalRows_RecordsetEUROS_33>0){ ?>
                                <form method="post" id="formFOR" name="formFOR" action="#">
                                      <div class="variable">
                                            <p><?php echo $row_RecordsetEUROS_22['Variante_esp']; ?></p>
                                            <select name="for" id="for" class="casella">
                                                <?php do{ ?>
                                                <option value="<?php echo $row_RecordsetEUROS_33['IDprovar']; ?>"<?php if($row_RecordsetEUROS_33['IDprovar']==$row_RecordsetEUROS['IDprovar']){ ?> selected<?php } ?>><?php echo $row_RecordsetEUROS_33['Variante2_esp']; ?></option>
                                                <?php } while ($row_RecordsetEUROS_33 = mysql_fetch_assoc($RecordsetEUROS_33)); ?>
                                                <?php mysql_free_result($RecordsetEUROS_33); ?>
                                            </select>
                                            <input type="hidden" name="for" value="" id="comodi">
                                       </div>
                                </form>
                                <?php } ?>
                            <?php } ?>
                            <?php /************************************************************************/ ?>
                        <div class="unidades">
                            <p>Unidades</p>
                            <select name="unidades" id="unidades">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                                <option value="13">13</option>
                                <option value="14">14</option>
                                <option value="15">15</option>
                                <option value="16">16</option>
                                <option value="17">17</option>
                                <option value="18">18</option>
                                <option value="19">19</option>
                                <option value="20">20</option>
                            </select>
                            <input type="hidden" name="IDpro" id="IDpro" value="<?php echo $row_Recordset1['IDpro']; ?>">
                            <input type="hidden" name="IDprovar" id="IDprovar" value="<?php echo $row_RecordsetEUROS['IDprovar']; ?>">
                        </div>
                        <?php if ($row_Recordset1['Personalizar'] == '1') { ?>
                            <a href="product_custom.php?env=front&IDpro=<?=$row_Recordset1['IDpro']?>&IDprovar=<?=$row_RecordsetEUROS['IDprovar']?>" class="fancy_open" id="cesta2">Personalizar</a>
                        <?php } else { ?>
                            <a title="Añadir a la cesta" id="cesta">Añadir a la cesta</a>
                        <?php } ?>
						<?php if ( (isset($row_Recordset1['Descr_esp']) && $row_Recordset1['Descr_esp'] != '') || ($totalRows_RecordsetPDF > 0) ) { ?>
                            <div id="div_informacion">
                                <div class="top-info">
                                    <?php if (isset($row_Recordset1['Descr_esp']) && $row_Recordset1['Descr_esp'] != '') { ?>
                                        <a title="Descripción" id="menu_desc">Descripción</a>
                                    <?php } ?>
                                    <?php if ($totalRows_RecordsetPDF > 0) { ?>
                                        <a title="Documentos" id="menu_docs">Documentos</a>
                                    <?php } ?>
                                </div>
                                <?php if (isset($row_Recordset1['Descr_esp']) && $row_Recordset1['Descr_esp'] != '') { ?>
                                    <div id="info_desc" class="info-ficha">
                                        <h3><?=$row_Recordset1['Titular_esp']?></h3>
                                        <p><?=nl2br($row_Recordset1['Descr_esp'])?></p>
                                    </div>
                                <?php } ?>
                                <?php if ($totalRows_RecordsetPDF > 0) { ?>
                                    <div id="info_docs" class="info-ficha">
                                        <h3>Documentos</h3>
                                        <ul>
                                            <?php do{ ?>
                                            <li><a href="../doc/product/<?php echo $row_RecordsetPDF['Documento']; ?>" title="<?php if(isset($row_RecordsetPDF['Texti']) && $row_RecordsetPDF['Texti']!=''){ ?><?php echo $row_RecordsetPDF['Texti']; ?><?php }else{ ?>Descargar<?php } ?>" target="_blank"><?php if(isset($row_RecordsetPDF['Texti']) && $row_RecordsetPDF['Texti']!=''){ ?><?php echo $row_RecordsetPDF['Texti']; ?><?php }else{ ?>Descargar<?php } ?></a></li>
                                            <?php } while ($row_RecordsetPDF = mysql_fetch_assoc($RecordsetPDF)); ?>
                                        </ul>
                                    </div>
                                <?php } ?>
                            </div><!-- end div_descripcion -->
                        <?php } ?>
                    </div>
                </div>
            </div><!-- end container -->
        
            <div id="div_destacados">
            	<h2>Productos relacionados</h2>
            	<div class="container">
                	<div class="row">
                    	<div class="columna col-xs-6 col-sm-3">
                        	<a href="t-product" title="Nombre producto">
                                <img src="../js/timthumb.php?src=beta/img/product/product1.png&w=255&h=255&zc=1" alt="Nombre producto">
                                <p class="price">
                                    <span>Desde</span><br>
                                    14,75€
                                </p>
                                <p>Nombre producto<br>
                                <span>Descripció lorem ipsum</span></p>
                            </a>
                        </div>
                        <div class="columna col-xs-6 col-sm-3">
                        	<a href="t-product" title="Nombre producto">
                                <div class="discount">-25%</div>
                                <img src="../js/timthumb.php?src=beta/img/product/product2.png&w=255&h=255&zc=1" alt="Nombre producto">
                                <p class="price">
                                    <span>Desde</span><br>
                                    <span class="ant">8,75€</span><br>
                                    6,75€
                                </p>
                                <p>Sellos automáticos para ropa<br>
                                <span>Descripció lorem ipsum</span></p>
                            </a>
                        </div>
                        <div class="columna col-xs-6 col-sm-3">
                        	<a href="t-product" title="Nombre producto">
                                <img src="../js/timthumb.php?src=beta/img/product/product3.png&w=255&h=255&zc=1" alt="Nombre producto">
                                <p class="price">
                                    <span>Desde</span><br>
                                    7,80€
                                </p>
                                <p>Tintas para sellos<br>
                                <span>Descripció lorem ipsum</span></p>
                            </a>
                        </div>
                        <div class="none columna col-xs-6 col-sm-3">
                        	<a href="t-product" title="Nombre producto">
                                <img src="../js/timthumb.php?src=beta/img/product/product4.png&w=255&h=255&zc=1" alt="Nombre producto">
                                <p class="price">
                                    <span>Desde</span><br>
                                    42,50€
                                </p>
                                <p>Sellos automáticos para ropa<br>
                                <span>Descripció lorem ipsum</span></p>
                            </a>
                        </div>
                    </div>
                </div>
            </div><!-- end div_destacados -->
        </div><!-- end div_content -->
        <?php include("includes/footer.php"); ?>
    </div>
</body>
</html>

<?php
mysql_free_result($Recordset1);
mysql_free_result($Recordset2);
mysql_free_result($Recordset3);
if (isset($row_Recordset1['ID_subcat2']) && $row_Recordset1['ID_subcat2']!='') {
	mysql_free_result($Recordset4);
}
mysql_free_result($RecordsetMARCA);
mysql_free_result($RecordsetIMA);
mysql_free_result($RecordsetPDF);
mysql_free_result($RecordsetEUROS);
mysql_free_result($RecordsetEUROS_2);
mysql_free_result($RecordsetEUROS_22);
mysql_free_result($RecordsetRELACIONES);
?>
