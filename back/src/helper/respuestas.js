const success = (req, res, mensaje = '', status = 200) => {
    res.status(200).send({
        success: true,
        status: status,
        body: mensaje
    })
}

const error = (req, res, mensaje = 'Error Interno', status = 500) => {
    res.status(200).send({
        success: false,
        status: status,
        body: mensaje
    })
}

module.exports = {
    success,
    error,
}