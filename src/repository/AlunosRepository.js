import { conectar, query, desconectar } from '../config/database.js';
import Datas from '../utils/Datas.js';
import bcrypt from 'bcrypt';

const TABLE = 'usuario';

class AlunosRepository {

  async findByEmail(email) {

    const cliente = await conectar();

    const result = await query(cliente, `SELECT * FROM ${TABLE} WHERE email = $1`, [email]);

    await desconectar(cliente);
    return result[0];
  }

  async create({ nome, email, senha, nascimento }) {

    let nascimentoFormat = null;

    if (nascimento) {
      nascimentoFormat = Datas.getDataUTC(nascimento);
    }

    const senhaHash = bcrypt.hashSync(senha, 10);

    const cliente = await conectar();
    try {
      await query(cliente, 'BEGIN');

      const result = await query(cliente, `INSERT INTO ${TABLE}(nome, email, nascimento) VALUES ($1, $2, $3) RETURNING *`, [nome, email, nascimentoFormat]);

      await query(cliente, `INSERT INTO autenticacao(id_usuario, email, senha) VALUES ($1, $2, $3)`, [result[0].id, result[0].email, senhaHash]);

      await query(cliente, 'COMMIT');
      return result;

    } catch (error) {
      await query(cliente, 'ROLLBACK');
      console.log(error);
    } finally {
      await desconectar(cliente);
    }

  }
}

export default new AlunosRepository();