import React, { useEffect, useState } from 'react'
import svg from "../header.svg"
import filter_svg from "../filter.svg"
//TODO:Pagination
export const Home = (isLogged) => {
    const [evenements, setEvenements] = useState([])
    //FOR: Filter Modal
    const [filterModal, setFilterModal] = useState(false)
    const [transitionClass, setTransitionClass] = useState('')
    const [filter, setFilter] = useState({
        location: '',
        categorie: 'all'
    })



    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            position = position.coords;
            console.log(position);
        });
        //FIXME: API CONDITIONAL CALL
        fetch('https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/evenements-publics-openagenda/records')
            .then(res => res.json())
            .then(data => setEvenements(data.results))
    }, [])

    useEffect(() => {

        let filtered_category = filter.categorie == "all" ? 0 : filter.categorie;
        let filtered_location = filter.location == "" ? 0 : filter.location;
        //SI: Il complemete aucun des deux filtres
        if(!filtered_category && !filtered_location){
            fetch('https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/evenements-publics-openagenda/records')
            .then(res => res.json())
            .then(data => setEvenements(data.results))
        }
        //SI: Il complete que le filtre location
        else if(!filtered_category && filtered_location){
            let url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/evenements-publics-openagenda/records?where=location_name%20like%20%22%25${filtered_location}%25%22%20or%20location_address%20like%20%22%25${filtered_location}%25%22%20or%20location_city%20like%20%22%25${filtered_location}%25%22&limit=2` ;
            fetch(url).then(res => res.json())
            .then(data => setEvenements(data.results))
        }
        //SI: Il complete que le filtre categorie
        else if(filtered_category && !filtered_location){
            let url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/evenements-publics-openagenda/records?where=longdescription_fr%20like%20%22%25${filtered_category}%25%22%20or%20slug%20like%20%22%25${filtered_category}%25%22&limit=2`     
            fetch(url).then(res => res.json())
            .then(data => setEvenements(data.results))
        }
        //SI: Il complete les deux filtres
        else {
            let url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/evenements-publics-openagenda/records?where=location_name%20like%20%22%25${filtered_location}%25%22%20or%20location_address%20like%20%22%25${filtered_location}%25%22%20or%20location_city%20like%20%22%25${filtered_location}%25%22%20and%20longdescription_fr%20like%20%22%25${filtered_category}%25%22&limit=2 `
            fetch(url).then(res => res.json())
            .then(data => setEvenements(data.results))
        }
        
    }, [filter])

    useEffect(() => {
        if (filterModal) {
            setTransitionClass('active')
        } else {
            setTransitionClass('')
        }
    }, [filterModal])

    //TODO: Filter
    const handleFilter = (e) => {
        // console.log(e.target.parentNode.parentNode.getElementsByTagName('input')[0].value)
        // console.log(e.target.parentNode.parentNode.getElementsByTagName('select')[0].value)
        setFilter({
            location: e.target.parentNode.parentNode.getElementsByTagName('input')[0].value,
            categorie: e.target.parentNode.parentNode.getElementsByTagName('select')[0].value
        })
        setFilterModal(!filterModal)
    }

    return (
        <div className={(transitionClass) ? 'body_class': '' }>
            {/* TODO: Filter Modal */}
            {
                filterModal ? (
                    <div className={ (transitionClass) ? (' ' + 'filter_modal ' +  transitionClass) :('filter_modal')  }>
                        <label htmlFor="location">Location</label>
                        <input type="text" id="location" placeholder="city" />
                        <label htmlFor="categorie">Categorie</label>
                        <select name="categorie" id="categorie">
                            <option value="all">All</option>
                            <option value="music">Music</option>
                            <option value="sport">Sport</option>
                            <option value="art">Art</option>
                            <option value="theatre">Theatre</option>
                            <option value="cinema">Cinema</option>
                            <option value="conference">Conference</option>
                            <option value="exposition">Exposition</option>
                            <option value="festival">Festival</option>
                        </ select >
                        <div>
                            <button onClick={handleFilter} className='button_evenement_homepage'>Filtrer</button>
                            <button onClick={() => setFilterModal(!filterModal)} className='button_evenement_homepage'>Annuler</button>
                        </div>
                    </div>
                ) : (<>
                    <nav className="nav">
                        <div>Logo</div>
                        <div>Conect</div>
                    </nav>

                    <div className='main_body'>

                        <div className='header_image_container'>
                            <img className='svg' src={svg} />
                            <h1 style={{ textAlign: 'center', lineHeight: '5rem', margin: 0 }} className='title_homepage'>Evenements <br /> à  <br /> venir</h1>
                        </div>

                        <div className="container_evenements">
                            <div className='filter_container'>
                                <img onClick={() => setFilterModal(!filterModal)} className='filter_img' src={filter_svg} />
                            </div>
                            {evenements.map(evenement => (
                                <div key={evenement.uid} className="evenement">
                                    <h2 className='title_evenement_homepage'>{evenement.title_fr}</h2>
                                    <div className='image_event_container'>
                                        <img src={evenement.image} alt="Image_evenement" />
                                    </div>

                                    <p className='description_evenement_homepage'>{evenement.description_fr}</p>
                                    <div className="card_last_part">
                                        <p className='card_datetime'>{evenement.firstdate_begin.split("T")[0].split("-")[2]
                                            + "-" + evenement.firstdate_begin.split("T")[0].split("-")[1]
                                            + "-" + evenement.firstdate_begin.split("T")[0].split("-")[0]}
                                        </p>
                                        <button className='button_evenement_homepage'>En Savoir +</button>
                                    </div>
                                    <p> {evenement.location_city}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>

                )
            }

        </div>
    )
}


