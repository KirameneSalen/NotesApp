import { useState } from 'react';
import { getLogger } from '../core';
import { NoteProps } from './NoteProps'

const log = getLogger('ItemList')

export interface NotesProps {
    items: NoteProps[],
    addItem: () => void,
}

export const useNotes: () => NotesProps = () => {
    const [items, setItems] = useState([
        {id: '1', title: "first try", content: "hi"},
        {id: '2', title: "it works", content: "yo"}
    ])
    const addItem = () => {
        const id = `${items.length + 1}`;
        log('ItemList addItem');
        setItems(items.concat({id, title: `Title ${id}`, content: `Content ${id}`}))
    }
    log('returns')
    return {
        items,
        addItem
    }
}
