import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'


//FIXME: REVOIR La Logique 

// prendre en compte si c'est l'user connected est l'organisateur ou non 
// si oui il peut modifier les infos de l'event
// si non il peut juste voir les infos de l'event et rejoindre


export const Organize = () => {
    const { id } = useParams();
    const [event, setEvent] = useState({});
    const [users, setUsers] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [modal, setModal] = useState(false);
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const [organisateur, setOrganisateur] = useState({});//FIXME: get the organizer of the event

    const [isOrganizator, setIsOrganizator] = useState(false);
    const [hasJoined, setHasJoined] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('user')) {
            navigate('/');
        } else {
            setUser(JSON.parse(localStorage.getItem('user')));
        }
    }, []);

    useEffect(() => {
        console.log("crrrrr", user.id, event.user_id)
        if (user.id == event.user_id) {
            setIsOrganizator(true);
            console.log("hmmmm 1")
        } else {
            setIsOrganizator(false);
            console.log("hmmmm 2")
        }
    }, [event, user])

    useEffect(() => {

        console.log("je suis l'organisateur", user.id, event.user_id)
        fetch('http://localhost:4000/users')
            .then((response) => response.json())
            .then((data) => {
                console.log("userrrrrs", data);
                setUsers(data);
            });


    }, []);

    //update participant in db
    useEffect(() => {
        if (!isOrganizator) {
            let arrwithme = participants.filter((participant) => participant.id === user.id);
            if (arrwithme.length > 0) {
                setHasJoined(true);
            } else {
                setHasJoined(false);
            }
        }

        console.log("participants", participants[0]?.pseudo)
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
                console.log("hmmm", data);
                setEvent(data);
                setParticipants(JSON.parse(data.participants) || []);
                console.log("hmmmm", data.participants)
                if (data.user_id == user.id) {
                    setOrganisateur(user);
                } else {
                    fetch(`http://localhost:4000/users/${data.user_id}`)
                        .then((response) => response.json())
                        .then((data) => {
                            console.log(data);
                            setOrganisateur(data.user);
                        });
                }
            });
    }, [id]);

    const openModal = () => {
        setModal(true);
    }

    //TODO: CODE: delete participant from db
    const deleteParticipant = (id) => {
        console.log("id", id)
        let new_participants = participants.filter((participant) => participant.id !== id);
        fetch(`http://localhost:4000/events/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                participants: new_participants
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setParticipants(new_participants);
            });

    }

    const joinEvent = () => {
        setParticipants([...participants, user]);
    }

    const leaveEvent = () => {
        setParticipants(participants.filter((participant) => participant.id !== user.id));
    }

    const deleteEvent = () => {
        fetch(`http://localhost:4000/events/${id}`, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                navigate("/");
            });
    }

    return (
        <>
            {modal && (
                <div className="modal">
                    <div className="modal-content">
                        {users.map((user) => {
                            if (user.id === organisateur.id) return null;
                            else if (participants.find((participant) => participant.id === user.id)) return null;
                            else {
                                return (
                                    <div className="user" onClick={() => {
                                        console.log("pp", participants)
                                        setParticipants([...participants, user])
                                    }
                                    }>
                                        <p>{user.username}</p>
                                        <p>{user.email}</p>
                                    </div>
                                )
                            }


                        })}
                        <button id="close-modal" onClick={() => setModal(false)}><span className='bar1'>|</span><span className='bar2'>|</span></button>
                    </div>
                </div>)}
            <nav className="nav">
                <img src="https://leboncoincorporate.com/wp-content/uploads/2022/05/141_Vous-etes-selectionnee_-bienvenue-chez-leboncoin-Groupe_vec-01.svg" onClick={() => navigate('/')} alt="logo" style={{ width: "10rem", height: "auto" }} />
            </nav>
            <div className="organize-template">
                <div className="event-info">
                    <h1>{event.title}</h1>
                    <p>{event.location}</p>
                    {!isOrganizator && !hasJoined && (
                        <button onClick={() => joinEvent()}>Join</button>
                    )}
                    {
                        !isOrganizator && hasJoined && (
                            <button onClick={leaveEvent}>Leave</button>
                        )
                    }
                    {
                        isOrganizator && (
                            <button onClick={deleteEvent}>Delete event</button>
                        )
                    }
                </div>
                <div className="map">
                    {/* Your map component goes here */}
                    <p>Map Component</p>
                </div>
                <div className="participants">
                    {isOrganizator && (
                        <button className='open-modal' onClick={openModal}>Add</button>
                    )}

                    {/* Your participants component goes here */}
                    <div>
                        <p>{organisateur.pseudo}</p>
                        <img width="50" src={organisateur.avatar} alt="avatar" />
                    </div>
                    <div className='add-participant'>
                        {
                            Array.isArray(participants) && participants.map((participant) => {
                                console.log("aa", participant)
                                return (
                                    <div className='participant'>
                                        {isOrganizator && (
                                            <button className='delete' onClick={() => deleteParticipant(participant.id)}><span className='bar1'>|</span><span className='bar2'>|</span></button>
                                        )}
                                        <p className='pseudo'> {participant.pseudo}</p>
                                        <img className='avatar-participant' width="50" src={participant.avatar} alt="avatar" />
                                    </div>
                                )

                            })
                        }
                    </div>
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


//get the organizer of the event :TODO: CODE: DONE  