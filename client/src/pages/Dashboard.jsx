import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [editNoteId, setEditNoteId] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      fetchNotes();
    }
  }, [navigate, userInfo]);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      const data = await res.json();
      if (res.ok) {
        setNotes(data);
      } else {
        if (res.status === 401) {
          localStorage.removeItem('userInfo');
          navigate('/login');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const method = editNoteId ? 'PUT' : 'POST';
      const url = editNoteId ? `/api/notes/${editNoteId}` : '/api/notes';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, category }),
      });

      if (res.ok) {
        setTitle('');
        setContent('');
        setCategory('General');
        setEditNoteId(null);
        fetchNotes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        const res = await fetch(`/api/notes/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          fetchNotes();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const editHandler = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setEditNoteId(note._id);
  };

  const cancelEdit = () => {
    setTitle('');
    setContent('');
    setCategory('General');
    setEditNoteId(null);
  };

  const filteredNotes = notes.filter((note) => {
    return (
      (note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase())) &&
      (filter === '' || note.category === filter)
    );
  });

  const categories = [...new Set(notes.map((note) => note.category))];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Profile</h2>
            <p className="text-gray-700">
              <strong>Name:</strong> {userInfo?.name}
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> {userInfo?.email}
            </p>
          </div>

          {/* Create/Edit Note Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">
              {editNoteId ? 'Edit Note' : 'Create Note'}
            </h2>
            <form onSubmit={submitHandler}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Content</label>
                <textarea
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
                >
                  {editNoteId ? 'Update' : 'Create'}
                </button>
                {editNoteId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition duration-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Notes List */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
              <h2 className="text-xl font-bold">My Notes</h2>
              <div className="flex space-x-2 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search notes..."
                  className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredNotes.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No notes found.</p>
            ) : (
              <div className="space-y-4">
                {filteredNotes.map((note) => (
                  <div
                    key={note._id}
                    className="border p-4 rounded hover:shadow-md transition duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{note.title}</h3>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {note.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                      {note.content}
                    </p>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => editHandler(note)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteHandler(note._id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
