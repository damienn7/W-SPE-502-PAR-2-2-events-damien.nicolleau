import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import ReactHtmlParser from 'react-html-parser';

export const EventDetail = (isLogged) => {

    const [event, setEvent] = useState({});
    const { uid } = useParams();
    const navigate = useNavigate();

    const [blocked, setBlocked] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('user')) {
            setBlocked(true);
        }else {
            setBlocked(false);
        }
    }, []);


    useEffect(() => {
        console.log(uid);
        fetch(`https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/evenements-publics-openagenda/records?where=uid%20%3D${uid}&limit=20`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data.results[0]);
                setEvent(data.results[0]);
            });
        console.log(uid);
    }, [uid]);

    // make the user_id dynamic
    const createEvent = () => {
        fetch('http://localhost:4000/create-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: event.title_fr,
                location: event.location_city,
                date: event.firstdate_begin,
                event_uid: event.uid,
                user_id: JSON.parse(localStorage.getItem('user')).id,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                fetch('http://localhost:4000/events').then((response) => response.json())
                    .then((data) => {
                        console.log(data);
                        navigate("/organize/" + data[data.length - 1].id
                        );

                    });
            }
            );
    }


    return (
        <>
            <nav className="nav">
                <img src="https://leboncoincorporate.com/wp-content/uploads/2022/05/141_Vous-etes-selectionnee_-bienvenue-chez-leboncoin-Groupe_vec-01.svg" onClick={() => navigate('/')} alt="logo" style={{ width: "10rem", height: "auto" }} />

            </nav>
            <div className="head-container-detail">
                <div className="img-container-detail">
                    <img src={event.image} alt="event" />
                </div>
                <div className="event-info">
                    <h1>{event.title}</h1>
                    {/* <p className='card_datetime'>{event.firstdate_begin.split("T")[0].split("-")[2]
                            + "-" + event.firstdate_begin.split("T")[0].split("-")[1]
                            + "-" + event.firstdate_begin.split("T")[0].split("-")[0]}
                        </p> */}
                    <p>location: {event.location_city}</p>
                    {/* i removed the blocked here put it back */}
                    <button disabled={blocked?true:false} onClick={createEvent}>Organiser une sortie</button>
                </div>
            </div>
            <div className="body-container-detail">
                <h2>Description</h2>
                <div dangerouslySetInnerHTML={{ __html: event.longdescription_fr }} >

                </div>
            </div>
        </>
    );
}

