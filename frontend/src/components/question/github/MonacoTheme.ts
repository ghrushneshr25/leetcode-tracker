import { loader } from "@monaco-editor/react";

loader.init().then((monaco) => {
    monaco.editor.defineTheme("plain", {
        base: "vs",
        inherit: false,
        semanticHighlighting: false,
        rules: [
            {
                token: "",
                foreground: "000000",
            },
        ],
        colors: {
            "editor.background": "#FFFFFF",
            "editor.foreground": "#000000",
            "editorCursor.foreground": "#000000",
            "editor.selectionBackground": "#DDEBFF",
            "editorLineNumber.foreground": "#999999",
        },
    });
});