# Ricing

## Yabai

*A tiling window manager for macOS* (but more like a window resizer because macs are macs)

### Installing Yabai

yabai can be installed using [homebrew](https://brew.sh) from a tap.

``` zsh
brew install asmvik/formulae/yabai
```

If you are [installing from HEAD](https://github.com/asmvik/yabai/wiki/Installing-yabai-(from-HEAD)), you will have to uninstall any release versions before installing. You will also have to create a user-signed certificate for yabai.

### System Integrity Protection

To use yabai as a proper WM, SIP needs to be partially disabled.

1. Enter macOS Recovery

    > Intel: hold CMD + R during boot
    >
    > Apple Silicon: long press power button to boot

2. Open Terminal (CMD + SHIFT + T)

    Enter:

    ```zsh
    csrutil enable --without fs --without debug --without nvram
    ```

3. Restart

Visit the [yabai wiki](https://github.com/koekeishiya/yabai/wiki/Disabling-System-Integrity-Protection) for more info.

### Scripting Additions

For more features, you will need to configure scripting additions.

1. Run

    ``` zsh
    echo "$(whoami) ALL=(root) NOPASSWD: sha256:$(shasum -a 256 $(which yabai) | cut -d " " -f 1) $(which yabai) --load-sa" | sudo tee /private/etc/sudoers.d/yabai
    ```

2. Add the following lines near the top of your yabairc file.

    ``` sh title="yabairc"
    yabai -m signal --add event=dock_did_restart action="sudo yabai --load-sa"
    sudo yabai --load-sa
    ```

[Installing from HEAD](https://github.com/asmvik/yabai/wiki/Installing-yabai-(from-HEAD)) may require slighty different procedures.
