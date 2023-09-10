import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import ReactHtmlParser from 'react-html-parser';

export const EventDetail = (isLogged) => {

    const [event, setEvent] = useState({});
    const { uid } = useParams();
    const navigate = useNavigate();

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

    const createEvent = () => {
        fetch('http://localhost:4000/create-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: event.title_fr,
                location: event.location_city,
                date: event.firstdate_begin,
                event_uid: event.uid,
                user_id: 1
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
                    <div>Logo</div>
                    <div>Conect</div>
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
                        <button onClick={createEvent}>Organiser une sortie</button>
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

