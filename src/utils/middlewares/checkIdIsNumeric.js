export default function checkIdIsNumeric(req, res, next) {
    const { id } = req.params;
    if (!/^\d+$/.test(id)) {
        // Se `id` não for numérico, passe para a próxima rota
        return next('route');
    }
    // Se `id` for numérico, continue com a rota atual
    next();
}