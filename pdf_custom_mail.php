<?php
    require ('pdf/pdfcrowd.php');
    require_once('product-customizer/api/api-requests.php');
    $apiRequests = new ApiRequests();
    $idCus = $_GET['IDcus'];
    $type = $_GET['type']; //[pdf|pdfwb]
    $realSize = ( isset($_GET['realSize']) ? $_GET['realSize'] : false);
    if ( $_GET['IDcli'] === $apiRequests->getIdCliFromBDPedidosCustom($idCus)[0]['ID_cli']) {
        try {
            $client = new Pdfcrowd('dani3rs', '6cb8fce0fa072b77c4655a4da2631cb2');
            $productId = $apiRequests->getCustomization($_GET['IDcus'])[0]['ID_pro'];
            $productWidth = round(floatVal($apiRequests->getProduct($productId)[0][W_anchura])*5, 1);
            $productHeight = round(floatVal($apiRequests->getProduct($productId)[0][H_altura])*5, 1);
            $numPages = count($apiRequests->getViews($_GET['IDcus']));
            $pageWidth = 450; // 600 * 72 / 96
            $pageHeight = (int)$apiRequests->getCustomization($_GET['IDcus'])[0]['Height'] * 72 / 96; //pixels to points conversion
            $scaleFactorWidth = round(floatval($productWidth/600),1);
            $scaleFactorHeight = round(floatval($productHeight/$apiRequests->getCustomization($_GET['IDcus'])[0]['Height']),1);
            if ($realSize == true) {
                $pageWidth = (int)round($pageWidth * $scaleFactorWidth);
                $pageHeight = (int)round($pageHeight * $scaleFactorHeight);
                $pdf = $client->setPdfScalingFactor($scaleFactorWidth);
            }
            $pdf = $client->setPageWidth($pageWidth);
            $pdf = $client->setPageHeight($pageHeight);
            $pdf = $client->setPageMargins(0, 0, 0, 0);
            $pdf = $client->setMaxPages($numPages);
            $pdf = $client->convertURI('http://www.sellosyrotulos.com/pdf_custom.php?IDcus='.$idCus.'&type='.$type);

            header('Content-Type: application/pdf');
            header('Cache-Control: no-cache');
            header('Accept-Ranges: none');
            header('Content-Disposition: attachment; filename=\'custom-'.$idCus.'.pdf\'');
            echo $pdf;
        }
        catch(PdfcrowdException $e) {
            echo 'Pdfcrowd Error: ' . $e->getMessage();
        }
    }
?>
