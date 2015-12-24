<?php
require_once('database.php');

class ApiRequests {


	private $db;


	public function __construct() {

        $this->db = new Database();
        $this->db->connect();
    }

    public function getTemplateId($idProd) {

        $q = 'SELECT IDcus FROM bd_custom WHERE ID_pro =' . $idProd . ' AND Is_Template = 1';
        return $this->db->select($q);
    }


    public function getCustomization($idCus) {

        $q = 'SELECT * FROM bd_custom WHERE IDcus =' . $idCus;
        return $this->db->select($q);
    }


    public function getViews($idCus) {

        $q = 'SELECT * FROM bd_custom_views WHERE ID_cus =' . $idCus . ' ORDER BY IDcusvie';
        return $this->db->select($q);
    }


    public function getView($idVie) {

        $q = 'SELECT * FROM bd_custom_views WHERE IDcusvie =' . $idVie;
        return $this->db->select($q);
    }


    public function getCustomElements($idVie) {

        $q = 'SELECT * FROM bd_custom_elements WHERE ID_cusvie =' . $idVie;
        return $this->db->select($q);
    }

    public function getCustomElement($idCusele) {

        $q = 'SELECT * FROM bd_custom_elements WHERE IDcusele =' . $idCusele;
        return $this->db->select($q);
    }




    public function putView($idCus) {

        $q = 'INSERT INTO bd_custom_views (ID_cus) VALUES (' . $idCus . ')';
        return $this->db->insert($q);
    }

    public function putArea($idVie) {

        $attr = json_encode('{"shape": "rectangle", "printable": "true"}');
        $q = 'INSERT INTO bd_custom_elements (ID_cusvie, type, x, y, width, height, area_attr) VALUES (' . $idVie . ' , "area", 200, 200, 200, 200, ' . $attr . ')';
        return $this->db->insert($q);
    }

    public function putText($idVie) {

        $attr = json_encode('{"family": "arial", "weight": "normal", "style": "normal", "size": 20, "align": "center"}');
        $q = 'INSERT INTO bd_custom_elements (ID_cusvie, type, x, y, width, height, text, text_attr) VALUES (' . $idVie . ', "text", 200, 200, 200, 200, "TEXTO", '. $attr .' )';
        return $this->db->insert($q);
    }

    public function putImg($idVie) {

        $q = 'INSERT INTO bd_custom_elements (ID_cusvie, type, x, y, width, height, img) VALUES (' . $idVie . ', "img", 200, 200, 200, 200, "tmp-img.jpg")';
        return $this->db->insert($q);
    }




    public function putImgToView($idVie, $file) {

        $q = 'UPDATE bd_custom_views SET Image="' . $file . '" WHERE IDcusvie=' . $idVie;
        return $this->db->update($q);
    }

    public function updateCustomElementPosSize($idCusele, $data) {

        $q = 'UPDATE bd_custom_elements SET x="' . $data['x'] . '", y="' . $data['y'] . '", width="' . $data['width'] . '", height="' . $data['height'] .'" WHERE IDcusele=' . $idCusele;
        return $this->db->update($q);
    }

    public function updateArea($idCusele, $data) {

        $q = 'UPDATE bd_custom_elements SET area_attr=\'' . json_encode($data) . '\' WHERE IDcusele=' . $idCusele;
        return $this->db->update($q);
    }

    public function updateText($idCusele, $data) {

        $q = 'UPDATE bd_custom_elements SET text=\'' . $data['text'] . '\' WHERE IDcusele=' . $idCusele;
        return $this->db->update($q);
    }

    public function updateTextAttr($idCusele, $data) {

        $q = 'UPDATE bd_custom_elements SET text_attr=\'' . json_encode($data) . '\' WHERE IDcusele=' . $idCusele;
        return $this->db->update($q);
    }





    public function delView($idVie) {

        $q = 'DELETE FROM bd_custom_views WHERE IDcusvie =' . $idVie;
        return $this->db->delete($q);
    }

    public function delCustomElement($idCusele) {

        $q = 'DELETE FROM bd_custom_elements WHERE IDcusele=' . $idCusele;
        return $this->db->delete($q);
    }
}
?>