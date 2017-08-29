import { TouchBar } from "electron"
import * as path from "path"
import * as YAML from "yamljs"
import * as applescript from "applescript"
import {currentDisplay} from "./applescript_screen"



export function commands(configFile: string): Command[] {
    const cmds = []

    // Load the main YAML file.
    let cfg = YAML.load(configFile)
        console.log(JSON.stringify(cfg))
        cfg.commands.forEach((o, i) => {
            console.log(`Adding command ${o.name}`)
            // This assumes the script has been inlined.
            // TODO: We need a way for the config file to point to other applescripts in 'dir'
            // or elsewhere on the filesyste.
            let s = o.applescript
            let cmd = new Command(o.name, s)
            cmd.color = o.color
            if(o.accelerator) {
                cmd.accelerator = o.accelerator
            }
            if(o.showButton === false) {
                cmd.showButton = o.showButton
            }
            cmds.push(cmd)
        })
    
    
    return cmds
}

export class Command {
    name: string
    script: string
    color?: string
    accelerator?: string
    showButton?: boolean

    constructor(name: string, script: string) {
        this.name = name
        this.script = script
        // For legacy, default to true.
        this.showButton = true
    }

    public run() {
        let curScreen = currentDisplay()
        console.log(curScreen)
        let script = curScreen + "\n" + this.script
        applescript.execString(script, (err, ret) => {
            if (err) {
                throw err
            }
            console.log(ret)
        })
    }
}