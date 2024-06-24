import { conectar, desconectar, query } from '../config/database.js';

const TABLE = 'autenticacao';
class SessaoRepository{
    async findById(id){
        const cliente = await conectar();

        try{
            const sql = `SELECT * FROM ${TABLE} WHERE id_usuario = $1`;
            const valores = [id];
    
            const result = await query(cliente, sql, valores);
            return result[0];

        } catch (error){
            console.log('erro ao buscar dados de sessao do id informado.');
            return;
        } finally{
            desconectar(cliente);
        }
        
    }
}

export default new SessaoRepository();