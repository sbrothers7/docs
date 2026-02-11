# Ricing

## Yabai

*A tiling window manager for macOS* (but more like a window resizer because macs are macs)

### System Integrity Protection

To use yabai as a proper WM, SIP needs to be partially disabled.

1. Enter macOS Recovery
    > Intel: hold CMD + R during boot
    >
    > Apple Silicon: hold power button during boot
2. Open Terminal (CMD + SHIFT + T)

    Enter:

    ```zsh
    csrutil enable --without fs --without debug --without nvram
    ```

3. Restart

Visit the [yabai wiki](https://github.com/koekeishiya/yabai/wiki/Disabling-System-Integrity-Protection) for more info.

### Scripting Additions
