import { Service, OnReady } from '@tsed/common';
//import * as mqtt from 'async-mqtt';

export enum Topics {
    Status = 'ewpe-smart/f4911e647802/status',
    Set = 'ewpe-smart/f4911e647802/set',
    Get = 'ewpe-smart/f4911e647802/get'
}

const modeMap = [
    3, 4, 1
];

@Service()
export class AirConditionService implements OnReady {
    //private client: mqtt.AsyncMqttClient;
    private temperature: number = 25;
    private mode: number = 1;
    private state: boolean = false;
    //private currentSettings: {
    //    ts: number;
    //    data: any;
    //} = {
    //    ts: 0,
    //    data: {}
    //}

    async $onReady(): Promise<void> {
        //this.client = await mqtt.connect('mqtt://192.168.0.15');
        //this.client = await mqtt.connect('mqtt://127.0.0.1');
        //await this.client.subscribe(Topics.Status);
        //this.client.on('message', this.messageHandler.bind(this));
        //await this.getStatus();
    }

    //async messageHandler(topic: string, message: Buffer, packet: mqtt.IPublishPacket): Promise<void> {
    //    if (topic === Topics.Status) {
    //        const data = JSON.parse(packet.payload.toString());
    //        this.currentSettings.ts = Date.now();
    //        this.currentSettings.data = {
    //            ...this.currentSettings.data,
    //            ...data
    //        }
    //        this.temperature = this.currentSettings.data.SetTem;
    //        this.mode = modeMap.indexOf(this.currentSettings.data.Mod);
    //        this.state = this.currentSettings.data.Pow;
    //    }
    //}

    async turnOn(): Promise<void> {
        this.state = true;
        //await this.client.publish(Topics.Set, `{"Pow": 1, "SetTem": ${this.temperature}}`);
    }

    async turnOff(): Promise<void> {
        this.state = false;
        //await this.client.publish(Topics.Set, '{"Pow": 0}');
    }

    async getState(): Promise<{ state: boolean }> {
        return { state: this.state };
    }

    getTemperature(): { temperature: number } {
        return { temperature: this.temperature };
    }

    async setTemperature(temp: number): Promise<void> {
        const newtemperature = Math.round(temp);
        if (newtemperature === this.temperature) {
            return;
        }
        this.temperature = newtemperature;
        if (this.temperature < 16) { this.temperature = 16 }
        if (this.temperature > 30) { this.temperature = 30 }
        //await this.client.publish(Topics.Set, `{"Pow": 1, "SetTem": ${this.temperature}}`);
    }

    getMode(): { mode: number } {
        return { mode: this.mode };
    }

    async setMode(mode: number): Promise<void> {
        const newMode = Math.max(Math.min(Math.round(mode), 2), 0);
        if (newMode === this.mode) {
            throw { status: 400, code: 'alreadyInTargetMode'};
        }
        this.mode = newMode;
        this.state = true;
        //await this.client.publish(Topics.Set, `{"Pow": 1, "Mod": ${modeMap[this.mode]}}`);
    }

    async getStatus(): Promise<any> {
        //const ts = Date.now();
        //await this.client.publish(Topics.Get, '');
        //await this.waitForUpdate(ts);
        //return this.currentSettings.data;
        return {};
    }

    //async waitForUpdate(ts: number): Promise<void> {
    //    for (let i = 0; i < 500; i++) {
    //        if (this.currentSettings.ts >= ts) {
    //            return;
    //        }
//
    //        await this.wait();
    //    }
    //}

    //async wait(delay: number = 20): Promise<void> {
    //    await new Promise((resolve) => {
    //        setTimeout(resolve, delay);
    //    });
    //}
}
