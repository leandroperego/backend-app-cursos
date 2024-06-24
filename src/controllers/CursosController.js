import CursosRepository from "../repository/CursosRepository.js";

class CursosController {
    async index(req, res) {
        const cursos = await CursosRepository.findAll();
        res.status(200).json(cursos);
        return;
    }

    async show(req, res) {

        if (!req.user) {
            const cursos = await CursosRepository.findAll(false);
            res.status(200).json(cursos);
            return;
        }

        const { id } = req.user;

        // filtros de busca TODO

        const cursos = await CursosRepository.findAllWithoutRegistration(id);

        res.status(200).json(cursos);
    }

    async cursosDisponiveisParaInscricao(req, res) {
        const cursos = await CursosRepository.findAll(false);
        res.status(200).json(cursos);
        return;
    }

    async handleMatriculas(req, res) {
        const { id: id_user } = req.user;
        const { id: id_curso } = req.params;

        const cursoExiste = await CursosRepository.findCursoById(id_curso);

        if (!cursoExiste) {
            res.status(404).json({
                type: 'error',
                mensagem: 'Curso não encontrado.'
            });
            return;
        }

        let result = null;
        try {
            result = await CursosRepository.handleMatriculas(id_user, id_curso);
        } catch (error) {
            res.status(500).json({
                type: 'error',
                mensagem: 'Erro na matricula.'
            });
        }

        if (result === 1) {
            res.status(201).json({
                type: 'success',
                mensagem: 'Inscrição realizada com sucesso'
            });
            return;
        } else if (result === 0) {
            res.status(201).json({
                type: 'success',
                mensagem: 'Inscrição cancelada com sucesso'
            });
            return;
        } else if (result === 2) {
            res.status(401).json({
                type: 'error',
                mensagem: 'Inscrição não autorizada!'
            });
            return;
        }
    }
}

export default new CursosController();