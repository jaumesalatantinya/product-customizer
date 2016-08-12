<?php

    /*
     * TODO :   Refactor
                main () {
                    if (areAllEnviromentVaraiblesOKToGeneratePdf) {
                        getVaraiblesNeededToCreatePDF();
                        setupPdfConverter();
                        setupRealsizeVaribales();
                        Generate PDF
                    }
                }
    */
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
            $productWidth = $apiRequests->getProduct($productId)[0][W_anchura];
            $productHeight = $apiRequests->getProduct($productId)[0][H_altura];
            $numPages = count($apiRequests->getViews($_GET['IDcus']));
            $pageWidth = 450; // 600 * 72 / 96
            $pageHeight = (int)$apiRequests->getCustomization($_GET['IDcus'])[0]['Height'] * 72 / 96; //pixels to points conversion
            if ($realSize == true) {
                $scaleFactor = floatval($productWidth/158.75);  // 600 pixles * 72 / 96 => becomes points then 1 pint is 0.35 mm => therefor 600px are 158.75 mm in 72 pixels per inch
                $pageWidth = str_replace('.00', 'mm', $productWidth);
                $pageHeight = -1;
                $pdf = $client->setPdfScalingFactor($scaleFactor);
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
