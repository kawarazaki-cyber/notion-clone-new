import SideBar from './components/SideBar';
import SearchModal from './components/SearchModal';
import './styles/layout.css';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { currentUserAtom } from './modules/auth/curent-user.state';
import { useEffect, useState } from 'react';
import { noteRepository } from './modules/notes/note.repository';
import { useNoteStore } from './modules/notes/notes.state';
import { Note } from './modules/notes/note.entity';

export default function Layout() {
  const currentUser = useAtomValue(currentUserAtom);
  const [isLoading,setisLoading] = useState(false);
  const noteStore = useNoteStore();
  const [isShowmodal,setIsShowModal] = useState(false);
  const [searchResult, setSearchResult] = useState<Note[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  },[])

  const fetchNotes = async () =>{
    setisLoading(true);
    const notes = await noteRepository.find();
    noteStore.set(notes);
    setisLoading(false);
  }

  const searchNotes = async (keyword: string) =>{
    const notes = await noteRepository.find({ keyword });
    noteStore.set(notes);
    setSearchResult(notes ?? []);
  };

  const moveToDetail = (noteId:number) =>{
    navigate(`/notes/${noteId}`);
    setIsShowModal(false);
  };

  if(!currentUser) return <Navigate to="/signin" replace />
  
  return (
    <div className='layout-container'>
      {!isLoading && <SideBar onSearchButtonClick={()=>setIsShowModal(true)}/> }
      <main className='layout-main'>
        <Outlet />
      </main>
      <SearchModal 
        isOpen={isShowmodal} 
        onClose={() => setIsShowModal(false)} 
        notes={searchResult} 
        onKeywordChange={searchNotes}
        onItemSelect={moveToDetail}
      />
    </div>
  );
}
