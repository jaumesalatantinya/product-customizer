<?php
    require '../pdf/pdfcrowd.php';
    require_once('product-customizer/api/api-requests.php');
    try {  
        $client = new Pdfcrowd('dani3rs', '6cb8fce0fa072b77c4655a4da2631cb2');
        $apiRequests = new ApiRequests();
        $numPages = count($apiRequests->getViews($_GET['IDcus']));
        $pageHeight = $apiRequests->getCustomization($_GET['IDcus'])[0]['Height'] * 72 / 96; //pixels to points conversion
        $pdf = $client->setPageWidth(450);
        $pdf = $client->setPageHeight($pageHeight);
        $pdf = $client->setPageMargins(0, 0, 0, 0);
        $pdf = $client->setMaxPages($numPages);
        $pdf = $client->convertURI('http://www.sellosyrotulos.com/beta/product_custom_render_custom.php?IDcus='.$_GET['IDcus'].'&type='.$_GET['type']);

        header('Content-Type: application/pdf');
        header('Cache-Control: no-cache');
        header('Accept-Ranges: none');
        header('Content-Disposition: attachment; filename=\'custom-'.$_GET['IDcus'].'.pdf\'');
        echo $pdf;
    }
    catch(PdfcrowdException $e) {
        echo 'Pdfcrowd Error: ' . $e->getMessage();
    }
?>
