import { BodyParams, Controller, Get, Post } from '@tsed/common';
import { Required } from '@tsed/schema';
import { AirConditionService } from '../../services/air-condition/AirConditionService';

@Controller({
    path: '/air-condition',
    children: []
})
export class AirConditionCtrl {
    constructor(private airConditionService: AirConditionService) {
    }

    @Get('/turn-on')
    async turnOn(): Promise<any> {
        await this.airConditionService.turnOn();
        return {};
    }

    @Get('/turn-off')
    async turnOff(): Promise<any> {
        await this.airConditionService.turnOff();
        return {};
    }

    @Get('/state')
    async getState(): Promise<{ state: boolean }> {
        return await this.airConditionService.getState();
    }

    @Get('/temperature')
    getTemperature(): { temperature: number } {
        return this.airConditionService.getTemperature();
    }

    @Post('/temperature')
    async setTemperature(@Required() @BodyParams('temperature') temperature: number): Promise<any> {
        await this.airConditionService.setTemperature(temperature);
        return {};
    }

    @Get('/status')
    async getStatus(): Promise<any> {
        return await this.airConditionService.getStatus();
    }

    @Get('/mode')
    getMode(): { mode: number } {
        return this.airConditionService.getMode();
    }

    @Post('/mode')
    async setMode(@Required() @BodyParams('mode') mode: number): Promise<any> {
        await this.airConditionService.setMode(mode);
        return {};
    }
}
