import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'
import { db, isFirebaseConfigured, normalizeDate } from '../lib/firebase.js'
import { useAuth } from '../context/auth-context.js'
import { Send } from 'lucide-react'
import './Chat.css'

export function Chat() {
  const { user, isAuthenticated } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'desc'),
      limit(100)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = []
      snapshot.forEach((doc) => {
        fetchedMessages.push({ id: doc.id, ...doc.data() })
      })
      // Reverse so oldest is top, newest is bottom
      setMessages(fetchedMessages.reverse())
      setLoading(false)
      setTimeout(scrollToBottom, 100)
    }, (error) => {
      console.error("Error fetching messages: ", error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Auto scroll when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !isAuthenticated || !db) return

    const messageText = newMessage.trim()
    setNewMessage('') // Optimistic clear

    try {
      await addDoc(collection(db, 'messages'), {
        text: messageText,
        userId: user.id,
        userName: user.name || 'Anonymous Citizen',
        createdAt: serverTimestamp()
      })
    } catch (error) {
      console.error("Error sending message: ", error)
      setNewMessage(messageText) // Revert on failure
      alert("Failed to send message.")
    }
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(normalizeDate(timestamp))
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1 className="condensed" style={{ margin: 0, fontSize: '1.5rem' }}>COCKROACH JANTA LIVE CHAT</h1>
        <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>Discuss strategy, share updates, or just vent.</p>
      </div>

      <div className="chat-messages">
        {loading ? (
          <div style={{ textAlign: 'center', opacity: 0.7, padding: '2rem' }}>Loading messages...</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', opacity: 0.7, padding: '2rem' }}>No messages yet. Be the first to speak!</div>
        ) : (
          messages.map((msg) => {
            const isMine = isAuthenticated && msg.userId === user?.id
            return (
              <div key={msg.id} className={`message-bubble ${isMine ? 'mine' : 'others'}`}>
                {!isMine && <div className="message-author condensed">{msg.userName}</div>}
                <div className="message-text">{msg.text}</div>
                <div className="message-time">{formatTime(msg.createdAt)}</div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSendMessage} className="chat-input-area">
          <input
            type="text"
            className="chat-input"
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            maxLength={500}
          />
          <button type="submit" className="chat-send-btn condensed" disabled={!newMessage.trim()}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              SEND <Send size={16} />
            </span>
          </button>
        </form>
      ) : (
        <div className="chat-login-prompt">
          <p style={{ margin: '0 0 1rem 0' }}>You must be logged in to participate in the chat.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/login" className="btn-join condensed bg-ink text-paper" style={{ textDecoration: 'none' }}>LOG IN</Link>
            <Link to="/join" className="btn-join condensed text-ink border-ink" style={{ backgroundColor: 'transparent', textDecoration: 'none' }}>JOIN THE PARTY</Link>
          </div>
        </div>
      )}
    </div>
  )
}
