<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once('api-requests.php');

class Api {

    private $request;
    private $idProd;
    private $response;
    private $apiRequests;

    public function __construct() {

        $this->apiRequests = new ApiRequests();
        $this->request = $_GET['request'];
        $this->idProd = $_GET['IDpro'];
    }

    public function handleRequest(){

        switch ($this->request) {
            case "get-custom":
                // $this->response = $this->getCustomization($this->idProd);
                $this->response = $this->apiRequests->getTemplateCustomization($this->idProd);
                $this->returnJSONResponse();
                break;
            default:
                echo "Your favorite color is neither red, blue, nor green!";
        }
    }

    public function returnJSONResponse(){

        echo json_encode($this->response);
    }

}

$api = new Api();
$api->handleRequest();
?>