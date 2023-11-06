import { Controller, Get } from '@overnightjs/core';
import { Beach } from '@src/models/beach';
import { Forecast } from '@src/services/forecast';
import { Request, Response } from 'express';
import { BaseController } from './base';

const forecast = new Forecast();

@Controller('forecast')
export class ForecastController extends BaseController{
    @Get('')
    public async getForecastForLoggedUser(_: Request, res: Response): Promise<void> {
        try {
            const beaches = await Beach.find({});
            const forecastData = await forecast.processForecastForBeaches(beaches);
            res.status(200).send(forecastData);
        } catch (error) {
            this.sendCreateUpdateErrorReponse(res, error);
        }
    }
}
