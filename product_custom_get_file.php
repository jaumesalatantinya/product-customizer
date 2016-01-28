<?php
    require '../pdf/pdfcrowd.php';
    require_once('product-customizer/api/api-requests.php');
    try {  
        // create an API client instance
        $client = new Pdfcrowd('dani3rs', '6cb8fce0fa072b77c4655a4da2631cb2');
        // Opcional
        $apiRequests = new ApiRequests();
        $pageHeight = $apiRequests->getCustomization($_GET['IDcus'])[0]['Height'] * 72 / 96; //pixels to points conversion
        $pdf = $client->setPageWidth(450);
        $pdf = $client->setPageHeight($pageHeight);
        $pdf = $client->setPageMargins(0, 0, 0, 0);

        // convert a web page and store the generated PDF into a $pdf variable
        $pdf = $client->convertURI('http://www.sellosyrotulos.com/webmaster/product_custom_render_custom.php?IDcus='.$_GET['IDcus'].'&type='.$_GET['type']);
        // set HTTP response headers
        header('Content-Type: application/pdf');
        header('Cache-Control: no-cache');
        header('Accept-Ranges: none');
        header('Content-Disposition: attachment; filename=\'custom-'.$_GET['IDcus'].'.pdf\'');

        // send the generated PDF 
        echo $pdf;
    }
    catch(PdfcrowdException $e)
    {
    echo 'Pdfcrowd Error: ' . $e->getMessage();
    }
?>
