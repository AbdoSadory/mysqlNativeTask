import mysql from 'mysql2'

const connection = mysql.createConnection({
  database: 'sql_s2',
  host: 'localhost',
  user: 'root',
  password: '123456',
})

export default connection
