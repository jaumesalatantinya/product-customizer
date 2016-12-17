<?php


require_once('api-requests.php');

class Api {


    private $request;
    private $response;
    private $apiRequests;


    public function __construct() {

        $this->apiRequests = new ApiRequests();
        $this->request = $_GET['request'];
        $this->idPro = $_GET['IDpro'];
        $this->idCus = $_GET['IDcus'];
        $this->idVie = $_GET['IDvie'];
        $this->idCusele = $_GET['IDcusele'];
        $this->idSvg = $_GET['IDcussvg'];
        $this->idProtyp = $_GET['IDprotip'];
        $this->idProcol = $_GET['IDprocol'];
        $this->idCart = $_GET['IDcart'];
        $this->idProvar = $_GET['IDprovar'];
        $this->idClient = $_GET['IDCli'];
        $this->data = $_POST;
        $this->file = $_GET['file'];
        $this->zindex = $_GET['Zindex'];
    }


    public function handleRequest(){

        switch ($this->request) {
            case 'get-custom-template-id':
                $this->response = $this->apiRequests->getTemplateId($this->idPro);
                break;
            case 'get-custom-user-id':
                $this->response = $this->apiRequests->getCustomUserId($this->idPro, $this->idProvar, $this->$idCart, $this->$idClient);
                break;
            case 'get-custom':
                $this->response = $this->apiRequests->getCustomization($this->idCus, $this->isAdmin);
                break;
            case 'get-views':
                $this->response = $this->apiRequests->getViews($this->idCus);
                break;
            case 'get-view':
                $this->response = $this->apiRequests->getView($this->idVie);
                break;
            case 'get-custom-elements':
                $this->response = $this->apiRequests->getCustomElements($this->idVie);
                break;
            case 'get-custom-element':
                $this->response = $this->apiRequests->getCustomElement($this->idCusele);
                break;
            case 'get-fonts':
                $this->response = $this->apiRequests->getFonts();
                break;
            case 'get-svgs':
                $this->response = $this->apiRequests->getSvgs();
                break;
            case 'get-product':
                $this->response = $this->apiRequests->getProduct($this->idPro);
                break;
            case 'get-product-id':
                $this->response = $this->apiRequests->getProductId($this->idCus);
                break;
            case 'get-colors':
                $this->response = $this->apiRequests->getColors($this->idProtyp);
                break;
            case 'get-color':
                $this->response = $this->apiRequests->getColor($this->idProcol);
                break;


            case 'put-custom':
                $this->response = $this->apiRequests->putCustom($this->idPro, $this->idProvar, $this->idCart, $this->idClient);
                break;
            case 'put-view':
                $this->response = $this->apiRequests->putView($this->idCus);
                break;
            case 'put-img-to-view':
                $this->response = $this->apiRequests->putImgToView($this->idVie, $this->file);
                break;
            case 'put-area':
                $this->response = $this->apiRequests->putArea($this->idVie);
                break;
            case 'put-text':
                $this->response = $this->apiRequests->putText($this->idVie, $this->zindex);
                break;
            case 'put-img':
                $this->response = $this->apiRequests->putImg($this->idVie, $this->file, $this->zindex);
                break;
            case 'put-svg':
                $this->response = $this->apiRequests->putSvg($this->idVie, $this->idSvg, $this->zindex);
                break;



            case 'update-custom-element-pos-size':
                $this->response = $this->apiRequests->updateCustomElementPosSize($this->idCusele, $this->data);
                break;
            case 'update-custom-element-zindex':
                $this->response = $this->apiRequests->updateCustomElementZindex($this->idCusele, $this->zindex);
                break;
            case 'update-area':
                $this->response = $this->apiRequests->updateArea($this->idCusele, $this->data);
                break;
            case 'update-text':
                $this->response = $this->apiRequests->updateText($this->idCusele, $this->data);
                break;
            case 'update-text-attr':
                $this->response = $this->apiRequests->updateTextAttr($this->idCusele, $this->data);
                break;
            case 'update-color':
                $this->response = $this->apiRequests->updateColor($this->idCus, $this->idProcol);
                break;
            case 'update-height':
                $this->response = $this->apiRequests->updateHeight($this->idCus, $this->data);
                break;
            case 'update-is-modified-from-template':
                $this->response = $this->apiRequests->updateIsModifiedFromTemplate($this->idCus);
                break;



            case 'del-custom':
                $this->response = $this->apiRequests->delCustom($this->idCus);
                break;
            case 'del-view':
                $this->response = $this->apiRequests->delView($this->idVie, true);
                break;
            case 'del-custom-element':
                $this->response = $this->apiRequests->delCustomElement($this->idCusele);
                break;



            default:
                echo 'API PRODUCT CUSTOMIZER';
        }
        $this->returnJSONResponse();
    }


    public function returnJSONResponse(){

        header('Content-Type: application/json');
        echo json_encode($this->response);
    }


}

$api = new Api();
$api->handleRequest();
?>
