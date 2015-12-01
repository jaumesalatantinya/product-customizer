<?php
require_once('database.php');

class ApiRequests {


	private $db;


	public function __construct() {

        $this->db = new Database();
        $this->db->connect();
    }


	public function getTemplateCustomization ($idProd){
        
        $q = 'SELECT * FROM bd_custom WHERE ID_pro =' . $idProd . ' AND Is_Template = 1';
        return $this->db->select($q);
    }


    public function getCustomization ($idProd) {

        return $this->getTemplateCustomization($idProd);
    }
}
?>