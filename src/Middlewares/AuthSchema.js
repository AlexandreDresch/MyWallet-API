export function authSchema(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);

        if (error) {;
            console.error(error);
            return res.sendStatus(422);
        }

        next();
    }
}