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

        $this->con = mysql_connect(self::HOST, self::USER, self::PASS);
        if ($this->con) {
            $seldb = mysql_select_db(self::DATABASE, $this->con);
            if($seldb) {
                return true; 
            } else {
                return false; 
            }
        } else {
            return false; 
        }
    }

    public function select($q) {
        
        $table = [];
        $query = mysql_query($q, $this->con);
        if ($query) {
            $this->numResults = mysql_num_rows($query);
            if ($this->numResults == 0){
                return false;
            }
            else {
                while ($row = mysql_fetch_assoc($query)) {
                    array_push($table, $row);
                }
            }
        }
        return $table;
    }

    public function insert($q){

        $ins = @mysql_query($q);            
        if ($ins){
            return @mysql_insert_id(); 
        }
        else{
            return false; 
        }
    }

    public function update($q){

        $upd = @mysql_query($q);            
        if ($upd){
            return true; 
        }
        else{
            return false; 
        }
    }

    public function delete($q) {
 
        $del = @mysql_query($q);
        if ($del) {
            return true;
        }
        else {
           return false; 
        }
    }
    // public function delete()        {   }
    // public function update()    {   }
    // public function disconnect()    {   }

}
?>