import { ForecastPoint, StormGlass } from '@src/clients/stormGlass';

export enum BeachPosition {
    S = 'S',
    N = 'N',
    W = 'W',
    E = 'E',
}

export interface Beach {
    name: string;
    position: BeachPosition;
    lat: number;
    lng: number;
    user: string;
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export interface TimeForecast {
    time: string,
    forecast: BeachForecast[]
}

export class Forecast {
    constructor(protected stormGlass = new StormGlass()) {}

    public async processForecastForBeaches(beaches: Beach[]): Promise<TimeForecast[]> {
        const pointsWithCorrectSource: BeachForecast[] = [];

        for (const beach of beaches) {
            const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
            const enrichedBeachData = points.map((point) => ({
                ...{
                    lat: beach.lat,
                    lng: beach.lng,
                    name: beach.name,
                    position: beach.position,
                    rating: 1,
                },
                ...point,
            }));
            pointsWithCorrectSource.push(...enrichedBeachData);
        }

        return this.mapForecastByTime(pointsWithCorrectSource);
    }

    private mapForecastByTime(forecasts: BeachForecast[]): TimeForecast[] {
        const forecastByTime: TimeForecast[] = [];

        for (const forecast of forecasts) {
            const timePoint = forecastByTime.find(f => f.time === forecast.time);
            timePoint
                ? timePoint.forecast.push(forecast)
                : forecastByTime.push({ time: forecast.time, forecast: [forecast] });
        }

        return forecastByTime;
    }
}
