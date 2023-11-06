import { StormGlass } from '@src/clients/stormGlass';
import stormglassNormalizedResponseFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';
import apiForecastResponse1BeachFixture from '@test/fixtures/api_forecast_response_1_beach.json';
import { Forecast, ForecastProcessingInternalError } from '../forecast';
import { Beach, BeachPosition } from '@src/models/beach';

jest.mock('@src/clients/stormGlass');

describe('Forecast Service', () => {
    const mockedStormGlassService = new StormGlass() as jest.Mocked<StormGlass>;
    mockedStormGlassService.fetchPoints.mockResolvedValue(stormglassNormalizedResponseFixture);

    it('should return the forecast for a list of beaches', async () => {
        const beaches: Beach[] = [
            {
                lat: -33.792726,
                lng: 151.289824,
                name: 'Manly',
                position: BeachPosition.E,
            },
        ];

        const forecast = new Forecast(mockedStormGlassService);
        const beachesWithRating = await forecast.processForecastForBeaches(beaches);

        expect(beachesWithRating).toEqual(apiForecastResponse1BeachFixture);
    });

    it('should return an empty list when the beaches array is empty', async () => {
        const forecast = new Forecast();
        const response = await forecast.processForecastForBeaches([]);
        expect(response).toEqual([]);
    });

    it('should throw internal processing error when something goes wrong during the rating process', async () => {
        const beaches: Beach[] = [
            {
                lat: -33.792726,
                lng: 151.289824,
                name: 'Manly',
                position: BeachPosition.E,
            },
        ];

        const errorMessage = 'Error fetching data';
        mockedStormGlassService.fetchPoints.mockRejectedValue(errorMessage);

        const forecast = new Forecast(mockedStormGlassService);
        await expect(forecast.processForecastForBeaches(beaches)).rejects.toThrow(
            ForecastProcessingInternalError
        );
    });
});
