import { useState, useRef, useEffect } from 'react'
import './App.css'
import { io } from "socket.io-client";

function App() {
  const [Socket, setSocket] = useState(null)


  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    let socketInstence = io("http://localhost:3000");
    setSocket(socketInstence)
    socketInstence.on("ai-response",(response)=>{
 setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: `"${response}"`,
        timestamp: new Date().toLocaleTimeString(),
        sender: 'bot'
      }
      setMessages((prev) => [...prev, botMessage])
    }, 600)
    })
    
  }, [])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (inputMessage.trim() === '') return

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString(),
      sender: 'user'
    }

    setMessages((prev) => [...prev, userMessage])
    Socket.emit("ai-message", inputMessage)
    setInputMessage('')

    // Simulate bot reply
   
  }

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSendMessage(e)
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat App</h1>
      </div>
      
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'message-user' : 'message-bot'}`}
          >
            <div className="message-content">{message.text}</div>
            <div className="message-timestamp">{message.timestamp}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
          onKeyDown={handleInputKeyDown}
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  )
}

export default App