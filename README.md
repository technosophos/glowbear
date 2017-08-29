# GlowBear: The TouchBar Customization Tool for your MacBook Pro

This is a tool for creating custom buttons to go on your MacBook Pro's touch bar
(that glowy bar that hijacked the F-key row). It also supplies hotkey support
so that you can map both a Touch Bar button and a hotkey.

![lemmling-Gummy-bear-sort-of-300px.png]

## Prerequisites

- `node`
- `yarn` or `npm`

## Usage

Edit your `~/.config/glowbear/glowbear.yaml` file to contain the buttons and commands you want to run.

Build it the first time with `npm install && npm build` or `yarn install && yarn build`

Run with `npm start` or `yarn start`.

To raise the app, press `CMD-SHIFT-.`. At that point, the buttons will be visible
on the button bar, and the accelerator keys will be active.

## glowbear.yaml Format

The glowbear.yaml format contains a list of commands, with each command being
represented as a button on the Touch Bar.

```yaml
commands:
- name: "Web"
  color: "#b00707"
  accelerator: "a"
  applescript: |-
    tell application "Vivaldi"
      activate
      set visible of first window whose visible is true to true
    end tell
```

Commands have the following properties:

- `name`: Text to display on the button.
- `color`: A CSS-formatted color for the button.
- `accelerator`: A hotkey (optional).
- `applescript`: The script to execute when the button is clicked or the
  acclerator is executed.

## LICENSE

This project is licensed under the MIT license. See LICENSE.txt for more.

Images in this package are licensed under CC-0 from https://openclipart.org.

## Contributing

Feel free to open pull requests on this project. The main goal of the project
was to make a tool for my own personal use. So I don't actively develop on this
unless I get an idea.
