<?php
require_once('database.php'); 

class Api {

    public $db;
    public $request;

    public function __construct() {
        $this->db = new Database();
        $this->db->connect();
        $this->request = $_GET['request'];
    }
    
    // public function getCustomization($prodId) {
    //     // json_encode($out);
    //     // return JSON
    // }
    // public function setCustomization(){

    // }

    public fucntion handleRequest(){
        switch ($favcolor) {
            case "red":
                echo "Your favorite color is red!";
                break;
            case "blue":
                echo "Your favorite color is blue!";
                break;
            case "green":
                echo "Your favorite color is green!";
                break;
            default:
                echo "Your favorite color is neither red, blue, nor green!";
        }
    }
}

$api = new Api();
$api->handleRequest();
?>