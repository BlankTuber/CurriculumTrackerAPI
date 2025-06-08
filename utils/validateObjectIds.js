const mongoose = require("mongoose");

const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

const validateObjectIds = (paramNames) => {
    const params = Array.isArray(paramNames) ? paramNames : [paramNames];

    return (req, res, next) => {
        const invalidParams = [];

        for (const paramName of params) {
            const paramValue = req.params[paramName];

            if (paramValue && !isValidObjectId(paramValue)) {
                invalidParams.push(paramName);
            }
        }

        if (invalidParams.length > 0) {
            return res.status(400).json({
                message: `Invalid ObjectId format for parameter(s): ${invalidParams.join(
                    ", "
                )}`,
            });
        }

        next();
    };
};

const validateMultipleIds = (ids) => {
    for (const [paramName, idValue] of Object.entries(ids)) {
        if (idValue && !isValidObjectId(idValue)) {
            return {
                isValid: false,
                invalidId: paramName,
                message: `Invalid ObjectId format for ${paramName}`,
            };
        }
    }
    return { isValid: true };
};

const validateSingleId = (id, paramName, res) => {
    if (!isValidObjectId(id)) {
        res.status(400).json({
            message: `Invalid ObjectId format for ${paramName}`,
        });
        return false;
    }
    return true;
};

module.exports = {
    isValidObjectId,
    validateObjectIds,
    validateMultipleIds,
    validateSingleId,
};
