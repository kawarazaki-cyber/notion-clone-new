import { useParams } from 'react-router-dom';
import TitleInput from '../components/TitleInput';
import '../styles/pages/note-detail.css';
import { useEffect, useState } from 'react';
import { useNoteStore } from '../modules/notes/notes.state';
import { noteRepository } from '../modules/notes/note.repository';
import { Editor } from '../components/Editor';
import { useDebouncedCallback } from 'use-debounce';

export default function NoteDetail() {
  const params = useParams();
  const id = parseInt(params.id!);
  const [isLoading,setIsLoading]= useState(false);
  const noteStore = useNoteStore();
  const note = noteStore.getOne(id);

  useEffect(()=>{
    fetchOne();
  },[id]);

  const fetchOne = async()=>{
    setIsLoading(true);
    const note= await noteRepository.findOne(id);
    noteStore.set([note]);
    setIsLoading(false);
  }

  const updateNote = async(
    id:number,
    note:{title?:string;content?:string},
  )=>{
    const updateNote = await noteRepository.update(id,note);
    noteStore.set([updateNote]);
    return updateNote;
  };

  const debouned = useDebouncedCallback(updateNote,500);

  if(isLoading)return <div />
  if(!note) return <div>note is not existed</div>

  return (
    <div className="note-detail-container">
      <div className="note-detail-content">
        <TitleInput 
          initialData={note}
          onTitleChange={(title) =>debouned(id,{ title })}
        />
        <Editor 
          initiaContent={note.content} 
          onChange={(content)=> debouned(id,{content})}
        />
      </div>
    </div>
  );
}
