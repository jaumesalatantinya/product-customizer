<?php
    require '../pdf/pdfcrowd.php'; 
    try {  
        // create an API client instance
        $client = new Pdfcrowd('dani3rs', '6cb8fce0fa072b77c4655a4da2631cb2');
        // Opcional  
        $pdf = $client->setPageWidth('158.75mm');
        $pdf = $client->setPageHeight('158.75mm');

        // convert a web page and store the generated PDF into a $pdf variable
        $pdf = $client->convertURI('http://www.sellosyrotulos.com/webmaster/product_custom_render_custom.php?IDcus='.$_GET['IDcus'].'&type='.$_GET['type']);
        // set HTTP response headers
        header('Content-Type: application/pdf');
        header('Cache-Control: no-cache');
        header('Accept-Ranges: none');
        header('Content-Disposition: attachment; filename=\'nomquelivolsdonaralPDF.pdf\'');

        // send the generated PDF 
        echo $pdf;
    }
    catch(PdfcrowdException $e)
    {
    echo 'Pdfcrowd Error: ' . $e->getMessage();
    }
?>
