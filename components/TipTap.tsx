'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Toolbar } from './ToolBar';
import React, { useEffect } from 'react'
import { EmailInfo } from '@/hooks/useCrewJob';

interface FinalOutputProps {
    draftemail: EmailInfo;
  }
const Tiptap: React.FC<FinalOutputProps> = ({ draftemail }) => {
  const [isEditable, setIsEditable] = React.useState(true)
  const [currentSubject, setCurrentSubject] = React.useState(draftemail.subject); 
  const subjecteditor = useEditor({
    extensions: [
      StarterKit.configure(),
    ],
    content: draftemail.subject,
  })
  const contenteditor = useEditor({
    extensions: [
      StarterKit.configure(),
    ],
    content: draftemail.content,
  })
  useEffect(() => {
    if (subjecteditor && contenteditor) {
        contenteditor.setEditable(isEditable)
        subjecteditor.setEditable(isEditable)
    }
  }, [isEditable, subjecteditor, contenteditor])

  return (
    <>
    <div>
        <input type="checkbox" checked={isEditable} onChange={() => setIsEditable(!isEditable)} />
        Editable
      </div>
    
    
    <h3 className="text-m font-bold mb-2">Subject:</h3>
    <EditorContent className="flex w-full rounded-md border-2  px-2 py-2  " 
    editor={subjecteditor} />
    <h3 className="text-m font-bold mb-2">Content:</h3>
    {isEditable && <Toolbar editor={contenteditor} />}
    <EditorContent                     className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

    editor={contenteditor} />
    </>
  )
}

export default Tiptap