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
                <div className='logo'>Logo</div>
                <div className='menu'>Connect</div>
            </nav>
            <div className='main_body'>
                {/* <div className="title_homepage_container">
                    <h1 className='title_homepage'>Evenements</h1>
                    <h1 className='title_homepage'>à</h1>
                    <h1 className='title_homepage'> venir</h1>
                </div> */}
                <h1 style={{textAlign:'center',lineHeight:'5rem',margin:0,zIndex:"1000",borderBottomLeftRadius:"40px"}} className='title_homepage'>Évènements <br /> à  <br /> venir</h1>
          <div className="bg_top"></div>
        <div class="container">
        <div class="carrousel">
            {evenements.slice(0, 5).map(evenement=>{
            return (
            <article class="card" style={{height:"300px",backgroundImage:"url('"+evenement.image+"')"}}>
                <h1 className='carrou_h1' style={{zIndex:"1000",fontWeight:"600",padding:"30px"}}>{evenement.title_fr.substr(0,10)+" ..."}</h1>
            </article>)
            })}
        </div>
    </div>
                <div className="container_evenements">
                    {evenements.map(evenement => (
                        <div key={evenement.uid} className="evenement">
                            <h2 className='title_evenement_homepage'>{evenement.title_fr.substr(0,18)+" ..."}</h2>
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


