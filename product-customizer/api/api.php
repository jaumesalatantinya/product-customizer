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
    }


    public function handleRequest(){

        switch ($this->request) {
            case "get-custom":
                $this->response = $this->apiRequests->getTemplateCustomization($this->idProd);
                $this->returnJSONResponse();
                break;
            case "get-views-ids":
                $this->response = $this->apiRequests->getViewsIds($this->idCus);
                $this->returnJSONResponse();
                break;
            case "get-view":
                $this->response = $this->apiRequests->getView($this->idVie);
                $this->returnJSONResponse();
                break;
            case "get-custom-elements":
                $this->response = $this->apiRequests->getCustomElements($this->idVie);
                $this->returnJSONResponse();
                break;
            default:
                echo "API PRODUCT CUSTOMIZER";
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
