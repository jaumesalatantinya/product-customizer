<?php
require_once('database.php');

class ApiRequests {


	private $db;




	public function __construct() {

        $this->db = new Database();
        $this->db->connect();
        $this->imgPath = '../../../img/custom/'; 
    }

    public function getTemplateId($idPro) {

        $q = 'SELECT IDcus FROM bd_custom WHERE ID_pro =' . $idPro . ' AND Is_Template = "true"';
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

        $q = 'SELECT * FROM bd_custom_elements LEFT JOIN bd_custom_svg ON bd_custom_elements.ID_cussvg = bd_custom_svg.IDcussvg WHERE ID_cusvie =' . $idVie;
        return $this->db->select($q);
    }

    public function getCustomElement($idCusele) {

        $q = 'SELECT * FROM bd_custom_elements LEFT JOIN bd_custom_svg ON bd_custom_elements.ID_cussvg = bd_custom_svg.IDcussvg WHERE IDcusele =' . $idCusele;
        return $this->db->select($q);
    }

    public function getFonts() {

        $q = 'SELECT * FROM bd_custom_fonts ORDER BY Font ASC';
        return $this->db->select($q);
    }

    public function getSvgs() {

        $q = 'SELECT * FROM bd_custom_svg';
        return $this->db->select($q);
    }

    public function getProduct($idPro) {

        $q = 'SELECT * FROM bd_productos WHERE IDpro =' . $idPro;
        return $this->db->select($q);
    }

    public function getProductId($idCus) {

        $q = 'SELECT ID_pro FROM bd_custom WHERE IDcus =' . $idCus;
        return $this->db->select($q);
    }

    public function getColors($idProtyp) {

        $q = 'SELECT * FROM bd_productos_colores WHERE ID_protip =' . $idProtyp;
        return $this->db->select($q);
    }

    public function getColor($idProcol) {

        $q = 'SELECT Color FROM bd_productos_colores WHERE IDprocol =' . $idProcol;
        return $this->db->select($q);
    }

    public function getCustomUserId($idPro, $idCart, $idClient) {

        $q = 'SELECT ID_cus FROM bd_ecommerce_custom WHERE (ID_pro=' . $idPro . ' AND Num_bask="' . $idCart . '") OR (ID_pro=' . $idPro . ' AND ID_cli= '.$idClient.')';
        $idCus = $this->db->select($q)[0]['ID_cus'];
        if (!is_null($idCus)) {
            $q = 'UPDATE bd_ecommerce_custom SET Num_bask="' . $idCart . '" WHERE ID_cus =' . $idCus;
            $this->db->update($q);
        }
        return $idCus;
    }

    public function getImgVar($idPro, $idProvar){

        $q = 'SELECT Imagen_var FROM bd_productos_variantes WHERE ID_pro = '.$idPro.' and IDprovar = '.$idProvar.' LIMIT 1';
        return $this->db->select($q);
    }





    public function putCustom($idPro, $idCart, $idProvar, $idClient) {

        $idCustomTemplate = $this->getTemplateId($idPro)[0]['IDcus'];
        $customTemplate = $this->getCustomization($idCustomTemplate)[0];
        $qC = 'INSERT INTO bd_custom (ID_pro, Is_Template, ID_procol, Height) VALUES (' . $idPro . ', "false", ' . json_encode($customTemplate['ID_procol']) .', '.$customTemplate['Height'].')';
        $idCustomNew = $this->db->insert($qC);
        $views = $this->getViews($idCustomTemplate);
        foreach ($views as &$view) {
            $qV = 'INSERT INTO bd_custom_views (ID_cus, Image) VALUES (' . $idCustomNew . ', "'. $view['Image'] .'")';
            $idViewNew = $this->db->insert($qV);
            $customElements = $this->getCustomElements($view['IDcusvie']);
            foreach ($customElements as &$customElement) {
                $qE = 'INSERT INTO bd_custom_elements (ID_cusvie, type, x, y, width, height, Zindex, area_attr, text, text_attr, ID_cussvg, Img_file) ';
                $qE .='VALUES ('.$idViewNew.', "'.$customElement['type'].'", '.$customElement['x'].', '.$customElement['y'].', '.$customElement['width'].', '.$customElement['height'].', '.$customElement['Zindex'].' , '.json_encode($customElement['area_attr']).', "'.$customElement['text'].'", '.json_encode($customElement['text_attr']).', '.json_encode($customElement['ID_cussvg']).', "'.$customElement['Img_file'].'" )';
                $idCustomElementNew = $this->db->insert($qE);
                if ($customElement['type'] == 'img'){
                    $newFile = time().'.'.explode('.',$customElement['Img_file'])[1];
                    if (copy($this->imgPath.$customElement['Img_file'], $this->imgPath.$newFile)) {
                        $qI = 'UPDATE bd_custom_elements SET Img_file="' . $newFile .'" WHERE IDcusele=' . $idCustomElementNew;
                        $this->db->update($qI);
                    }
                }
            }
        }
        $qE = 'DELETE FROM bd_ecommerce_custom WHERE Num_bask = "' . $idCart . '" AND ID_pro=' . $idPro;
        $this->db->delete($qE);
        $qE = 'INSERT INTO bd_ecommerce_custom (ID_cus, ID_pro, ID_cli, ID_provar, Num_bask) VALUES (' . $idCustomNew . ', '. $idPro .', '.$idClient.', ' .$idProvar. ', "' . $idCart .'")';
        $this->db->insert($qE);
        return $idCustomNew;
    }

    public function duplicateTemplateCustom ($idPro, $idProNew) {

        $idCustomTemplate = $this->getTemplateId($idPro)[0]['IDcus'];
        $customTemplate = $this->getCustomization($idCustomTemplate)[0];
        $qC = 'INSERT INTO bd_custom (ID_pro, Is_Template, ID_procol, Height) VALUES (' . $idProNew . ', "true", ' . json_encode($customTemplate['ID_procol']) .', '.$customTemplate['Height'].')';
        $idCustomNew = $this->db->insert($qC);
        $views = $this->getViews($idCustomTemplate);
        foreach ($views as &$view) {
            //$newFile = time().'.'.explode('.',$view['Image'])[1];
            //copy($this->imgPath.$view['Image'], $this->imgPath.$newFile);
            $qV = 'INSERT INTO bd_custom_views (ID_cus, Image) VALUES (' . $idCustomNew . ', "'. $view['Image'] .'")';
            $idViewNew = $this->db->insert($qV);
            $customElements = $this->getCustomElements($view['IDcusvie']);
            foreach ($customElements as &$customElement) {
                $qE = 'INSERT INTO bd_custom_elements (ID_cusvie, type, x, y, width, height, Zindex, area_attr, text, text_attr, ID_cussvg, Img_file) ';
                $qE .='VALUES ('.$idViewNew.', "'.$customElement['type'].'", '.$customElement['x'].', '.$customElement['y'].', '.$customElement['width'].', '.$customElement['height'].', '.$customElement['Zindex'].' , '.json_encode($customElement['area_attr']).', "'.$customElement['text'].'", '.json_encode($customElement['text_attr']).', '.json_encode($customElement['ID_cussvg']).', "'.$customElement['Img_file'].'" )';
                $idCustomElementNew = $this->db->insert($qE);
                if ($customElement['type'] == 'img'){
                    $newFile = time().'.'.explode('.',$customElement['Img_file'])[1];
                    if (copy($this->imgPath.$customElement['Img_file'], $this->imgPath.$newFile)) {
                        $qI = 'UPDATE bd_custom_elements SET Img_file="' . $newFile .'" WHERE IDcusele=' . $idCustomElementNew;
                        $this->db->update($qI);
                    }
                }
            }
        }
        return $idCustomNew;
    }

    public function putView($idCus) {

        $q = 'INSERT INTO bd_custom_views (ID_cus) VALUES (' . $idCus . ')';
        return $this->db->insert($q);
    }

    public function putArea($idVie) {

        $attr = json_encode('{"shape": "rectangle", "printable": "true", "detectcol": "true", "visible": "true"}');
        $q = 'INSERT INTO bd_custom_elements (ID_cusvie, type, x, y, width, height, Zindex, area_attr) VALUES (' . $idVie . ' , "area", -15, -15, 200, 200, 0, ' . $attr . ')';
        return $this->db->insert($q);
    }

    public function putText($idVie, $zindex) {

        $attr = json_encode('{"family": "arial", "weight": "normal", "style": "normal", "size": 20, "align": "center", "color": "000000"}');
        $q = 'INSERT INTO bd_custom_elements (ID_cusvie, type, x, y, width, height, Zindex, text, text_attr) VALUES (' . $idVie . ', "text", 200, 200, 250, 150, ' . $zindex . ' , "TEXTO", '. $attr .' )';
        return $this->db->insert($q);
    }

    public function putImg($idVie, $file, $zindex) {

        $q = 'INSERT INTO bd_custom_elements (ID_cusvie, type, x, y, width, height, Zindex, Img_file) VALUES (' . $idVie . ', "img", 200, 200, 200, 200, ' . $zindex . ', "' . $file . '")';
        return $this->db->insert($q);
    }

    public function putSvg($idVie, $idSvg, $zindex) {

        $q = 'INSERT INTO bd_custom_elements (ID_cusvie, type, x, y, width, height, Zindex, ID_cussvg) VALUES (' . $idVie . ', "svg", 200, 200, 200, 300, ' . $zindex . ', "' . $idSvg . '")';
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

    public function updateCustomElementZindex($idCusele, $zindex) {

        $q = 'UPDATE bd_custom_elements SET Zindex=' . $zindex . ' WHERE IDcusele=' . $idCusele;
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

    public function updateColor($idCus, $idProcol) {

        $q = 'UPDATE bd_custom SET ID_procol=' . $idProcol . ' WHERE IDcus=' . $idCus;
        return $this->db->update($q);
    }

    public function updateHeight($idCus, $data) {

        $q = 'UPDATE bd_custom SET Height=' . $data['height'] . ' WHERE IDcus=' . $idCus;
        return $this->db->update($q);
    }



    public function delCustom($idCus) {

        $q = 'DELETE FROM bd_custom WHERE IDcus=' . $idCus;
        $r = $this->db->delete($q);
        $views = $this->getViews($idCus);
        foreach ($views as &$view){
            $this->delView($view['IDcusvie'], false);
        }
        return $r;
    }

    public function delView($idVie, $mustDelViewImg) {

        $img = $this->db->select('SELECT Image FROM bd_custom_views WHERE IDcusvie=' . $idVie)[0]['Image'];
        $q = 'DELETE FROM bd_custom_views WHERE IDcusvie=' . $idVie;
        $r = $this->db->delete($q);
        if ( $img != 'default.jpg' && file_exists(realpath($this->imgPath . $img)) && $mustDelViewImg ) { 
            $r = ($r && unlink (realpath($this->imgPath . $img)));
        }
        $customElements = $this->getCustomElements($idVie);
        foreach ($customElements as &$customElement){
            $this->delCustomElement($customElement['IDcusele']);
        }
        return $r;
    }

    public function delCustomElement($idCusele) {

        $imgFile = $this->db->select('SELECT Img_file FROM bd_custom_elements WHERE IDcusele=' . $idCusele)[0]['Img_file'];
        //unlink (realpath($this->imgPath . $imgFile));
        $q = 'DELETE FROM bd_custom_elements WHERE IDcusele=' . $idCusele;
        return $this->db->delete($q);
    }
}
?>