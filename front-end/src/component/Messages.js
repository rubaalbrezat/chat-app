import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Message from './Message';



export default function Messages() {
	const [messages, setMessages] = useState([]);

	const fetchData = () => {
		axios.get('http://localhost:3000/getMessage').then(res => {
			setMessages(res.data)
		}).catch(err => console.log(err))

	}

	useEffect(() => {
		fetchData();
	}, [])

	return (
		<div>
			{messages && messages.map(message => (
				<div key={message._id}>
					<Message message={message} />
				</div>
			))}
		</div>
	)
}
