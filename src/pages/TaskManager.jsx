import { useState, useEffect } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import { Plus, Calendar, Briefcase, Home, User } from "lucide-react"

const TaskManager = () => {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState("")
  const [category, setCategory] = useState("Personal")
  const [time, setTime] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Personal")

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/user`,{withCredentials:true})
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error))
  }, [])

  const addTask = () => {
    if (!newTask.trim()) return

    const taskTime = new Date(time)

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/tasks`, {
        title: newTask,
        completed: false,
        category,
        time: taskTime,
      },{withCredentials:true})
      .then((response) => setTasks([...tasks, response.data]))
      .catch((error) => console.error("Error adding task:", error))
    setNewTask("")
    setTime("")
  }

  const toggleTask = (taskId, completed) => {
    const originalTasks = tasks
    setTasks(tasks.map((task) => (task._id === taskId ? { ...task, completed } : task)))

    axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${taskId}`, { completed }).catch((error) => {
      console.error("Error updating task:", error)
      setTasks(originalTasks)
    })
  }

  const filteredTasks = tasks.filter((task) => task.category === selectedCategory)

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Personal":
        return <User className="w-4 h-4" />
      case "Freelance":
        return <Briefcase className="w-4 h-4" />
      case "Work":
        return <Home className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 p-4 md:p-6">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-lg mb-4 md:mb-0">
        <h2 className="text-2xl font-bold mb-6 text-black">Do-it</h2>
        <nav>
          {["Personal", "Freelance", "Work"].map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center space-x-2 w-full p-2 rounded-md mb-2 transition-colors ${
                selectedCategory === cat
                  ? "bg-white bg-opacity-20 text-black"
                  : "text-black text-opacity-60 hover:bg-white hover:bg-opacity-10"
              }`}
            >
              {getCategoryIcon(cat)}
              <span>{cat}</span>
            </motion.button>
          ))}
        </nav>
      </aside>

      {/* Main Section */}
      <main className="flex-1 md:ml-6 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-black">Today's Focus</h2>

        {/* Task Input */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="task" className="block text-sm font-medium text-gray-700 mb-1">
                New Task
              </label>
              <input
                id="task"
                type="text"
                placeholder="What's your next task?"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                id="time"
                type="datetime-local"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Personal">Personal</option>
                <option value="Freelance">Freelance</option>
                <option value="Work">Work</option>
              </select>
            </div>
            <button
              onClick={addTask}
              className="w-full bg-purple-600 text-black py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <Plus className="inline-block mr-2 h-4 w-4" /> Add Task
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => toggleTask(task._id, e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <div>
                    <p className={`font-medium ${task.completed ? "line-through text-gray-400" : ""}`}>{task.title}</p>
                    <p className="text-sm text-gray-500">
                      <Calendar className="inline-block w-4 h-4 mr-1" />
                      {formatTime(task.time)}
                    </p>
                  </div>
                </div>
                {getCategoryIcon(task.category)}
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default TaskManager

