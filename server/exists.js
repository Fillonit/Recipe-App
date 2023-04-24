export default function exists(table, id) {
    if (typeof id != 'number') return false;
    const sql = require("mssql/msnodesqlv8");
    const config = {
        database: 'Recipes',
        server: 'DESKTOP-8HBAVK7',
        driver: 'msnodesqlv8',
        options: {
            trustedConnection: true
        }
    };
    sql.connect(config, (err) => {
        if (err) return false;
        const q = `SELECT COUNT(*) AS count FROM ${table} WHERE RecipeId = ${id}`;
        const request = new sql.Request();
        request.query(q, (err, res) => {
            if (err) return false;
            if (res.recordset.length === 0) return false;
            return true;
        })
    });
}