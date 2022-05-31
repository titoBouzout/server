#NoEnv
SendMode Input
SetWorkingDir %A_ScriptDir%

GetActiveExplorerPath() {
    explorerHwnd := WinActive("ahk_class CabinetWClass")
    if (explorerHwnd) {
        for window in ComObjCreate("Shell.Application").Windows {
            if (window.hwnd==explorerHwnd) {
                return window.Document.Folder.Self.Path
            }
        }
    }
}

~F12::
    Path:= GetActiveExplorerPath()
    if (Path!="") {
        Run, server "%Path%",, Hide
    }

return