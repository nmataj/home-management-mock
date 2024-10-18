import { BodyParams, Controller, Get, PathParams, Post } from '@tsed/common';
import { Required, Description } from '@tsed/schema';
import { LightsService } from '../../services/lights/LightsService';
import { HueLight } from 'src/interfaces/HueLight';

@Controller({
  path: '/lights',
  children: [],
})
export class LightsCtrl {
  constructor(private lightsService: LightsService) {}

  @Get('/hue/')
  @Description('Get list of available lights.')
  async list(): Promise<HueLight[]> {
    return await this.lightsService.list();
  }
  h;
  @Get('/hue/:id')
  @Description('Get state for selected light.')
  async getStatus(@PathParams('id') id: string): Promise<any> {
    return await this.lightsService.getStatus(id);
  }

  @Post('/hue/:id')
  @Description('Set state for selected light.')
  async seetState(
    @PathParams('id') id: string,
    @BodyParams() state: any
  ): Promise<any> {
    return await this.lightsService.setState(id, state);
  }

  @Post('/hue/:id/turn-on')
  @Description('Turns on selected light.')
  async turnOn(@PathParams('id') id: string): Promise<any> {
    return await this.lightsService.turnOn(id);
  }

  @Post('/hue/:id/turn-off')
  @Description('Turns off selected light.')
  async turnOffHue(@PathParams('id') id: string): Promise<any> {
    return await this.lightsService.turnOff(id);
  }

  @Post('/strips/start-animation')
  @Description('Start animation on strip.')
  async startAnimation(
    @Required() @BodyParams('id') id: string,
    @Required() @BodyParams('type') type: string
  ): Promise<any> {
    return await this.lightsService.startAnimation(id, type);
  }

  @Post('/strips/stop-animation')
  @Description('Stop animation on strip.')
  async stopAnimation(@Required() @BodyParams('id') id: string): Promise<any> {
    return await this.lightsService.stopAnimation(id);
  }

  @Post('/strips/turn-off')
  @Description('Turns off selected strip.')
  async turnOff(@Required() @BodyParams('id') id: string): Promise<any> {
    return await this.lightsService.turnOffStrip(id);
  }

  @Post('/strips/set-color')
  @Description('Set strip color (RGBW).')
  async setColorRGB(
    @Required() @BodyParams('id') id: string,
    @Required() @BodyParams('r') r: number,
    @Required() @BodyParams('g') g: number,
    @Required() @BodyParams('b') b: number,
    @BodyParams('w') w?: number,
    @BodyParams('type') type?: string
  ): Promise<any> {
    return await this.lightsService.fill(
      id,
      {
        r: r ?? 0,
        g: g ?? 0,
        b: b ?? 0,
        w: w ?? 0,
      },
      type
    );
  }

  @Post('/strips/set-color/hsv')
  @Description('Set strip color (HSV).')
  async setColorHSV(
    @Required() @BodyParams('id') id: string,
    @Required() @BodyParams('h') h: number,
    @Required() @BodyParams('s') s: number,
    @Required() @BodyParams('v') v: number,
    @BodyParams('type') type?: string
  ): Promise<any> {
    return await this.lightsService.fillHSV(
      id,
      {
        h: h ?? 0,
        s: s ?? 0,
        v: v ?? 0,
      },
      type
    );
  }

  @Post('/strips/set-brightness')
  @Description('Set strip brightness.')
  async setBrightness(
    @Required() @BodyParams('id') id: string,
    @Required() @BodyParams('brightness') brightness: number
  ): Promise<any> {
    return await this.lightsService.setBrightness(id, brightness);
  }

  @Get('/strips/strip-status/list')
  @Description('List of strips.')
  async getStripStatusList(): Promise<any> {
    return await this.lightsService.getStripStatusList();
  }

  @Get('/strips/strip-status/:id')
  @Description('Get state for selected strip.')
  async getStripStatus(@PathParams('id') id: string): Promise<any> {
    return await this.lightsService.getStripStatus(id);
  }

  @Get('/strips/pi-status/list')
  @Description('Get state for selected strip.')
  async getStripServerStatusList(): Promise<any> {
    return await this.lightsService.getRPIStatusList();
  }

  @Get('/strips/pi-status/:id')
  @Description('Get state for selected strip.')
  async getStripServerStatus(@PathParams('id') id: string): Promise<any> {
    return await this.lightsService.getRPIStatus(id);
  }
}
