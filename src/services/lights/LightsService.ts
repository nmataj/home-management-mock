import { Service } from '@tsed/common';
import * as Hue from 'philips-hue';
import { HueLight, HueLightState } from 'src/interfaces/HueLight';
import { RequestHelper } from '../../helpers/RequestHelper';
import * as os from 'os-utils';
import rgb from 'hsv-rgb';

// sudo systemctl [start/stop/restart] hue-emulator.service
// sudo systemctl restart hue-emulator.service
// docker run -d --name diyHue --restart=always --network=host -e MAC=dc:a6:32:56:b6:55 -v /mnt/hue-emulator/export:/opt/hue-emulator/export diyhue/core:latest

export interface RPIServer {
  baseURL: string;
  id: string;
  strips: string[];
}

@Service()
export class LightsService {
  private hue: any;
  private rpiIdMap = new Map<string, string>();
  private stripIdMap = new Map<string, string>();
  private cpuUsage = 0;
  private cpuFree = 0;
  private temp = 0;

  private hueLights = {
    '7': {
      state: {
        on: false,
        bri: 1,
        hue: 34816,
        sat: 5,
        effect: 'none',
        xy: [0.735, 0.265],
        ct: 346,
        alert: 'select',
        colormode: 'xy',
        mode: 'homeautomation',
        reachable: false,
      },
      swupdate: {
        state: 'notupdatable',
        lastinstall: '2019-06-16T11:28:16',
      },
      type: 'Extended color light',
      name: 'Hue strip 2',
      modelid: 'GL-C-007',
      manufacturername: 'GLEDOPTO',
      productname: 'Extended color light',
      capabilities: {
        certified: false,
        control: {
          colorgamuttype: 'other',
          ct: {
            min: 0,
            max: 65535,
          },
        },
        streaming: {
          renderer: false,
          proxy: false,
        },
      },
      config: {
        archetype: 'classicbulb',
        function: 'mixed',
        direction: 'omnidirectional',
      },
      uniqueid: '00:12:4b:00:1d:04:d2:b0-0b',
      swversion: '1.0.7',
    },
    '9': {
      state: {
        on: false,
        bri: 254,
        hue: 36980,
        sat: 254,
        effect: 'none',
        xy: [0.1611, 0.3547],
        ct: 153,
        alert: 'select',
        colormode: 'xy',
        mode: 'homeautomation',
        reachable: true,
      },
      swupdate: {
        state: 'noupdates',
        lastinstall: '2023-08-17T04:28:16',
      },
      type: 'Extended color light',
      name: 'Hue color lamp 1',
      modelid: 'LCT016',
      manufacturername: 'Signify Netherlands B.V.',
      productname: 'Hue color lamp',
      capabilities: {
        certified: true,
        control: {
          mindimlevel: 1000,
          maxlumen: 800,
          colorgamuttype: 'C',
          colorgamut: [
            [0.6915, 0.3083],
            [0.17, 0.7],
            [0.1532, 0.0475],
          ],
          ct: {
            min: 153,
            max: 500,
          },
        },
        streaming: {
          renderer: true,
          proxy: true,
        },
      },
      config: {
        archetype: 'sultanbulb',
        function: 'mixed',
        direction: 'omnidirectional',
        startup: {
          mode: 'safety',
          configured: true,
        },
      },
      uniqueid: '00:17:88:01:03:aa:ed:af-0b',
      swversion: '1.108.5',
      swconfigid: '91925CAC',
      productid: 'Philips-LCT016-1-A19ECLv5',
    },
    '10': {
      state: {
        on: true,
        bri: 254,
        hue: 7862,
        sat: 195,
        effect: 'none',
        xy: [0.4963, 0.4166],
        ct: 436,
        alert: 'select',
        colormode: 'xy',
        mode: 'homeautomation',
        reachable: false,
      },
      swupdate: {
        state: 'transferring',
        lastinstall: '2023-01-20T15:31:07',
      },
      type: 'Extended color light',
      name: 'Hue color lamp 4',
      modelid: 'LCT016',
      manufacturername: 'Signify Netherlands B.V.',
      productname: 'Hue color lamp',
      capabilities: {
        certified: true,
        control: {
          mindimlevel: 1000,
          maxlumen: 800,
          colorgamuttype: 'C',
          colorgamut: [
            [0.6915, 0.3083],
            [0.17, 0.7],
            [0.1532, 0.0475],
          ],
          ct: {
            min: 153,
            max: 500,
          },
        },
        streaming: {
          renderer: true,
          proxy: true,
        },
      },
      config: {
        archetype: 'sultanbulb',
        function: 'mixed',
        direction: 'omnidirectional',
        startup: {
          mode: 'custom',
          configured: true,
          customsettings: {
            bri: 254,
            xy: [0.4965, 0.4167],
          },
        },
      },
      uniqueid: '00:17:88:01:03:ec:17:f5-0b',
      swversion: '1.101.2',
      swconfigid: '91925CAC',
      productid: 'Philips-LCT016-1-A19ECLv5',
    },
    '11': {
      state: {
        on: false,
        bri: 254,
        hue: 8417,
        sat: 140,
        effect: 'none',
        xy: [0.4574, 0.41],
        ct: 366,
        alert: 'select',
        colormode: 'xy',
        mode: 'homeautomation',
        reachable: true,
      },
      swupdate: {
        state: 'noupdates',
        lastinstall: '2023-08-17T04:27:25',
      },
      type: 'Extended color light',
      name: 'Hue color lamp 2',
      modelid: 'LCT016',
      manufacturername: 'Signify Netherlands B.V.',
      productname: 'Hue color lamp',
      capabilities: {
        certified: true,
        control: {
          mindimlevel: 1000,
          maxlumen: 800,
          colorgamuttype: 'C',
          colorgamut: [
            [0.6915, 0.3083],
            [0.17, 0.7],
            [0.1532, 0.0475],
          ],
          ct: {
            min: 153,
            max: 500,
          },
        },
        streaming: {
          renderer: true,
          proxy: true,
        },
      },
      config: {
        archetype: 'sultanbulb',
        function: 'mixed',
        direction: 'omnidirectional',
        startup: {
          mode: 'safety',
          configured: true,
        },
      },
      uniqueid: '00:17:88:01:03:b0:8f:d8-0b',
      swversion: '1.108.5',
      swconfigid: '91925CAC',
      productid: 'Philips-LCT016-1-A19ECLv5',
    },
    '12': {
      state: {
        on: false,
        bri: 254,
        hue: 8417,
        sat: 140,
        effect: 'none',
        xy: [0.4574, 0.41],
        ct: 366,
        alert: 'select',
        colormode: 'xy',
        mode: 'homeautomation',
        reachable: true,
      },
      swupdate: {
        state: 'noupdates',
        lastinstall: '2023-08-17T04:27:28',
      },
      type: 'Extended color light',
      name: 'Hue color lamp 3',
      modelid: 'LCT016',
      manufacturername: 'Signify Netherlands B.V.',
      productname: 'Hue color lamp',
      capabilities: {
        certified: true,
        control: {
          mindimlevel: 1000,
          maxlumen: 800,
          colorgamuttype: 'C',
          colorgamut: [
            [0.6915, 0.3083],
            [0.17, 0.7],
            [0.1532, 0.0475],
          ],
          ct: {
            min: 153,
            max: 500,
          },
        },
        streaming: {
          renderer: true,
          proxy: true,
        },
      },
      config: {
        archetype: 'sultanbulb',
        function: 'mixed',
        direction: 'omnidirectional',
        startup: {
          mode: 'safety',
          configured: true,
        },
      },
      uniqueid: '00:17:88:01:03:ab:22:4b-0b',
      swversion: '1.108.5',
      swconfigid: '91925CAC',
      productid: 'Philips-LCT016-1-A19ECLv5',
    },
    '13': {
      state: {
        on: true,
        bri: 254,
        hue: 0,
        sat: 0,
        effect: 'none',
        xy: [0.6812, 0.3008],
        ct: 156,
        alert: 'select',
        colormode: 'ct',
        mode: 'homeautomation',
        reachable: true,
      },
      swupdate: {
        state: 'notupdatable',
        lastinstall: '2022-01-24T07:29:26',
      },
      type: 'Extended color light',
      name: 'Hue strip 1',
      modelid: 'GL-C-007',
      manufacturername: 'GLEDOPTO',
      productname: 'Extended color light',
      capabilities: {
        certified: false,
        control: {
          colorgamuttype: 'other',
          ct: {
            min: 0,
            max: 65535,
          },
        },
        streaming: {
          renderer: false,
          proxy: false,
        },
      },
      config: {
        archetype: 'classicbulb',
        function: 'mixed',
        direction: 'omnidirectional',
      },
      uniqueid: '00:12:4b:00:1d:04:e5:1c-0b',
      swversion: '1.0.7',
    },
  };

  private strips = [
    {
      id: 'pc-strip',
      name: 'Wall strip (PC)',
      ledCount: 300,
      currentColor: {
        r: 0,
        g: 0,
        b: 0,
        w: 0,
      },
      currentBrightness: 100,
      animationInProgress: false,
      currentAnimation: 'off',
      isOn: false,
    },
    {
      id: 'tv-strip',
      name: 'Wall strip (TV)',
      ledCount: 300,
      currentColor: {
        r: 0,
        g: 0,
        b: 0,
        w: 0,
      },
      currentBrightness: 100,
      animationInProgress: false,
      currentAnimation: 'off',
      isOn: false,
    },
  ];

  constructor() {
    this.hue = new Hue.default();
    this.hue.bridge = '192.168.1.9';
    this.hue.username = 'e0zEPXgLvX8PyEklrJhuwWC2LncZ09VjtrkleAN9';

    this.rpiIdMap.set('pc-rpi', 'http://127.0.0.1:2001');
    this.rpiIdMap.set('tv-rpi', 'http://192.168.0.16:2001');
    this.stripIdMap.set('pc-strip', 'http://127.0.0.1:2001');
    this.stripIdMap.set('tv-strip', 'http://192.168.0.16:2001');

    os.cpuUsage((value) => {
      this.cpuUsage = value;
    });

    os.cpuFree((value) => {
      this.cpuFree = value;
    });
  }

  async list(): Promise<any> {
    return this.hueLights;
  }

  lightExists(id: string): boolean {
    if (this.hueLights[id] !== undefined) {
      return true;
    }
    throw { status: 404, code: 'lightNotFound' };
  }

  stripExists(id: string): boolean {
    const strip = this.strips.find((strip) => strip.id === id);
    if (strip !== undefined) {
      return true;
    }
    throw { status: 404, code: 'lightNotFound' };
  }

  async turnOn(id: string) {
    //return await this.hue.light(id).on();
    this.lightExists(id);
    this.hueLights[id].state.on = true;
    return this.hueLights[id];
  }

  async turnOff(id: string) {
    //return await this.hue.light(id).off();
    this.lightExists(id);
    this.hueLights[id].state.on = false;
    return this.hueLights;
  }

  async getStatus(id: string) {
    //return await this.hue.light(id).getInfo();
    this.lightExists(id);
    return this.hueLights[id];
  }

  async setState(id: string, state: HueLightState) {
    //console.log(id, state);
    //return await this.hue.light(id).setState(state);
    this.lightExists(id);
    this.hueLights[id].state = state;
    return this.hueLights[id];
  }

  getStripURL(id: string): string {
    const strip = this.stripIdMap.get(id);

    if (!strip) {
      throw { status: 404, code: 'stripNotFound' };
    }

    return strip;
  }

  getRPIURL(id: string): string {
    const strip = this.rpiIdMap.get(id);

    if (!strip) {
      throw { status: 404, code: 'rpiNotFound' };
    }

    return strip;
  }

  async setBrightness(id: string, brightness: number) {
    // const baseURL = this.getStripURL(id);
    // return await RequestHelper.call({
    //   baseURL,
    //   url: '/set-brightness',
    //   method: 'POST',
    //   data: { brightness },
    // });
    const strip = this.strips.find((strip) => strip.id === id);
    if (!strip) {
      throw { status: 404, code: 'stripNotFound' };
    }
    strip.currentBrightness = brightness;
    return strip;
  }

  async startAnimation(id: string, type: string) {
    // const baseURL = this.getStripURL(id);
    // return await RequestHelper.call({
    //   baseURL,
    //   url: '/start-animation',
    //   method: 'POST',
    //   data: { type },
    // });
    const strip = this.strips.find((strip) => strip.id === id);
    if (!strip) {
      throw { status: 404, code: 'stripNotFound' };
    }
    strip.animationInProgress = true;
    strip.currentAnimation = type;
    return strip;
  }

  async stopAnimation(id: string) {
    // const baseURL = this.getStripURL(id);
    // return await RequestHelper.call({
    //   baseURL,
    //   url: '/stop-animation',
    //   method: 'POST',
    //   data: {},
    // });
    const strip = this.strips.find((strip) => strip.id === id);
    if (!strip) {
      throw { status: 404, code: 'stripNotFound' };
    }
    strip.animationInProgress = false;
    strip.currentAnimation = 'off';
    return strip;
  }

  async fill(
    id: string,
    color: { r: number; g: number; b: number; w: number },
    type?: string
  ) {
    // const baseURL = this.getStripURL(id);
    // return await RequestHelper.call({
    //   baseURL,
    //   url: '/set-color/rgb',
    //   method: 'POST',
    //   data: { ...color, type },
    // });
    const strip = this.strips.find((strip) => strip.id === id);
    if (!strip) {
      throw { status: 404, code: 'stripNotFound' };
    }
    strip.currentColor = color;
    strip.currentAnimation = type || 'off';
    strip.isOn = true;
    return strip;
  }

  async fillHSV(
    id: string,
    color: { h: number; s: number; v: number },
    type?: string
  ) {
    // const baseURL = this.getStripURL(id);
    // return await RequestHelper.call({
    //   baseURL,
    //   url: '/set-color/hsv',
    //   method: 'POST',
    //   data: { ...color, type },
    // });
    const strip = this.strips.find((strip) => strip.id === id);
    const hsvToRgb = rgb(color.h, color.s, color.v);

    if (!strip) {
      throw { status: 404, code: 'stripNotFound' };
    }

    // strip.currentColor = {
    //   r: hsvToRgb[0],
    //   g: hsvToRgb[1],
    //   b: hsvToRgb[2],
    //   w: 0,
    // };
    strip.currentAnimation = type || 'off';
    return strip;
  }

  async turnOffStrip(id: string) {
    // const baseURL = this.getStripURL(id);
    // return await RequestHelper.call({
    //   baseURL,
    //   url: '/turn-off',
    //   method: 'POST',
    //   data: {},
    // });
    const strip = this.strips.find((strip) => strip.id === id);
    if (!strip) {
      throw { status: 404, code: 'stripNotFound' };
    }
    strip.isOn = false;
    return strip;
  }

  async getStripStatus(id: string) {
    // const baseURL = this.getStripURL(id);
    // return await RequestHelper.call({
    //   baseURL,
    //   url: '/strip-status',
    //   method: 'GET',
    // });
    this.stripExists(id);
    return this.strips.find((strip) => strip.id === id);
  }

  async getStripStatusList() {
    // const list = this.stripIdMap.keys();
    // const responseList: any = [];

    // for (const strip of list) {
    //   responseList.push(await this.getStripStatus(strip));
    // }

    // return responseList;
    return this.strips;
  }

  async getRPIStatus(id: string) {
    // const baseURL = this.getRPIURL(id);
    // return await RequestHelper.call({
    //     baseURL,
    //     url: '/pi-status',
    //     method: 'GET'
    // });
    return {
      id: id,
      name: id,
      temperature: 55,
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      freeMemoryPercentage: os.freememPercentage(),
      sysUptime: os.sysUptime(),
      processUptime: os.processUptime(),
      cpuFree: this.cpuFree,
      cpuUsage: this.cpuUsage,
      load: os.loadavg(1),
    };
  }

  async getRPIStatusList() {
    const list = this.rpiIdMap.keys();
    const responseList: any = [];

    for (const rpi of list) {
      responseList.push(this.getRPIStatus(rpi));
    }

    return await Promise.all(responseList);
  }
}
