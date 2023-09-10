import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

//TODO: Systeme de verification si membre === user connected

export const Member = () => {
    const { id } = useParams();
    //FIXME: les events du memmbre
    const [events, setEvents] = useState([]);

    //FIXME: SI USER CONNECTED === can update its own infos 
    const [modal, setModal] = useState(false);

    //FIXME: pour afficher les info du membre
    const [user, setUser] = useState(null);

    const [isUser, setIsUser] = useState(false);

    //Pour rediriger vers /organize/id de l'event
    const navigate = useNavigate();

    //C BON 
    useEffect(() => {
        if (!localStorage.getItem('user')) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        if (JSON.parse(localStorage.getItem('user'))?.id == id) {
            setIsUser(true);
            setUser(JSON.parse(localStorage.getItem('user')));
            fetch(`http://localhost:4000/user/${id}/events`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    setEvents(data.events);
                });
        } else {
            setIsUser(false);
            fetch(`http://localhost:4000/users/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    setUser(data.user);
                    fetch(`http://localhost:4000/user/${id}/events`)
                        .then((response) => response.json())
                        .then((data) => {
                            console.log(data);
                            setEvents(data.events);
                        });
                });
        }
    }, []);


    const openModal = () => {
        setModal(true);
    }



    return (
        <>
            {modal && (
                <div className="modal_update"></div>)
            }

            <nav className="nav">
                <img src="https://leboncoincorporate.com/wp-content/uploads/2022/05/141_Vous-etes-selectionnee_-bienvenue-chez-leboncoin-Groupe_vec-01.svg" onClick={() => navigate('/')} alt="logo" style={{ width: "10rem", height: "auto" }} />
            </nav>

            <div className='info_container'>
                <div className="info">
                    <div className="info_avatar">
                        <img src={user?.avatar} alt="avatar" />
                    </div>
                    <div className="info_pseudo">
                        <h1>{user?.pseudo}</h1>
                    </div>
                    <div className="info_bio">
                        <p>{user?.bio}</p>
                    </div>
                    <div className="info_update">
                        {isUser && (
                            <button onClick={openModal}>Modifier</button>
                        )}
                    </div>
                </div>

            </div>

            <div className="events_container">
                <h1>Events</h1>
                {events.map(e => {
                    return (
                        <div>
                            <p>{e.title}</p>
                            <p>{e.location}</p>
                            <p>{e.date}</p>
                            <button onClick={() => { navigate(`/organize/${e.id}`) }}>Voir +</button>
                        </div>
                    )
                })}
            </div>
        </>
    )
}


//TODO: css 
// JE CROIS QUE CETTE PAGE C'est bon ... Nope
//TODO: Prendre aussi en compte les events auquelle il participe pas que ceux qu'il orgnaise
