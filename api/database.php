<?php
class Database {

    const HOST = 'qtv922.sellosyrotulos.com';
    const DATABASE = 'qtv922';
    const USER = 'qtv922';
    const PASS = 'bdSELLOS15';

    private $con;
    private $numResults;
    private $results;

    public function connect(){

        if(!$this->con) {
            $this->con = mysql_connect(self::HOST, self::USER, self::PASS);
            if($this->con) {
                $seldb = mysql_select_db(self::DATABASE, $this->con);
                if($seldb) {
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

    public function select($q) {
        
        // echo ($q);
        $table = [];
        $query = mysql_query($q, $this->con);
        if($query) {
            $this->numResults = mysql_num_rows($query);
            // echo ('numR'.$this->numResults);
            while ($row = mysql_fetch_assoc($query)) {
                array_push($table, $row);
            }
        }
        return $table;
    }
    // public function insert()        {   }
    // public function delete()        {   }
    // public function update()    {   }
    // public function disconnect()    {   }
}
?>