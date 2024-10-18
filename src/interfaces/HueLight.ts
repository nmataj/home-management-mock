export interface HueLight {
    state: HueLightState;
    swupdate: {
        state: string;
        lastinstall: string;
    },
    type: string;
    name: string;
    modelid: string;
    manufacturername: string;
    productname: string;
    capabilities: {
        certified: boolean;
        control: {
            colorgamuttype: string;
            ct: any;
        },
        streaming: {
            renderer: boolean;
            proxy: boolean;
        }
    },
    config: {
        archetype: string;
        function: string;
        direction: string;
    },
    uniqueid: string;
    swversion: string;
}

export interface HueLightState {
    on?: boolean;
    bri?: number;
    hue?: number;
    sat?: number;
    effect?: string;
    xy?: number[];
    ct?: number;
    alert?: string;
    colormode?: string;
    mode?: string;
    reachable?: boolean;
}