<?php
class Database {

    private $host = 'qtv922.sellosyrotulos.com';
    private $database = 'qtv922';
    private $user = 'qtv922';
    private $pass = 'bdSELLOS15';

    private $con;
    private $numResults;
    private $results;

    public function connect(){
        if(!$this->con) {
            $this->con = mysql_connect($this->host, $this->user, $this->pass);
            if($this->con) {
                $seldb = mysql_select_db($this->database, $this->con);
                if($seldb) {
                    // ⁄$this->con = true;
                    return true; 
                } else {
                    return false; 
                }
            } else {
                return false; 
            }
        } else {
            return true; 
        }
    }
    public function select() {
        $q = 'SELECT * FROM qtv922.bd_news';
        $query = mysql_query($q, $this->con);
        if($query) {
            $this->numResults = mysql_num_rows($query);
            while ($fila = mysql_fetch_assoc($query)) {
                foreach($fila as $r) {
                    echo $r, '<br>';
                }
            }
        }
    }
    // public function insert()        {   }
    // public function delete()        {   }
    // public function update()    {   }
    // public function disconnect()    {   }
}
?>