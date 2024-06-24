import { conectar, query, desconectar } from '../config/database.js';

const TABLE = 'cursos';

class CursosRepository {
  async findAll(iniciados = true) {

    const cliente = await conectar();

    let result = null;
    if (!iniciados) {
      result = await query(cliente, 
        `SELECT * FROM ${TABLE}
            WHERE inicio > CURRENT_DATE`);
    } else {
      result = await query(cliente, `SELECT * FROM ${TABLE}`);
    }
    await desconectar(cliente);
    return result;
  }

  async findAllWithoutRegistration(id_user) {
    const cliente = await conectar();

    const result = await query(cliente, 
      `SELECT * FROM (SELECT * FROM ${TABLE} WHERE inicio > CURRENT_DATE)
            WHERE id NOT IN 
                  ( SELECT id_curso FROM inscricoes WHERE id_aluno = $1)`, [id_user]);

    await desconectar(cliente);
    return result;
  }

  async findAllRegistration(id_user) {
    const cliente = await conectar();

    const result = await query(cliente, `
    WITH user_courses AS (
        SELECT id_curso, MIN(data_inscricao) AS data_inscricao, NULL AS data_cancelamento
        FROM inscricoes
        WHERE id_aluno = $1
        GROUP BY id_curso

        UNION

        SELECT id_curso, NULL AS data_inscricao, MIN(data_cancelamento) AS data_cancelamento
        FROM cancelamentos
        WHERE id_aluno = $1
        GROUP BY id_curso
    )
    SELECT 
        c.id, 
        c.nome,
        c.descricao,
        c.capa,
        c.inscricoes,
        c.inicio,
        MAX(uc.data_inscricao) AS data_inscricao,
        MAX(uc.data_cancelamento) AS data_cancelamento
    FROM cursos c
    JOIN user_courses uc ON c.id = uc.id_curso
    GROUP BY c.id, c.nome;`, [id_user]);

    await desconectar(cliente);
    return result;
  }

  async handleMatriculas(id_user, id_curso) {
    const cliente = await conectar();

    let result = null;

    if (await usuarioMatriculado(id_user, id_curso) && await usuarioJaCancelou(id_user, id_curso) === false) {
      await query(cliente, 
        `INSERT INTO cancelamentos (id_aluno, id_curso) 
              VALUES ($1, $2)`, [id_user, id_curso]);
      result = 0;
    } else {
      if (await usuarioJaCancelou(id_user, id_curso) === false) {
        await query(cliente, 
          `INSERT INTO inscricoes (id_aluno, id_curso) 
                VALUES ($1, $2)`, [id_user, id_curso]);
        result = 1;
      } else {
        result = 2;
      }
    }

    await desconectar(cliente);
    return result;
  }

  async findCursoById(id_curso) {
    const cliente = await conectar();

    const result = await query(cliente, 
      `SELECT * FROM ${TABLE} 
            WHERE id = $1`, [id_curso]);

    await desconectar(cliente);

    return result.length > 0;
  }

}

async function usuarioMatriculado(id_user, id_curso) {
  const cliente = await conectar();

  const result = await query(cliente, 
      `SELECT * FROM inscricoes 
            WHERE id_aluno = $1 AND id_curso = $2`, [id_user, id_curso]);

  await desconectar(cliente);

  return result.length > 0;
}

async function usuarioJaCancelou(id_user, id_curso) {
  const cliente = await conectar();

  const result = await query(cliente, 
      `SELECT * FROM cancelamentos 
            WHERE id_aluno = $1 AND id_curso = $2`, [id_user, id_curso]);

  await desconectar(cliente);

  return result.length > 0;
}

export default new CursosRepository();