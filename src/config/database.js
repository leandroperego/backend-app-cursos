import pg from 'pg';
import 'dotenv/config';

export async function conectar() {

    const client = new pg.Client({
        connectionString: process.env.DATABASE_URL
    });

    try{
        await client.connect();
        console.log('Conectado ao banco de dados!');
        return client;
    } catch (err) {
        console.log(err.message);
        return;
    }
}

export async function desconectar(client) {
    await client.end();
    console.log('Desconectado do banco de dados!');
}

export async function query(client, query, values = undefined) {

    try {
        const result = await client.query(query, values);
        return result.rows;
    } catch (err) {
        console.log("Erro ao executar a query: ", err);
        throw err;
    }
        
}