import {app, BrowserWindow, globalShortcut, TouchBar, dialog, Menu, MenuItem} from "electron"
import * as register from "./commands"
import * as fs from "fs"
import * as process from "process"
import * as path from "path"
import {createTouchBar} from "./shim"

let window = null

const home = process.env.HOME
const GLOWBEAR_ACCELERATOR = "CommandOrControl+Shift+."
const GLOWBEAR_CONFIGDIR = `${home}/.config/glowbear`
const GLOWBEAR_YAML = "glowbear.yaml"

app.setName("Glowbear")

//app.dock.setIcon(path.join(__dirname, "..", "witchlines-bear-toy-silhouette-300px.png"))
//app.dock.setIcon(path.join(__dirname, "..", "bears2-300px.png"))
app.dock.setIcon(path.join(__dirname, "..", "lemmling-Gummy-bear-sort-of-300px.png"))

app.once("ready", () => {
    ensureConfigDir()
    window = new BrowserWindow({
        //backgroundColor: 'rgb(0,0,0,50)',
        frame: false,
        //titleBarStyle: 'hidden-inset',
        //titleBarStyle: 'hidden',
        transparent: true,
        hasShadow: false,
        
        width: 400, height: 600
    })
    window.setVisibleOnAllWorkspaces(true)
    window.loadURL('file://' + __dirname + "/index.html")

     // When window is blurred, don't show it in Exposé
    window.on("blur", () => {
        window.hide()
    })

    // Global shortcut should toggle visibility of Glowy.
    globalShortcut.register(GLOWBEAR_ACCELERATOR, () => {
        if (window.isFocused()) {
            window.blur()
            window.hide()
        } else {
            window.show()
            //window.focus()
        }
    })

    let configFile = path.join(GLOWBEAR_CONFIGDIR, GLOWBEAR_YAML)
    let cmds = register.commands(configFile)
    let menu = Menu.buildFromTemplate(mainMenu)
    let goMenu = new Menu()
    let items = [new TouchBar.TouchBarSpacer({size: "small"}), new TouchBar.TouchBarLabel({label: "glowbear"})]
    cmds.forEach((cmd, i) => {
        // We do two things here: Add a TouchBar button and add a menu item with keyboard shortcut.
        let fn = () => {
            window.blur()
            // Need to app.hide instead of win.hide because the former causes the next application to be
            // focused. This is necessary for mapping commands that attach to the topmost window.
            app.hide()
            try {
                cmd.run()
            } catch (e) {
                dialog.showErrorBox("Script Error", "Error running script:\n"+e.message)
            }
        }
        if (cmd.showButton) {
            items.push(new TouchBar.TouchBarButton({
                label: cmd.name,
                backgroundColor: cmd.color,
                iconPosition: "left",
                click: fn
            }))
        }
        // Add a menu item and accelerator per registered button.
        let hotkey = String(i+1)
        if (cmd.accelerator) {
            hotkey = cmd.accelerator
        }
        let mi = new MenuItem({
            label: cmd.name,
            accelerator: hotkey,
            click: fn
        })
        goMenu.append(mi)
    })
    items.push(new TouchBar.TouchBarSpacer({size: "flexible"}))
    let tb = createTouchBar(items)
    window.setTouchBar(tb)

    goMenu.append(new MenuItem({
        label: "Hide",
        accelerator: "esc",
        click: () => { window.blur(); app.hide() }
    }))
    menu.append(new MenuItem({
        label: "Go",
        submenu: goMenu
    }))
    Menu.setApplicationMenu(menu)
})

app.on("will-quit", () => {
    globalShortcut.unregister(GLOWBEAR_ACCELERATOR)
})

function ensureConfigDir() {
    console.log(GLOWBEAR_CONFIGDIR)
    let dstat = fs.stat(GLOWBEAR_CONFIGDIR, (err) => {
        if (err) {
            fs.mkdirSync(GLOWBEAR_CONFIGDIR, 0o755)      
        }
        let cfg = path.join(GLOWBEAR_CONFIGDIR, GLOWBEAR_YAML)
        fs.stat(cfg, (err) => {
            if (err) {
                fs.writeFile(cfg, "commmands: {}", (err) => {
                    console.log(err)
                    process.exit(1)
                })
            }

        })
    })
    
}

let mainMenu: Electron.MenuItemConstructorOptions[] = [
    {
        label: app.getName(),
        submenu: [
            {role: 'about'},
            {type: 'separator'},
            {role: 'services', submenu: []},
            {type: 'separator'},
            {role: 'hide'},
            {role: 'hideothers'},
            {role: 'unhide'},
            {type: 'separator'},
            {role: 'quit'}
        ]
    }
]