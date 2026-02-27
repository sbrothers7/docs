# Installing Windows

## Dual-booting Windows w/ Bootcamp

On Intel macs, you can use `Bootcamp Assistant` to easily dual boot windows. Depending on the macOS version, bootcamp will offer different Windows versions. Bootcamp automatically installs needed drivers for Windows.

Consult the [apple documentation for bootcamp](https://support.apple.com/kb/index?page=search&src=support_docs_serp&locale=en_US&doctype=DOCUMENTATIONS&q=bootcamp) version information and downloads.

!!! Note
    You cannot rollback macOS to a version that existed before your machine, so you cannot install a version of Windows supported by Bootcamp in a previous version of macOS that came installed with your machine.

    For example, running Windows 7, or XP will not be possible with an 2019 Macbook Pro since the earliest version rollback would be macOS Catalina which only supports Windows 10. You would have to figure out a way to reverse-engineer AND backport drivers for Windows 7 and XP.
