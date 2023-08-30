import React, { useEffect, useState } from 'react'

export const Home = () => {
    const [evenements, setEvenements] = useState([])
    // let position;

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            position = position.coords;
            console.log(position);
        });
        fetch('https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/evenements-publics-openagenda/records')
            .then(res => res.json())
            .then(data => setEvenements(data.results))
    }, [])

    return (
        <div>
            <nav className="nav">
                <div>Logo</div>
                <div>Conect</div>
            </nav>
            <div>
                <h1 className='title_homepage'>Evenements à venir</h1>
                <div className="container_evenements">
                    {evenements.map(evenement => (
                        <div key = {evenement.uid} className="evenement">
                            <h2>{evenement.slug}</h2>
                            <div className='image_event_container'>
                                <img src={evenement.image} alt = "Image_evenement" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}


