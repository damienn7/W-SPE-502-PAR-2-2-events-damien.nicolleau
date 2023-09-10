import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export const Organize = () => {
    const { id } = useParams();
    const [event, setEvent] = useState({});
    const [users, setUsers] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [modal, setModal] = useState(false);

    useEffect(() => {
        fetch('http://localhost:4000/users')
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setUsers(data);
            });
    }, []);

    //update participant in db
    useEffect(() => {
        fetch(`http://localhost:4000/events/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                participants: participants
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
               
            });
    }, [participants]);
       



    // recuperer l'evenement
    useEffect(() => {
        fetch(`http://localhost:4000/events/${id}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setEvent(data);
                // setParticipants(data.participants);
                console.log(data.participants)
            });
    }, [id]);

    const openModal = () => { 
        setModal(true);
    }



    // const ConfirmParticipant = () => {
    //     fetch(`http://localhost:4000/events/${id}`, {
    //         method: 'PUT',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({
    //             participants: participants
    //         }),
    //     })
    //         .then((response) => response.json())    
    //         .then((data) => {
    //             console.log(data);
    //             setModal(false);
    //         });
    // }     

    return (
        <>
            {modal && (
                <div className="modal">
                    <div className="modal-content">
                        {users.map((user) => {
                            return (
                                <div className="user" onClick={() => setParticipants([...participants, user])}>
                                    <div>{user.username}</div>
                                    <div>{user.email}</div>
                                </div>
                            )
                        })}
                        <button onClick={()=>setModal(false)}>Close</button>
                    </div>
                </div> )}
                        
            <nav className="nav">
                <div>Logo</div>
                <div>Conect</div>
            </nav>
            <div className="organize-template">
                <div className="event-info">
                    <h1>{event.title}</h1>
                    <p>{event.location}</p>
                </div>
                <div className="map">
                    {/* Your map component goes here */}
                    <p>Map Component</p>
                </div>
                <div className="participants">
                    <button onClick={openModal}>Add</button>
                    {/* Your participants component goes here */}
                    <div>l'organisateur</div>
                    {
                        participants.map((participant) => {
                            <div>omg</div>
                        })
                    }
                </div>
                <div className="chat">
                    {/* Your chat component goes here */}
                    <p>Chat Component</p>
                    <p>Soon...</p>
                </div>
            </div>
        </>
    )
}
