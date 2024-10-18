import { Service } from '@tsed/common';
import { exec } from 'child_process';
import path from 'path';

const somfyPath = path.join('home', 'pi', 'Pi-Somfy');

export interface Shutter {
  address: string;
  id: string;
  name: string;
}

@Service()
export class SomfyService {
  private shutters: Shutter[] = [
    { id: 'living-room', address: '0x279621', name: 'Living room' },
    { id: 'bedroom', address: '0x279622', name: 'Bedroom' },
  ];

  private getShutter(id: string): Shutter {
    const shutter = this.shutters.find((s) => s.id === id);
    if (!shutter) {
      throw { status: 404, code: 'shutterNotFound' };
    }

    return shutter;
  }

  private async execute(id: string, command: string): Promise<void> {
    const shutter = this.getShutter(id);
    const cmd = `sudo /${somfyPath}/operateShutters.py "${shutter.name}" -c /${somfyPath}/defaultConfig.conf ${command}`;
    console.log(cmd);

    await new Promise((resolve) => {
      const r = exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
        resolve({});
      });
    });
  }

  async moveUp(id: string): Promise<void> {
    //await this.execute(id, '-up');
  }

  async moveDown(id: string): Promise<void> {
    //await this.execute(id, '-down');
  }

  async stop(id: string): Promise<void> {
    //await this.execute(id, '-stop');
  }

  getShutters(): Shutter[] {
    return this.shutters;
  }
}
