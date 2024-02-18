import { Link, json, useLoaderData } from '@remix-run/react';
import styles from '../styles/note-details.css';
import { LoaderFunctionArgs } from 'react-router-dom';
import { getStoredNotes } from '~/data/notes';
import { MetaFunction } from '@remix-run/node';

const NoteDetail = () => {
  const data = useLoaderData<typeof loader>();
  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes">Back to all notes</Link>
        </nav>
        <h1>{data.title}</h1>
      </header>
      <p id="note-datails-content">{data.content}</p>
    </main>
  );
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data?.title,
    },
    {
      name: 'description',
      content: 'Manage your data with ease.',
    },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const note = (await getStoredNotes()).find(
    (note) => note.id === params.noteid
  );
  if (!note) {
    throw json({ message: 'Note not found' }, { status: 404 });
  }
  return note;
}

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}
export default NoteDetail;
