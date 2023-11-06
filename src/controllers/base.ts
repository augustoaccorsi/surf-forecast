import { Response } from 'express';
import mongoose from 'mongoose';

export abstract class BaseController {
    protected sendCreateUpdateErrorReponse(res: Response, error: mongoose.Error.ValidationError | Error | unknown): Response {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(422).send({ code: 422, error: (error as Error).message });
        } else {
            return res.status(500).send({code: 500, error: 'Something went wrong.' });
        }
    }
}
