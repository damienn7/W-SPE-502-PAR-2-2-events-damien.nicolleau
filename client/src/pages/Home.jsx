import React, { useEffect, useState } from 'react'

export const Home = (isLogged) => {
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
            <div className='main_body'>
                {/* <div className="title_homepage_container">
                    <h1 className='title_homepage'>Evenements</h1>
                    <h1 className='title_homepage'>à</h1>
                    <h1 className='title_homepage'> venir</h1>
                </div> */}
                <h1 style={{textAlign:'center',lineHeight:'5rem'}} className='title_homepage'>Evenements <br /> à  <br /> venir</h1>
                <div className="container_evenements">
                    {evenements.map(evenement => (
                        <div key={evenement.uid} className="evenement">
                            <h2 className='title_evenement_homepage'>{evenement.title_fr}</h2>
                            <div className='image_event_container'>
                                <img src={evenement.image} alt="Image_evenement" />
                            </div>

                            <p className='description_evenement_homepage'>{evenement.description_fr}</p>
                            <button className='button_evenement_homepage'>En Savoir +</button>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}


