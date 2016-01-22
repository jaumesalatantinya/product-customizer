<?php
    require_once('api/api.php');

    if (isset($_GET['IDpro'])){
        $api = new Api();
        $idProd = $_GET['IDpro'];
        
        $idCustomTemplate = $api->apiRequests->getTemplateId($idProd)[0]['IDcus'];
        $qC = 'INSERT INTO bd_custom (ID_pro, Is_Template) VALUES (' . $idProd . ', "false")';
        $idCustomNew = $api->apiRequests->db->insert($qC);

        $views = $api->apiRequests->getViews($idCustomTemplate);
        foreach ($views as &$view) {
            $qV = 'INSERT INTO bd_custom_views (ID_cus, Image) VALUES (' . $idCustomNew . ', "'. $view['Image'] .'")';
            $idViewNew = $api->apiRequests->db->insert($qV);
            
            $customElements = $api->apiRequests->getCustomElements($view['IDcusvie']);
            foreach ($customElements as &$customElement) {
                $qE = 'INSERT INTO bd_custom_elements (ID_cusvie, type, x, y, width, height, Zindex, area_attr, text, text_attr, ID_cussvg, Img_file) ';
                $qE .='VALUES ('.$idViewNew.', "'.$customElement['type'].'", '.$customElement['x'].', '.$customElement['y'].', '.$customElement['width'].', '.$customElement['height'].', '.$customElement['Zindex'].' , '.json_encode($customElement['area_attr']).', "'.$customElement['text'].'", '.json_encode($customElement['text_attr']).', '.json_encode($customElement['ID_cussvg']).', "'.$customElement['Img_file'].'" )';
                $api->apiRequests->db->insert($qE);
                //TODO if is an image clone image and update recordset
            }
        }
        header( 'Location: ../product_custom.php?IDcus='.$idCustomNew.'&IDpro='.$idProd);
    }
    else {
        echo 'No IDpro passed as param to crate a new customization from template custom';
    }
?>
