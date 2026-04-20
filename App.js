import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);

  // 1. Загрузка данных при старте
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('notes-data')) || [];
    setNotes(saved);
  }, []);

  // 2. Авто-сохранение при изменениях
  useEffect(() => {
    localStorage.setItem('notes-data', JSON.stringify(notes));
  }, [notes]);

  // 3. Логика Добавления / Редактирования
  const handleSave = (e) => {
    e.preventDefault();
    if (!title || !content) return alert("Vyplňte pole!");

    if (editId) {
      setNotes(notes.map(n => n.id === editId ? { ...n, title, content } : n));
      setEditId(null);
    } else {
      setNotes([...notes, { id: Date.now(), title, content }]);
    }
    setTitle(''); setContent('');
  };

  // 4. Логика Удаления
  const deleteNote = (id) => {
    if (window.confirm("Smazat?")) setNotes(notes.filter(n => n.id !== id));
  };

  // 5. Подготовка к редактированию
  const startEdit = (note) => {
    setEditId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  return (
    <div className="container">
      <h1>Poznámkový blok</h1>
      
      <form onSubmit={handleSave} className="note-form">
        <h3>{editId ? 'Upravit' : 'Nová poznámka'}</h3>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Název" />
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Text" />
        <button type="submit" className="btn-save">Uložit</button>
        {editId && <button onClick={() => {setEditId(null); setTitle(''); setContent('');}}>Zrušit</button>}
      </form>

      <div className="note-list">
        {notes.map(n => (
          <div key={n.id} className="note-card">
            <h4>{n.title}</h4>
            <p>{n.content}</p>
            <div className="actions">
              <button onClick={() => startEdit(n)} className="btn-edit">Edit</button>
              <button onClick={() => deleteNote(n.id)} className="btn-delete">Smazat</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}