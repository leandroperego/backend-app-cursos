import jwt from "jsonwebtoken";

function isAuth(req, res, next) {
    const token = req.cookies['x-auth'];

    if (!token) {
        res.status(403).json({
            type: 'error',
            message: 'Nenhum usuário logado'
        });
        return;
    }

    try {
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({
                    type: 'error',
                    message: 'Token inválido'
                })
            } else {
                req.user = decoded;
                next();
            }
        });

    } catch (error) {
        res.status(500).json({
            type: 'error',
            message: 'Erro ao verificar o token'
        });
    }
}

export default isAuth;