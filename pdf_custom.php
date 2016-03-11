<?php
require_once('product-customizer/api/api-requests.php');

class RenderCustom {

    public function __construct() {
    
        $this->apiRequests = new ApiRequests();
        $this->idCus = $_GET['IDcus'];
        $this->type = $_GET['type']; //[pdf|pdfwb]
        $this->idProd = $this->apiRequests->getProductId($this->idCus)[0]['ID_pro'];
        $this->prod = $this->apiRequests->getProduct($this->idProd)[0];
        $this->custom = $this->apiRequests->getCustomization($this->idCus)[0];
        $this->color = $this->apiRequests->getColor($this->custom['ID_procol'])[0]['Color'];
        $this->views = $this->apiRequests->getViews($this->idCus);
        $this->imgUrl = 'http://www.sellosyrotulos.com/img/custom/';
        $this->svgUrl = 'http://www.sellosyrotulos.com/img/customSVG/';
    }

    private function renderCustomElement($element){

        $r = '<div class="wrapper-custom-element" id="'.$element['IDcusele'].'" style="';
        $r .= 'width: '.$element['width'].'px;';
        $r .= 'height: '.$element['height'].'px;';
        $r .= 'left: '.$element['x'].'px;';
        $r .= 'top: '.$element['y'].'px;';
        $r .= 'z-index: '.$element['Zindex']; 
        $r .= '"/>';
        return $r;
    }

    public function renderArea($area){

        $r = $this->renderCustomElement($area);
        $r .= '<div class="custom-element area" style="';
        $r .= 'width: '.($area['width']-32).'px;';
        $r .= 'height: '.($area['height']-32).'px;';
        $r .= 'left: 15px;';
        $r .= 'top: 15px;';
        $area_attr = json_decode($area['area_attr']);
        if ($area_attr->shape == 'ellipse')
            $r .= 'border-radius: 50%;';
        if ($area_attr->printable == 'false')
            $r .= 'background-color: rgba(255, 0, 0, 0.2);';
        $r .= '">';
        $r .= '</div>'; //custom-element area
        $r .= '</div>'; //wrapper-custom-element
        return $r;
    }

    public function renderText($text){

        $r = $this->renderCustomElement($text);
        $r .= '<div class="custom-element text" style="';
        $r .= 'width: '.($text['width']-32).'px;';
        $r .= 'height: '.($text['height']-32).'px;';
        $r .= 'left: 15px;';
        $r .= 'top: 15px;';
        $text_attr = json_decode($text['text_attr']);
        $r .= 'font-family: \''.$text_attr->family.'\';';
        $r .= 'font-weight: '.$text_attr->weight.';';
        $r .= 'font-style: '.$text_attr->style.';';
        $r .= 'font-size: '.$text_attr->size.'px;';
        $r .= 'text-align: '.$text_attr->align.';';
        $multiColorTypes = array('1', '4', '5', '6');
        if (in_array($this->prod['ID_protip'], $multiColorTypes))   { $color = '#'.$text_attr->color;   }
        else                                                        { $color = $this->color;            }
        $r .= 'color: '.$color.';';
        $r .= '">';
        $r .= $text['text'];
        $r .= '</div>'; //custom-element text
        $r .= '</div>'; //wrapper-custom-element
        return $r;
    }

    public function renderSvg($svg){

        $r = $this->renderCustomElement($svg);
        $r .= '<div class="custom-element svg" style="';
        $r .= 'width: '.($svg['width']-32).'px;';
        $r .= 'height: '.($svg['height']-32).'px;';
        $r .= 'left: 15px;';
        $r .= 'top: 15px;';
        $r .= '">';
        $r .= '<img src="'.$this->svgUrl.$svg['Svg_file'].'" />';
        $r .= '</div>'; //custom-element text
        $r .= '</div>'; //wrapper-custom-element
        return $r;
    }

    public function renderImg($img) {

        $r = $this->renderCustomElement($img);
        $r .= '<div class="custom-element img" style="';
        $r .= 'width: '.($img['width']-32).'px;';
        $r .= 'height: '.($img['height']-32).'px;';
        $r .= 'left: 15px;';
        $r .= 'top: 15px;';
        $r .= '">';
        $r .= '<img src="'.$this->imgUrl.$img['Img_file'].'" />';
        $r .= '</div>'; //custom-element text
        $r .= '</div>'; //wrapper-custom-element
        return $r;
    }

    public function getFonts() {
        function getFont($font){
            return('\''.$font['Font'].'\'');
        }
        $fonts = array_map('getFont', $this->apiRequests->getFonts());
        $fonts = implode(', ', $fonts);
        return $fonts;
    }
}

$render = new RenderCustom();
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Sellos y Rótulos</title>
    <link href="product-customizer/styles.css" rel="stylesheet" type="text/css" />
    <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js"></script>
    <script>
      WebFont.load({
        google: {
          families: [<?=$render->getFonts()?>]
        }
      });
    </script>
    <style>
        body {
            width: 600px;
            margin: 0;
            padding: 0;
        }
        .view {
            margin: 0;
            padding: 0;
            position: absolute;
            width: 600px;
            height: <?=$render->custom['Height']?>px;
        } 
    </style>
</head>

<body>
    <?php
    foreach ($render->views as $i=>$view) {
        $divView = '<div class="view" ';
        $divView .= 'style="top:'.($render->custom['Height']*($i)).'px;';
        if ($render->type!='pdfwb')
            $divView .='background-image:url('.$render->imgUrl.$view['Image'].')';
        $divView .= '">';
        echo ($divView);
        $customElements = $render->apiRequests->getCustomElements($view['IDcusvie']);
        foreach ($customElements as $j=>&$customElement){
            switch ($customElement['type']) {
                case 'area':
                    echo $render->renderArea($customElement);
                    break;
                case 'text':
                    echo $render->renderText($customElement);
                    break;
                case 'svg':
                    echo $render->renderSvg($customElement);
                    break;
                case 'img':
                    echo $render->renderImg($customElement);
                    break;
            }
        }
        echo ('</div>');
    }
    ?>
</body>
</html>
