import NewNote, { links as newNoteLinks } from '../components/NewNotes';

import {
  redirect,
  type ActionFunctionArgs,
  json,
  MetaFunction,
} from '@remix-run/node';
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import NoteList, { links as NoteListLinks } from '~/components/NoteList';
import { Note, getStoredNotes, storeNotes } from '~/data/notes';

export type ActionResponse = {
  message: string;
};

export default function NotesPage() {
  const notes = useLoaderData<Note[]>();
  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: 'All Notes' },
    {
      name: 'description',
      content: 'Manage your notes with ease.',
    },
  ];
};

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <main>
        <NewNote />
        <p className="info-message">{error.data.message}</p>
      </main>
    );
  }
  return (
    <main className="error">
      <h1>An error related to your notes occurred!</h1>
      <p>
        {
          (error &&
            typeof error === 'object' &&
            'message' in error &&
            error.message) as string
        }
      </p>
      <p>
        Back to <Link to="/">safety</Link>
      </p>
    </main>
  );
}

export async function loader() {
  const notes = await getStoredNotes();
  if (!notes || notes.length === 0) {
    throw json(
      { message: 'Could not find any notes.' },
      {
        status: 404,
        statusText: 'Not Found',
      }
    );
  }
  return notes;
}

export async function action({ request }: ActionFunctionArgs) {
  await new Promise((r) => setTimeout(r, 2000));
  const formData = await request.formData();

  const noteData: Partial<Note> = Object.fromEntries(formData);
  noteData.id = new Date().toISOString();

  if (noteData.title && noteData.title.trim().length < 5) {
    return { message: 'Invalid title - must be atleast 5 characters long.' };
  }

  const existingNotes = await getStoredNotes();
  const updatedNotes = existingNotes.concat(noteData as Note);
  await storeNotes(updatedNotes);
  return redirect('/notes');
}

export function links() {
  return [...newNoteLinks(), ...NoteListLinks()];
}
