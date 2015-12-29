<?php


require_once('api-requests.php');

class Api {


    private $request;
    private $idProd;
    private $idCus;
    private $response;
    private $apiRequests;


    public function __construct() {

        $this->apiRequests = new ApiRequests();
        $this->request = $_GET['request'];
        $this->idProd = $_GET['IDpro'];
        $this->idCus = $_GET['IDcus'];
        $this->idVie = $_GET['IDvie'];
        $this->file = $_GET['file'];
        $this->idCusele = $_GET['IDcusele'];
        $this->data = $_POST;
    }


    public function handleRequest(){

        switch ($this->request) {
            case 'get-custom-template-id':
                $this->response = $this->apiRequests->getTemplateId($this->idProd);
                $this->returnJSONResponse();
                break;
            case 'get-custom':
                $this->response = $this->apiRequests->getCustomization($this->idCus, $this->isAdmin);
                $this->returnJSONResponse();
                break;
            case 'get-views':
                $this->response = $this->apiRequests->getViews($this->idCus);
                $this->returnJSONResponse();
                break;
            case 'get-view':
                $this->response = $this->apiRequests->getView($this->idVie);
                $this->returnJSONResponse();
                break;
            case 'get-custom-elements':
                $this->response = $this->apiRequests->getCustomElements($this->idVie);
                $this->returnJSONResponse();
                break;
            case 'get-custom-element':
                $this->response = $this->apiRequests->getCustomElement($this->idCusele);
                $this->returnJSONResponse();
                break;
            case 'get-fonts':
                $this->response = $this->apiRequests->getFonts();
                $this->returnJSONResponse();
                break;



            case 'put-view':
                $this->response = $this->apiRequests->putView($this->idCus);
                $this->returnJSONResponse();
                break;
            case 'put-img-to-view':
                $this->response = $this->apiRequests->putImgToView($this->idVie, $this->file);
                $this->returnJSONResponse();
                break;
            case 'put-area':
                $this->response = $this->apiRequests->putArea($this->idVie);
                $this->returnJSONResponse();
                break;
            case 'put-text':
                $this->response = $this->apiRequests->putText($this->idVie);
                $this->returnJSONResponse();
                break;
            case 'put-img':
                $this->response = $this->apiRequests->putImg($this->idVie, $this->file);
                $this->returnJSONResponse();
                break;



            case 'update-custom-element-pos-size':
                $this->response = $this->apiRequests->updateCustomElementPosSize($this->idCusele, $this->data);
                $this->returnJSONResponse();
                break;
            case 'update-area':
                $this->response = $this->apiRequests->updateArea($this->idCusele, $this->data);
                $this->returnJSONResponse();
                break;
            case 'update-text':
                $this->response = $this->apiRequests->updateText($this->idCusele, $this->data);
                $this->returnJSONResponse();
                break; 
            case 'update-text-attr':
                $this->response = $this->apiRequests->updateTextAttr($this->idCusele, $this->data);
                $this->returnJSONResponse();
                break;
                          



            case 'del-view':
                $this->response = $this->apiRequests->delView($this->idVie);
                $this->returnJSONResponse();
                break;
            case 'del-custom-element':
                $this->response = $this->apiRequests->delCustomElement($this->idCusele);
                $this->returnJSONResponse();
                break;

            default:
                echo 'API PRODUCT CUSTOMIZER';
        }
    }


    public function returnJSONResponse(){

        header('Content-Type: application/json');
        echo json_encode($this->response);
    }
}

$api = new Api();
$api->handleRequest();
?>
