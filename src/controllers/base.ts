import { CUSTOM_VALIDATION } from '@src/models/user';
import { Response } from 'express';
import mongoose from 'mongoose';

export abstract class BaseController {
    protected sendCreateUpdateErrorResponse(
        res: Response,
        error: mongoose.Error.ValidationError | Error | unknown
    ): Response {
        if (error instanceof mongoose.Error.ValidationError) {
            const duplicatedKindErrors = Object.values(error.errors).filter(
                (err) => err.name === 'ValidatorError' && err.kind === CUSTOM_VALIDATION.DUPLICATED
            );
            const code = duplicatedKindErrors.length ? 409 : 422;
            return res.status(code).send({ code: code, error: (error as Error).message });
        } else {
            return res.status(500).send({ code: 500, error: 'Something went wrong.' });
        }
    }
}
