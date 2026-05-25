"use client"
import { useState } from 'react'

export default function ContactPage(){
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  async function submit(e:any){
    e.preventDefault()
    setStatus('Sending...')
    setTimeout(()=>setStatus('Message sent (demo)'),700)
  }

  return (
    <main>
      <section className="section section-alt">
        <div className="container">
          <h1 className="section-title">Contact Us</h1>
          <div className="contact-card" style={{marginTop:20}}>
            <form onSubmit={submit}>
              <div style={{marginBottom:18}}>
                <label>Name</label>
                <input
                  className="input-field"
                  value={name}
                  onChange={e=>setName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div style={{marginBottom:18}}>
                <label>Message</label>
                <textarea
                  className="textarea-field"
                  value={message}
                  onChange={e=>setMessage(e.target.value)}
                  rows={6}
                  placeholder="Write your question or request"
                />
              </div>

              <button className="button" type="submit">Send Message</button>
              <p style={{marginTop:14,color:'#475569'}}>{status}</p>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
