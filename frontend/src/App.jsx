import { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  const addTodo = async () => {
    if (!text) return;
    const res = await fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const newTodo = await res.json();
    setTodos([...todos, { ...newTodo, completed: false }]);
    setText("");
  };

  const deleteTodo = async (id) => {
    await fetch(`http://localhost:5000/todos/${id}`, { method: "DELETE" });
    setTodos(todos.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const startEdit = (id, currentText) => {
    setEditId(id);
    setEditText(currentText);
  };

  const saveEdit = (id) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, text: editText } : t)));
    setEditId(null);
    setEditText("");
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = todos.length - completedCount;

  return (
    <div style={{
      maxWidth: "550px",
      margin: "50px auto",
      padding: "25px",
      fontFamily: "Arial",
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      borderRadius: "15px",
      color: "white",
      boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
    }}>
      <h1 style={{ textAlign: "center" }}>📝 My To-Do App</h1>

      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px", background: "rgba(255,255,255,0.2)", padding: "10px", borderRadius: "10px" }}>
        <span>📊 Total: {todos.length}</span>
        <span>⏳ Pending: {pendingCount}</span>
        <span>✅ Done: {completedCount}</span>
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none", fontSize: "16px" }}
        />
        <button
          onClick={addTodo}
          style={{ padding: "12px 25px", background: "#4CAF50", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}
        >
          ➕ Add
        </button>
      </div>

      {/* Todo List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.length === 0 && <p style={{ textAlign: "center" }}>🎉 No tasks yet! Add one above.</p>}
        
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "white",
              color: "black",
              padding: "12px",
              margin: "8px 0",
              borderRadius: "8px"
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed || false}
              onChange={() => toggleComplete(todo.id)}
              style={{ width: "20px", height: "20px", cursor: "pointer" }}
            />

            {editId === todo.id ? (
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                style={{ flex: 1, padding: "5px" }}
              />
            ) : (
              <span style={{
                flex: 1,
                textDecoration: todo.completed ? "line-through" : "none",
                opacity: todo.completed ? 0.5 : 1
              }}>
                {todo.text}
              </span>
            )}

            {editId === todo.id ? (
              <button onClick={() => saveEdit(todo.id)} style={{ background: "green", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}>💾</button>
            ) : (
              <button onClick={() => startEdit(todo.id, todo.text)} style={{ background: "orange", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}>✏️</button>
            )}

            <button
              onClick={() => deleteTodo(todo.id)}
              style={{ background: "red", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;