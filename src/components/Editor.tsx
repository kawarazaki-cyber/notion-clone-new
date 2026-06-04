import { ja } from "@blocknote/core/locales";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";

interface Props{
    onChange:(value:string) => void;
    initiaContent?: string|null;
}
export function Editor({onChange,initiaContent}:Props){
    const editor = useCreateBlockNote({
        dictionary:ja,
        initialContent:initiaContent ? JSON.parse(initiaContent):undefined});
    return(
    <div>
        <BlockNoteView 
        editor={editor}
        onChange={() => onChange(JSON.stringify(editor.document))}/>
    </div>
    );
}