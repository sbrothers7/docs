# UTM Guides

## Windows 10 & 11

Follow the guide on UTM's [support page](https://docs.getutm.app/guides/windows/)

*Edit > System > Force Multicore* for better performance

Make sure to debloat using Chris Titus' [winutil](https://github.com/ChrisTitusTech/winutil) or [Talon](https://github.com/ravendevteam/talon)

## Windows 7

## Windows XP

1. *Create a New Virtual Machine > Emulate > Windows*:
    - Check *Expert Mode*, then:
    > - Architecture: x86_64
    > - System: newest version of *Standard PC (i440FX + PIIX 1996) (alias of pc-i1440fx-x.x) (pc)*
    > - Memory: 4096 MiB
    > - CPU Cores: 2
    > - Check Legacy Hardware
    - Click *Continue*
2. Download ISO:

    > 32-bit: [Download](https://archive.org/details/WinXPProSP3x86),
    > Product Key: MRX3F-47B9T-2487J-KWKMF-RPWBY
    >
    > 64-bit: [Download](https://archive.org/details/en_win_xp_pro_x64_with_sp2),
    > Product Key: B2RBK-7KPT9-4JP6X-QQFWM-PJD6G

    - Check *CD/DVD Image*
    - Browse and select downloaded ISO file

3. After setting desired storage size, click *Continue* until setup finishes
4. Right click on the virtual machine on the sidebar then *Edit*
5. Under *System*,

    > - CPU: Intel(R) Core(TM)2 Duo CPU T7700 @2.40GHz (core2duo-v1)

6. Under *Arguments* under *QEMU*,

    > - Click *New*
    > - Type `-boot menu=on`
    > - Press enter

7. Under *Network*,

    > - Network Mode: Emulated VLAN
    > - Emulated Network Card: rtl8139

8. Under *Sound*,

    > - Emulated Audio Card: Intel 82801AA AC97 (Audio AC97)

9. Press *Save*
10. Run the VM
11. Go through the installation process

## Windows ME

## Windows 2000

## Windows 9x

### Windows 95

### Windows 98

## Windows 3

## Windows 2

## Windows 1

## MSDOS
