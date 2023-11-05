import { ForecastPoint, StormGlass } from '@src/clients/stormGlass';

export enum BeachPosition {
    S = 'S',
    N = 'N',
    W = 'W',
    E = 'E'
}

export interface Beach {
    name: string;
    position: BeachPosition;
    lat: number;
    lng: number;
    user: string;
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {
}

export class Forecast {

    constructor(protected stormGlass = new StormGlass()) {}

    public async processForecastForBeaches(beaches: Beach[]): Promise<BeachForecast[]> {
        const pointsWithCorrectSource: BeachForecast[] = [];

        beaches.forEach(async (beach) => {
            const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
            const enrichedBeachData = points.map((point) => ({
                ...{
                    lat: beach.lat,
                    lng: beach.lng,
                    name: beach.name,
                    position: beach.position,
                    rating: 1
                },
                ...point
            }));

            pointsWithCorrectSource.push(...enrichedBeachData);
        });

        return pointsWithCorrectSource;
    }
}

