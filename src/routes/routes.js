import CursosRepository from '../repository/CursosRepository.js';
import checkIdIsNumeric from '../utils/middlewares/checkIdIsNumeric.js';
import isAuth from '../utils/middlewares/isAuth.js';
import AlunosRouter from './AlunosRouter.js';
import CursosRouter from './CursosRouter.js';
import SessaoRouter from './SessaoRouter.js';

const routes = (app) => {
    app.use('/autenticacao', SessaoRouter);
    app.use('/usuarios', AlunosRouter);
    app.use('/cursos', CursosRouter);
    app.get('/:id', isAuth, checkIdIsNumeric, async (req, res) => {

        const { id: id_user } = req.user;
        const { id: id_rota } = req.params;

        if (id_user !== Number(id_rota)) {
            res.status(403).json({ 
                type: 'error', 
                mensagem: 'Não autorizado' 
            });
            return;
        }
       const cursos = await CursosRepository.findAllRegistration(id_user);

        res.status(200).json(cursos);
    });
    app.get('/:any', (req, res) => res.status(404).send('404 - Not Found'));
}

export default routes;