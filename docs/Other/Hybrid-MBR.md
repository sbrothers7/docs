# Hybrid MBR

## Why?

If you're like me and you only have 1 SSD formatted with GPT and you want to install a legacy operating system on your computer for experimental purposes, you may want to consider Hybrid MBR ~~or just buy a new SSD if you're rich~~.

Refer to the [gparted docs](https://www.rodsbooks.com/gdisk/hybrid.html) for more info.

## My Experience

Hybrid MBR is very clunky and can cause many problems, so it should be avoided in general, as stated by the documentation.

My experience on a Windows-Linux dual-booted PC is as follows:

- The partition scheme was:
  - Windows
  - Hybrid MBR
  - Linux
- GRUB did work, but the Windows Bootloader broke
- The Hypbrid MBR partition was recognizable in Linux and by Install Media of Windows XP through QEMU using physical disk passthrough.
  
The Windows Bootloader breaking isn't quite the surprise, as I did not hybridze all Windows partitions like the documentation suggested. Anyhow, I've stopped using Windows since then, and moved my Linux partition to the left and grew it.

I am planning on experimenting with it to run legacy Operating Systems on my very modern PC—unfortunately, by using BIOS emulation as it is a [UEFI class 3](https://wiki.osdev.org/UEFI#UEFI_class_0-3_and_CSM) machine.
