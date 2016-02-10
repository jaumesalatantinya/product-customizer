<?php require_once('Connections/bd_start.php'); ?>
<?php
/****************************************************************** Lista*/

$currentPage = $_SERVER["PHP_SELF"];

$maxRows_Recordset1 = 50;
$pageNum_Recordset1 = 0;
if (isset($_GET['pageNum_Recordset1'])) {
  $pageNum_Recordset1 = $_GET['pageNum_Recordset1'];
}
$startRow_Recordset1 = $pageNum_Recordset1 * $maxRows_Recordset1;

/*******/

$colname_Recordset1 = "-1";
if (isset($_GET['Search']) && $_GET['Search']!='') {
  $colname_Recordset1 = $_GET['Search'];
}

$colname2_Recordset1 = "-1";
if (isset($_GET['Filter']) && $_GET['Filter']!='') {
  $colname2_Recordset1 = $_GET['Filter'];
}

$colname3_Recordset1 = "-1";
if (isset($_GET['Filter2']) && $_GET['Filter2']!='') {
  $colname3_Recordset1 = $_GET['Filter2'];
}

$colname4_Recordset1 = "-1";
if (isset($_GET['Filter3']) && $_GET['Filter3']!='') {
  $colname4_Recordset1 = $_GET['Filter3'];
}

$colname5_Recordset1 = "-1";
if (isset($_GET['Filter4']) && $_GET['Filter4']!='') {
  $colname5_Recordset1 = $_GET['Filter4'];
}

$colname6_Recordset1 = "POS_pro ASC";
if (isset($_GET['Order']) && $_GET['Order']!='') {
  $colname6_Recordset1 = $_GET['Order'];
}


if($colname_Recordset1=='-1' && $colname2_Recordset1=='-1' && $colname3_Recordset1=='-1' && $colname4_Recordset1=='-1' && $colname5_Recordset1=='-1'){
	$query_Recordset1 = "SELECT *,(Visitas+Visitas_esp+Visitas_eng) AS 'Visitas_totales' FROM bd_productos ORDER BY $colname6_Recordset1, IDpro DESC";
}
if($colname_Recordset1!='-1' && $colname2_Recordset1=='-1' && $colname3_Recordset1=='-1' && $colname4_Recordset1=='-1' && $colname5_Recordset1=='-1'){
	$query_Recordset1 = sprintf("SELECT *,(Visitas+Visitas_esp+Visitas_eng) AS 'Visitas_totales' FROM bd_productos LEFT JOIN bd_distribuidores ON (bd_productos.ID_dis=bd_distribuidores.IDdis) WHERE (Producto_esp LIKE %s or Titular_esp LIKE %s or Descr_esp LIKE %s or Empresa LIKE %s) ORDER BY $colname6_Recordset1, IDpro DESC", GetSQLValueString("%" . $colname_Recordset1 . "%", "text"), GetSQLValueString("%" . $colname_Recordset1 . "%", "text"), GetSQLValueString("%" . $colname_Recordset1 . "%", "text"), GetSQLValueString("%" . $colname_Recordset1 . "%", "text"));
}
/***/
if($colname_Recordset1!='-1' && $colname2_Recordset1!='-1' && $colname3_Recordset1=='-1' && $colname4_Recordset1=='-1' && $colname5_Recordset1=='-1'){
	$query_Recordset1 = sprintf("SELECT *,(Visitas+Visitas_esp+Visitas_eng) AS 'Visitas_totales' FROM bd_productos LEFT JOIN bd_distribuidores ON (bd_productos.ID_dis=bd_distribuidores.IDdis) WHERE (Producto_esp LIKE %s or Titular_esp LIKE %s or Descr_esp LIKE %s or Empresa LIKE %s) and ID_cat = %s ORDER BY $colname6_Recordset1, IDpro DESC", GetSQLValueString("%" . $colname_Recordset1 . "%", "text"), GetSQLValueString("%" . $colname_Recordset1 . "%", "text"), GetSQLValueString("%" . $colname_Recordset1 . "%", "text"), GetSQLValueString("%" . $colname_Recordset1 . "%", "text"), GetSQLValueString($colname2_Recordset1, "int"));
}
if($colname_Recordset1!='-1' && $colname2_Recordset1!='-1' && $colname3_Recordset1!='-1' && $colname4_Recordset1=='-1' && $colname5_Recordset1=='-1'){
	$query_Recordset1 = sprintf("SELECT *,(Visitas+Visitas_esp+Visitas_eng) AS 'Visitas_totales' FROM bd_productos LEFT JOIN bd_distribuidores ON (bd_productos.ID_dis=bd_distribuidores.IDdis) WHERE (Producto_esp LIKE %s or Titular_esp LIKE %s or Descr_esp LIKE %s or Empresa LIKE %s) and ID_cat = %s  and ID_subcat = %s ORDER BY $colname6_Recordset1, IDpro DESC, IDpro DESC", GetSQLValueString("%" . $colname_Recordset1 . "%", "text"), GetSQLValueString("%" . $colname_Recordset1 . "%", "text"), GetSQLValueString("%" . $colname_Recordset1 . "%", "text"), GetSQLValueString("%" . $colname_Recordset1 . "%", "text"), GetSQLValueString($colname2_Recordset1, "int"), GetSQLValueString($colname3_Recordset1, "int"));
}
if($colname_Recordset1!='-1' && $colname2_Recordset1!='-1' && $colname3_Recordset1!='-1' && $colname4_Recordset1!='-1' && $colname5_Recordset1=='-1'){
	$query_Recordset1 = sprintf("SELECT *,(Visitas+Visitas_esp+Visitas_eng) AS 'Visitas_totales' FROM bd_productos LEFT JOIN bd_distribuidores ON (bd_productos.ID_dis=bd_distribuidores.IDdis) WHERE (Producto_esp LIKE %s or Titular_esp LIKE %s or Descr_esp LIKE %s or Empresa LIKE %s) and ID_cat = %s and ID_subcat = %s and ID_subcat2 = %s ORDER BY $colname6_Recordset1, IDpro DESC", GetSQLValueString("%" . $colname_Recordset1 . "%", "text"), GetSQLValueString("%" . $colname_Recordset1 . "%", "text"), GetSQLValueString("%" . $colname_Recordset1 . "%", "text"), GetSQLValueString("%" . $colname_Recordset1 . "%", "text"), GetSQLValueString($colname2_Recordset1, "int"), GetSQLValueString($colname3_Recordset1, "int"), GetSQLValueString($colname4_Recordset1, "int"));
}
if($colname_Recordset1!='-1' && $colname2_Recordset1!='-1' && $colname3_Recordset1!='-1' && $colname4_Recordset1!='-1' && $colname5_Recordset1!='-1'){
	$query_Recordset1 = sprintf("SELECT *,(Visitas+Visitas_esp+Visitas_eng) AS 'Visitas_totales' FROM bd_productos LEFT JOIN bd_distribuidores ON (bd_productos.ID_dis=bd_distribuidores.IDdis) WHERE (Producto_esp LIKE %s or Titular_esp LIKE %s or Descr_esp LIKE %s or Empresa LIKE %s) and ID_cat = %s and ID_subcat = %s and ID_subcat2 = %s and ID_subcat3 = %s ORDER BY $colname6_Recordset1, IDpro DESC", GetSQLValueString("%" . $colname_Recordset1 . "%", "text"), GetSQLValueString("%" . $colname_Recordset1 . "%", "text"), GetSQLValueString("%" . $colname_Recordset1 . "%", "text"), GetSQLValueString("%" . $colname_Recordset1 . "%", "text"), GetSQLValueString($colname2_Recordset1, "int"), GetSQLValueString($colname3_Recordset1, "int"), GetSQLValueString($colname4_Recordset1, "int"), GetSQLValueString($colname5_Recordset1, "int"));
}
/***/
if($colname_Recordset1=='-1' && $colname2_Recordset1!='-1' && $colname3_Recordset1=='-1' && $colname4_Recordset1=='-1' && $colname5_Recordset1=='-1'){
	$query_Recordset1 = sprintf("SELECT *,(Visitas+Visitas_esp+Visitas_eng) AS 'Visitas_totales' FROM bd_productos LEFT JOIN bd_distribuidores ON (bd_productos.ID_dis=bd_distribuidores.IDdis) WHERE ID_cat = %s ORDER BY $colname6_Recordset1, IDpro DESC", GetSQLValueString($colname2_Recordset1, "int"));
}
if($colname_Recordset1=='-1' && $colname2_Recordset1!='-1' && $colname3_Recordset1!='-1' && $colname4_Recordset1=='-1' && $colname5_Recordset1=='-1'){
	$query_Recordset1 = sprintf("SELECT *,(Visitas+Visitas_esp+Visitas_eng) AS 'Visitas_totales' FROM bd_productos WHERE ID_cat = %s  and ID_subcat = %s ORDER BY $colname6_Recordset1, IDpro DESC", GetSQLValueString($colname2_Recordset1, "int"), GetSQLValueString($colname3_Recordset1, "int"));
}
if($colname_Recordset1=='-1' && $colname2_Recordset1!='-1' && $colname3_Recordset1!='-1' && $colname4_Recordset1!='-1' && $colname5_Recordset1=='-1'){
	$query_Recordset1 = sprintf("SELECT *,(Visitas+Visitas_esp+Visitas_eng) AS 'Visitas_totales' FROM bd_productos WHERE ID_cat = %s and ID_subcat = %s and ID_subcat2 = %s ORDER BY $colname6_Recordset1, IDpro DESC", GetSQLValueString($colname2_Recordset1, "int"), GetSQLValueString($colname3_Recordset1, "int"), GetSQLValueString($colname4_Recordset1, "int"));
}
if($colname_Recordset1=='-1' && $colname2_Recordset1!='-1' && $colname3_Recordset1!='-1' && $colname4_Recordset1!='-1' && $colname5_Recordset1!='-1'){
	$query_Recordset1 = sprintf("SELECT *,(Visitas+Visitas_esp+Visitas_eng) AS 'Visitas_totales' FROM bd_productos WHERE ID_cat = %s and ID_subcat = %s and ID_subcat2 = %s and ID_subcat3 = %s ORDER BY $colname6_Recordset1, IDpro DESC", GetSQLValueString($colname2_Recordset1, "int"), GetSQLValueString($colname3_Recordset1, "int"), GetSQLValueString($colname4_Recordset1, "int"), GetSQLValueString($colname5_Recordset1, "int"));
}
/*******/
$query_limit_Recordset1 = sprintf("%s LIMIT %d, %d", $query_Recordset1, $startRow_Recordset1, $maxRows_Recordset1);
$Recordset1 = mysql_query($query_limit_Recordset1, $bd_SELLOS) or die(mysql_error());
$row_Recordset1 = mysql_fetch_assoc($Recordset1);

/*******/

if (isset($_GET['totalRows_Recordset1'])) {
  $totalRows_Recordset1 = $_GET['totalRows_Recordset1'];
} else {
  $all_Recordset1 = mysql_query($query_Recordset1);
  $totalRows_Recordset1 = mysql_num_rows($all_Recordset1);
}
$totalPages_Recordset1 = ceil($totalRows_Recordset1/$maxRows_Recordset1)-1;

$queryString_Recordset1 = "";
if (!empty($_SERVER['QUERY_STRING'])) {
  $params = explode("&", $_SERVER['QUERY_STRING']);
  $newParams = array();
  foreach ($params as $param) {
    if (stristr($param, "pageNum_Recordset1") == false && 
        stristr($param, "totalRows_Recordset1") == false) {
      array_push($newParams, $param);
    }
  }
  if (count($newParams) != 0) {
    $queryString_Recordset1 = "&" . htmlentities(implode("&", $newParams));
  }
}
$queryString_Recordset1 = sprintf("&totalRows_Recordset1=%d%s", $totalRows_Recordset1, $queryString_Recordset1);

/****************************************************************** Filtro*/
$query_Recordset2 = "SELECT * FROM bd_productos_categorias ORDER BY POS_cat ASC";
$Recordset2 = mysql_query($query_Recordset2, $bd_SELLOS) or die(mysql_error());
$row_Recordset2 = mysql_fetch_assoc($Recordset2);
$totalRows_Recordset2 = mysql_num_rows($Recordset2);


/****************************************************************** Filtro 2*/
if($colname2_Recordset1!="-1"){
	$query_Recordset3 = sprintf("SELECT * FROM bd_productos_subcat WHERE ID_cat = %s ORDER BY POS_subcat ASC", GetSQLValueString($colname2_Recordset1, "int"));
	$Recordset3 = mysql_query($query_Recordset3, $bd_SELLOS) or die(mysql_error());
	$row_Recordset3 = mysql_fetch_assoc($Recordset3);
	$totalRows_Recordset3 = mysql_num_rows($Recordset3);
}

/****************************************************************** Filtro 3*/
if($colname3_Recordset1!="-1"){
	$query_Recordset4 = sprintf("SELECT * FROM bd_productos_subcat2 WHERE ID_subcat = %s ORDER BY POS_subcat2 ASC", GetSQLValueString($colname3_Recordset1, "int"));
	$Recordset4 = mysql_query($query_Recordset4, $bd_SELLOS) or die(mysql_error());
	$row_Recordset4 = mysql_fetch_assoc($Recordset4);
	$totalRows_Recordset4 = mysql_num_rows($Recordset4);
}
/****************************************************************** Filtro 4*/
if($colname4_Recordset1!="-1"){
	$query_Recordset5 = sprintf("SELECT * FROM bd_productos_subcat3 WHERE ID_subcat2 = %s ORDER BY POS_subcat3 ASC", GetSQLValueString($colname4_Recordset1, "int"));
	$Recordset5 = mysql_query($query_Recordset5, $bd_SELLOS) or die(mysql_error());
	$row_Recordset5 = mysql_fetch_assoc($Recordset5);
	$totalRows_Recordset5 = mysql_num_rows($Recordset5);
}


?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Sellos y Rótulos</title>
<link href="styles/style.css" rel="stylesheet" type="text/css" />
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"> </script> 
<link rel="stylesheet" type="text/css" href="fancybox/jquery.fancybox.css" media="screen" />
<script type="text/javascript" src="fancybox/jquery.fancybox.js"></script>

<script type="text/javascript"> 
<!--
 
$(document).ready(function(){
						   
						   
	<?php require_once('menu_jquery.php'); ?>
	<?php require_once('Scripts/actions.js'); ?>
	$('select[name="Filter"]').change(function(){
		$('#Filter2').val(-1);
		$('#Filter3').val(-1);
		$('#Filter4').val(-1);
		$('#form').submit();
		return false;
     })
	$('select[name="Filter2"]').change(function(){
		$('#Filter3').val(-1);
		$('#Filter4').val(-1);
		 $('#form').submit();
		 return false;
     })
	$('select[name="Filter3"]').change(function(){
		 $('#Filter4').val(-1);
		 $('#form').submit();
		 return false;
     })
	$('.ASC').bind("click", function(){
		 $valor_order=$(this).attr('title');
		 $('#Order').val($valor_order);
		 $('#form').submit();
		 return false;
     })
	
	$('.DESC').bind("click", function(){
		 $valor_order=$(this).attr('title');
		 $('#Order').val($valor_order);
		 $('#form').submit();
		 return false;
     })
	
	$('.DEL').bind("click", function(){
			$que_registro = $(this).attr('title');
			$valor_registro=$que_registro.substring(9,100);
			$valor_id=$(this).attr('id');
			$que_pos="POS_"+$valor_id;
			$valor_pos=$('#'+$que_pos).attr('class');
			if(window.confirm("¿Quieres eliminar '" + $valor_registro + "'?")){	
				location.href="product_delete.php?<?php echo $queri; ?>&IDpro=" + $valor_id + "&POS=" + $valor_pos;
				return false;
			}else{
				return false;	
			}
	})
	$(".fancy_open").fancybox({
		'width'				: 1170,
		'height'			: 900,
		'autoScale'			: false,
		'transitionIn'		: 'none',
		'transitionOut'		: 'none',
		'type'				: 'iframe'
	});
	
})


//-->	
</script> 

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
                    	<li><a href="#" title="Productos" class="activat">Productos</a></li>
                        <?php if($_SESSION['MM_UserGroup']==1){ ?><li><a href="product_sign.php" title="Alta producto">Alta producto</a></li><?php } ?>
                        <div class="clear"></div>
                    </ul>
                    <div class="row">
    				<form ACTION="<?php echo $page; ?>" method="get" id="form" name="form">
                                  
                                  <label>
                                    	<span class="tit"> Buscador</span>
                                      	<input name="Search" type="text" class="boxy" id="box1" maxlength="20" <?php if($colname_Recordset1!='-1'){ ?>value="<?php echo $colname_Recordset1; ?>"<?php } ?>/>
					  			  </label>
								
                                	<label class="none">
                                 		<input name="button" type="image" class="buttony" id="button" src="imagesWEB/search.png"/>
           			  				</label>
                                  
                                  <label class="margen">
                                    <span class="tit"> Categoría</span>
                                    <select name="Filter" id="Filter">
                                    	<option value="-1">(Selecciona)</option>
                                      <?php if($totalRows_Recordset2>0){ ?>
									  <?php
									do {  
									?>
                                      <option value="<?php echo $row_Recordset2['IDcat']?>" <?php if (!(strcmp($row_Recordset2['IDcat'], $colname2_Recordset1))) {echo "selected=\"selected\"";} ?>><?php echo $row_Recordset2['Categoria_esp']?></option>
                                      <?php } while ($row_Recordset2 = mysql_fetch_assoc($Recordset2)); ?>
                                    <?php } ?>
                       		  		</select>
       				  			</label>
                                
                                  <div class="margen"></div>
                                
                                  <label class="margen">
                                    <span class="tit"> Subcategoría</span>
                                    <select name="Filter2" id="Filter2">
                                    	<option value="-1">(Selecciona)</option>
                                      <?php if($colname2_Recordset1!="-1" && $totalRows_Recordset3>0){ ?>
									  <?php
									do {  
									?>
                                      <option value="<?php echo $row_Recordset3['IDsubcat']?>" <?php if (!(strcmp($row_Recordset3['IDsubcat'], $colname3_Recordset1))) {echo "selected=\"selected\"";} ?>><?php echo $row_Recordset3['Subcategoria_esp']?></option>
                                      <?php } while ($row_Recordset3 = mysql_fetch_assoc($Recordset3)); ?>
                                    <?php } ?>
                       		  		</select>
		  			  			</label>
                                
                                <label class="margen">
                                    <span class="tit"> Subcategoría 2</span>
                                    <select name="Filter3" id="Filter3">
                                    	<option value="-1">(Selecciona)</option>
                                      <?php if($colname3_Recordset1!="-1" && $totalRows_Recordset4>0){ ?>
									  <?php
									do {  
									?>
                                      <option value="<?php echo $row_Recordset4['IDsubcat2']?>" <?php if (!(strcmp($row_Recordset4['IDsubcat2'], $colname4_Recordset1))) {echo "selected=\"selected\"";} ?>><?php echo $row_Recordset4['Subcategoria2_esp']?></option>
                                      <?php } while ($row_Recordset4 = mysql_fetch_assoc($Recordset4)); ?>
                                    <?php } ?>
                       		  		</select>
		  			  			</label>
                                
                                
                      <label>
                                	<input name="Order" id="Order" type="hidden" value="POS_pro ASC" />
                                </label>


                    </form>
                    </div>
                    <div class="list">
                    <table width="100%" border="0" align="center" cellpadding="8" cellspacing="0">
                      <tr>
                        <th width="20%" align="left" scope="col"><span>Orden</span> <a href="#" title="POS_pro ASC" <?php if($colname6_Recordset1!='POS_pro ASC'){ ?>class="ASC"<?php }else{ ?>class="ASCactivat"<?php } ?>></a> <a href="#" title="POS_pro DESC" <?php if($colname6_Recordset1!='POS_pro DESC'){ ?>class="DESC"<?php }else{ ?>class="DESCactivat"<?php } ?>></a></th>
                        <th width="30%" align="left" scope="col"><span class="principal">Producto</span> <a href="#" title="Producto ASC" <?php if($colname6_Recordset1!='Producto ASC'){ ?>class="ASC"<?php }else{ ?>class="ASCactivat"<?php } ?>></a> <a href="#" title="Producto DESC" <?php if($colname6_Recordset1!='Producto DESC'){ ?>class="DESC"<?php }else{ ?>class="DESCactivat"<?php } ?>></a></th>
                        <th width="10%" align="center" scope="col"><span>Stock</span></th>
                        <th width="10%" align="center" scope="col"><span>Visitas</span></th>
                        <th width="10%" align="center" scope="col"><span>Coment.</span></th>
                        <th width="10%" align="center" scope="col"><span>Ventas</span></th>
                        <th width="20%" align="left" scope="col">&nbsp;</th>
                      </tr>
                      <tr>
                        <td class="none"></td>
                        <td height="3" class="none"></td>
                        <td align="center" class="none"></td>
                        <td height="3" align="center" class="none"></td>
                        <td class="none"></td>
                        <td height="3" class="none"></td>
                      </tr>
                      <?php if ($totalRows_Recordset1>0){ ?>
                      <?php do { ?>
						<?php
                        /****************************************************************** Stock*/
                        $colname_Recordset6 = "-1";
                        if (isset($row_Recordset1['IDpro']) && $row_Recordset1['IDpro']!='') {
                          $colname_Recordset6 = $row_Recordset1['IDpro'];
                        }
                        
                        $query_Recordset6 = sprintf("SELECT sum(Stock) as Resultado FROM bd_productos_variantes WHERE ID_pro = %s", GetSQLValueString($colname_Recordset6, "int"));
                        $Recordset6 = mysql_query($query_Recordset6, $bd_SELLOS) or die(mysql_error());
                        $row_Recordset6 = mysql_fetch_assoc($Recordset6);
                        $totalRows_Recordset6 = mysql_num_rows($Recordset6);
                        
                        ?>
						<?php
                        /****************************************************************** Imagen*/
                        $colname_Recordset7 = "-1";
                        if (isset($row_Recordset1['IDpro']) && $row_Recordset1['IDpro']!='') {
                          $colname_Recordset7 = $row_Recordset1['IDpro'];
                        }
                        
                        $query_Recordset7 = sprintf("SELECT Imagen, ID_pro FROM bd_productos_imagenes WHERE ID_pro = %s ORDER BY POS_ima, IDproima DESC LIMIT 1", GetSQLValueString($colname_Recordset7, "int"));
                        $Recordset7 = mysql_query($query_Recordset7, $bd_SELLOS) or die(mysql_error());
                        $row_Recordset7 = mysql_fetch_assoc($Recordset7);
                        $totalRows_Recordset7 = mysql_num_rows($Recordset7);
                        
                        ?>
                      <?php
						/****************************************************************** Ventas*/
						$colname_Recordset8 = "-1";
						if (isset($row_Recordset1['IDpro']) && $row_Recordset1['IDpro']!='') {
						  $colname_Recordset8 = $row_Recordset1['IDpro'];
						}
						$query_Recordset8 = sprintf("SELECT ID_pro, SUM(Cantidad) AS 'Total_v' FROM bd_pedidos_basket WHERE ID_pro=%s", GetSQLValueString($colname_Recordset8, "text"));
						$Recordset8 = mysql_query($query_Recordset8, $bd_SELLOS) or die(mysql_error());
						$row_Recordset8 = mysql_fetch_assoc($Recordset8);
						$totalRows_Recordset8 = mysql_num_rows($Recordset8);
					  ?>
                      <?php
						/****************************************************************** Ofertas*/
						/*********************************************** Fecha oferta*/
						$colname_fechaOFERTA = date("d/m/Y");
						ereg( "([0-9]{1,2})/([0-9]{1,2})/([0-9]{2,4})", $colname_fechaOFERTA, $fecha_colname_fechaOFERTA); 
						$lafechaOFERTA=$fecha_colname_fechaOFERTA[3]."-".$fecha_colname_fechaOFERTA[2]."-".$fecha_colname_fechaOFERTA[1]; 
						/********************************************************************************************/
						$colname_Recordset9 = "-1";
						if (isset($row_Recordset1['IDpro']) && $row_Recordset1['IDpro']!='') {
						  $colname_Recordset9 = $row_Recordset1['IDpro'];
						}
						$query_Recordset9 = sprintf("SELECT Compra, Paga FROM bd_productos_ofertas WHERE ID_pro=%s and Fecha_c <= %s and Fecha_f >= %s", GetSQLValueString($colname_Recordset9, "text"), GetSQLValueString($lafechaOFERTA, "date"), GetSQLValueString($lafechaOFERTA, "date"));
						$Recordset9 = mysql_query($query_Recordset9, $bd_SELLOS) or die(mysql_error());
						$row_Recordset9 = mysql_fetch_assoc($Recordset9);
						$totalRows_Recordset9 = mysql_num_rows($Recordset9);
					  ?>
                      <?php
						/****************************************************************** Comentarios*/
						$colname_Recordset10 = "-1";
						if (isset($row_Recordset1['IDpro']) && $row_Recordset1['IDpro']!='') {
						  $colname_Recordset10 = $row_Recordset1['IDpro'];
						}
						$query_Recordset10 = sprintf("SELECT ID_pro FROM bd_clientes_comentarios WHERE ID_pro=%s", GetSQLValueString($colname_Recordset10, "text"));
						$Recordset10 = mysql_query($query_Recordset10, $bd_SELLOS) or die(mysql_error());
						$row_Recordset10 = mysql_fetch_assoc($Recordset10);
						$totalRows_Recordset10 = mysql_num_rows($Recordset10);
					  ?>
                      <tr class="valores">
                        <td id="POS_<?php echo $row_Recordset1['IDpro']?>" class="<?php echo $row_Recordset1['POS_pro']?>"><?php echo $row_Recordset1['POS_pro']?></td>
                        <td><?php if ($totalRows_Recordset7>0){ ?><img src="../img/product/min-<?php echo $row_Recordset7['Imagen']?>" class="flotacio" alt="<?php echo $row_Recordset7['Imagen']?>"/><?php } ?><?php echo $row_Recordset1['Producto_esp']?><?php if($totalRows_Recordset9>0){ ?><br /><span class="obligatty">Oferta <?php echo $row_Recordset9['Compra'];?>x<?php echo $row_Recordset9['Paga'];?></span><?php } ?><?php if($row_Recordset1['Novedad']=='1' ){ ?><br /><span class="obligatty">Destacado</span><?php } ?> <?php if($row_Recordset1['ID_est']==2){ ?><br /><span class="obligatty">Inactivo</span><?php } ?></td>
                        <td align="center"><?php if($row_Recordset6['Resultado']!=-1){ ?><?php echo $row_Recordset6['Resultado'];?><?php } ?></td>
                        <td align="center"><?php echo $row_Recordset1['Visitas_totales'];?></td>
                        <td align="center"><a href="list_comment.php?Search=<?php echo $row_Recordset1['Producto_esp']?>" title="<?php echo $totalRows_Recordset10;?> comentarios"><?php echo $totalRows_Recordset10;?></a></td>
                        <td align="center">
						 <?php if($row_Recordset8['Total_v']!=''){ ?><a href="list_order_product.php?Search=<?php echo $row_Recordset1['Producto_esp']?>" title="<?php echo $row_Recordset8['Total_v']; ?> ventas"><?php echo $row_Recordset8['Total_v'];?></a><?php }else{ ?>0<?php } ?></td>
                        <td align="right" valign="middle">
                        	<a title="Acciones" class="operaciones" id="ope_<?php echo $row_Recordset1['IDpro']?>">Acciones</a>
                            <ul class="sub" id="sub_<?php echo $row_Recordset1['IDpro']?>">
                            	<li><a href="product_SEO.php?<?php echo $queri; ?>&IDpro=<?php echo $row_Recordset1['IDpro']?>" title="SEO">SEO</a></li>
                                <li><a href="product_images.php?<?php echo $queri; ?>&IDpro=<?php echo $row_Recordset1['IDpro']?>" title="Imágenes">Imágenes</a></li>
                                <li><a href="product_documents.php?<?php echo $queri; ?>&IDpro=<?php echo $row_Recordset1['IDpro']?>" title="Documentos">Documentos</a></li>
                                <?php if (isset($row_Recordset1['Personalizar']) && $row_Recordset1['Personalizar']==1){ ?>
                                <li><a href="product_custom.php?env=webmaster&IDpro=<?php echo $row_Recordset1['IDpro']?>" class="fancy_open">Personalizar</a></li>
                                <?php } ?>
                                <li><a href="product_duplicate.php?<?php echo $queri; ?>&IDpro=<?php echo $row_Recordset1['IDpro']?>" title="Duplicar">Duplicar</a></li>
                                <li><a href="product_change.php?<?php echo $queri; ?>&IDpro=<?php echo $row_Recordset1['IDpro']?>" title="Modificar" class="MOD">Modificar</a></li>
                                <li><a href="#" title="Eliminar <?php echo $row_Recordset1['Producto_esp']?>" class="DEL" id="<?php echo $row_Recordset1['IDpro']?>">Eliminar</a></li>
                        	</ul>
                        </td>
                      </tr>
                       <?php } while ($row_Recordset1 = mysql_fetch_assoc($Recordset1)); ?>
                       <?php mysql_free_result($Recordset6); ?>
                      <?php mysql_free_result($Recordset7); ?>
                      <?php mysql_free_result($Recordset8); ?>
                      <?php } ?>
                    </table>

                  </div>
                  <div class="nav">
                  		<?php if ($pageNum_Recordset1 > 0) { ?>
                            <a href="<?php printf("%s?pageNum_Recordset1=%d%s", $currentPage, 0, $queryString_Recordset1); ?>" title="Primero" class="FIRST"></a>
                        <?php } ?>
                        <?php if ($pageNum_Recordset1 > 0) { ?>
                        	<a href="<?php printf("%s?pageNum_Recordset1=%d%s", $currentPage, max(0, $pageNum_Recordset1 - 1), $queryString_Recordset1); ?>" title="Anterior" class="PREVIOUS"></a> 
                        <?php } ?>
                        <?php if ($pageNum_Recordset1 < $totalPages_Recordset1) { ?>
                        	<a href="<?php printf("%s?pageNum_Recordset1=%d%s", $currentPage, min($totalPages_Recordset1, $pageNum_Recordset1 + 1), $queryString_Recordset1); ?>" title="Siguiente" class="NEXT"></a>
                        <?php } ?>
                        <?php if ($pageNum_Recordset1 < $totalPages_Recordset1) { ?>
                        	<a href="<?php printf("%s?pageNum_Recordset1=%d%s", $currentPage, $totalPages_Recordset1, $queryString_Recordset1); ?>" title="Último" class="LAST"></a>
                        <?php } ?>
                        <?php if ($pageNum_Recordset1 > 0 || $pageNum_Recordset1 > 0 || $pageNum_Recordset1 < $totalPages_Recordset1 || $pageNum_Recordset1 < $totalPages_Recordset1) { ?>
                        	<br/>
                        <?php } ?>
                        <?php if ($totalRows_Recordset1>0){ ?>
                        	<span><?php echo ($startRow_Recordset1 + 1) ?> al <?php echo min($startRow_Recordset1 + $maxRows_Recordset1, $totalRows_Recordset1) ?> de un total de <?php echo $totalRows_Recordset1 ?></span> 
                        <?php } ?>
                  </div>
                </div>
                <div class="clear"></div>
        </div>


</div>


<div id="div_footer">
© Sellos y Rótulos</div>


</body>
</html>
<?php
mysql_free_result($Recordset1);
mysql_free_result($Recordset2);
if($colname2_Recordset1!="-1"){
	mysql_free_result($Recordset3);
}
if($colname3_Recordset1!="-1"){
	mysql_free_result($Recordset4);
}
if($colname4_Recordset1!="-1"){
	mysql_free_result($Recordset5);
}

?>
