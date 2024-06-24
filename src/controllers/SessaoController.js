import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AlunosRepository from '../repository/AlunosRepository.js';
import SessaoRepository from '../repository/SessaoRepository.js';

class SessaoController {
    async create(req, res) {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                res.status(400).json({
                    type: 'error',
                    message: 'E-mail e senha são obrigatórios'
                });
                return;
            }

            const usuario = await AlunosRepository.findByEmail(email).then((aluno) => aluno);

            if (!usuario) {
                res.status(400).json({
                    type: 'error',
                    message: 'E-mail e/ou senha inválidos'
                });
                return;
            }

            const dadosLogin = await SessaoRepository.findById(usuario.id);

            const senhaValida = await bcrypt.compareSync(senha, dadosLogin.senha);

            if (!senhaValida) {
                res.status(400).json({
                    type: 'error',
                    message: 'E-mail e/ou senha inválidos'
                });
                return;
            }

            const token = jwt.sign({ id: usuario.id }, process.env.SECRET, {
                expiresIn: '1d'
            });

            res.cookie('x-auth', token);
            res.status(200).json({
                type: 'sucess',
                message: 'Login realizado com sucesso'
            });

            return;

        } catch (error) {
            console.log(error)
            res.status(500).json({
                type: 'error',
                message: 'Erro ao realizar login'
            });
            return;
        }
    }

    async delete(req, res) {
        res.clearCookie('x-auth');
        res.status(200).json({ message: 'Logout success' });
        return;
    }
}

export default new SessaoController();