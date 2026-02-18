import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Edit2, Check } from 'lucide-react'

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return []
      }
    }
    return []
  })
  const [inputValue, setInputValue] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const editInputRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [editingId])

  const addTodo = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const newTodo = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false
    }

    setTodos([newTodo, ...todos])
    setInputValue('')
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const startEditing = (todo) => {
    setEditingId(todo.id)
    setEditValue(todo.text)
  }

  const saveEdit = () => {
    if (!editValue.trim()) return

    setTodos(todos.map(todo =>
      todo.id === editingId ? { ...todo, text: editValue.trim() } : todo
    ))
    setEditingId(null)
    setEditValue('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  return (
    <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center tracking-tight">Tasks</h1>

      <form className="flex gap-2 mb-6" onSubmit={addTodo}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <button type="submit" className="bg-blue-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-600 active:scale-95 transition-all cursor-pointer flex items-center justify-center">
          <Plus size={20} />
          <span className="ml-2 hidden sm:inline">Add</span>
        </button>
      </form>

      {todos.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          <p>No tasks yet. Add one above!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {todos.map(todo => (
            <li key={todo.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg group hover:bg-white hover:shadow-sm hover:border-gray-200 transition-all duration-200">
              {editingId === todo.id ? (
                <input
                  ref={editInputRef}
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={saveEdit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit()
                    if (e.key === 'Escape') cancelEdit()
                  }}
                  className="flex-1 border border-blue-300 rounded px-2 py-1 mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <>
                  <div className="flex items-center gap-3 flex-1 cursor-pointer select-none" onClick={() => toggleTodo(todo.id)}>
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${todo.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-300 hover:border-blue-400'}`}>
                      {todo.completed && <Check size={14} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className={`text-base transition-colors ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {todo.text}
                    </span>
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      className="p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 rounded-md transition-colors cursor-pointer"
                      onClick={() => startEditing(todo)}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors cursor-pointer"
                      onClick={() => deleteTodo(todo.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
