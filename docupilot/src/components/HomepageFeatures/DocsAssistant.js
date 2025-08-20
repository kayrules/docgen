// import React, { useState } from 'react';
// import styles from './DocsAssistant.module.css';

// export default function DocsAssistant() {
//   const [open, setOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = { role: 'user', content: input };
//     setMessages(prev => [...prev, userMessage]);
//     setInput('');

//     try {
//       const res = await fetch('http://localhost:3001/api/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ message: input }),
//       });
//       const data = await res.json();
//       setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
//     } catch (err) {
//       setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Error fetching reply.' }]);
//     }
//   };

//   return (
//     <>
//       <button className={styles.fab} onClick={() => setOpen(!open)}>
//         ♦️ Docs Assistant
//       </button>

//       {open && (
//         <div className={styles.chatbox}>
//           <div className={styles.chatHeader}>♦️ Docs Assistant</div>
//           <div className={styles.chatMessages}>
//             {messages.map((msg, idx) => (
//               <div
//                 key={idx}
//                 className={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}
//               >
//                 {msg.content}
//               </div>
//             ))}
//           </div>
//           <div className={styles.chatInput}>
//             <input
//               type="text"
//               placeholder="Ask about the docs..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//             />
//             <button onClick={sendMessage}>Send</button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
