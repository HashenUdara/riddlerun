<?php
include_once "config.php";

class DBController
{
    private $host = DB_SERVER;
    private $user = DB_USERNAME;
    private $password = DB_PASSWORD;
    private $database =  DB_NAME;

    private $conn;

    function __construct()
    {
        $this->conn = $this->connectDB();
        // echo "Connection established";
    }

    // deconstruct
    function __destruct()
    {
        $this->conn->close();
        // echo "Connection closed";
    }

    function connectDB()
    {
        $conn = mysqli_connect($this->host, $this->user, $this->password, $this->database);
        return $conn;
    }

    // transaction support
    function beginTransaction()
    {
        mysqli_begin_transaction($this->conn);
    }

    function commitTransaction()
    {
        mysqli_commit($this->conn);
    }

    function rollbackTransaction()
    {
        mysqli_rollback($this->conn);
    }

    // getLastInsertedID
    function getLastInsertedID()
    {
        return mysqli_insert_id($this->conn);
    }

    function runBaseQuery($query)
    {
        $result = mysqli_query($this->conn, $query);
        while ($row = mysqli_fetch_assoc($result)) {
            $resultset[] = $row;
        }
        if (!empty($resultset))
            return $resultset;
    }

    function runQuery($query, $param_type, $param_value_array)
    {

        $sql = $this->conn->prepare($query);
        $this->bindQueryParams($sql, $param_type, $param_value_array);
        $sql->execute();
        $result = $sql->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $resultset[] = $row;
            }
        }

        if (!empty($resultset)) {
            return $resultset;
        }
    }

    function bindQueryParams($sql, $param_type, $param_value_array)
    {
        $param_value_reference[] = &$param_type;
        for ($i = 0; $i < count($param_value_array); $i++) {
            $param_value_reference[] = &$param_value_array[$i];
        }
        call_user_func_array(array(
            $sql,
            'bind_param'
        ), $param_value_reference);
    }

    function insert($query, $param_type, $param_value_array)
    {
        $sql = $this->conn->prepare($query);
        $this->bindQueryParams($sql, $param_type, $param_value_array);
        // $sql->execute();
        if ($sql->execute())
            return true;
        return false;
    }

    function update($query, $param_type, $param_value_array)
    {
        $sql = $this->conn->prepare($query);
        $this->bindQueryParams($sql, $param_type, $param_value_array);
        // $sql->execute();
        if ($sql->execute())
            return true;
        return false;
    }
}
