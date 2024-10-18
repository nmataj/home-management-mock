import { BodyParams, Controller, Get, Post } from '@tsed/common';
import { Required } from '@tsed/schema';
import { Shutter, SomfyService } from '../../services/somfy/SomfyService';

@Controller({
    path: '/shutters'
})
export class ShuttersCtrl {
    constructor(private service: SomfyService) { }

    @Get('/list')
    async turnOn(): Promise<Shutter[]> {
        return await this.service.getShutters();
    }

    @Post('/up')
    async moveUp(@Required() @BodyParams('id') id: string): Promise<{}> {
        //await this.service.moveUp(id);
        return {};
    }

    @Post('/down')
    async moveDown(@Required() @BodyParams('id') id: string): Promise<{}> {
        //await this.service.moveDown(id);
        return {};
    }

    @Post('/stop')
    async stop(@Required() @BodyParams('id') id: string): Promise<{}> {
        //await this.service.stop(id);
        return {};
    }
}
