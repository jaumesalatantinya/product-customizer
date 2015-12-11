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

            case 'put-view':
                $this->response = $this->apiRequests->putView($this->idCus);
                $this->returnJSONResponse();
                break;
            case 'put-img-to-view':
                $this->response = $this->apiRequests->putImgToView($this->idVie, $this->file);
                $this->returnJSONResponse();
                break;

            case 'del-view':
                $this->response = $this->apiRequests->delView($this->idVie);
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
