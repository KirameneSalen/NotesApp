export interface NoteProps{
    id?: string,
    title: string,
    content: string,
    media?: string,
    date: Date,
    favorite: boolean,
    size?: number
}