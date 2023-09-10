import React, { useEffect, useState } from 'react'
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import svg from "../header.svg"
import filter_svg from "../filter.svg"
import { useNavigate } from 'react-router-dom'



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
    const navigate = useNavigate();

    //DAMS: Google Auth
    const [user, setUser] = useState([]);
    const [displayS, setDisplayS] = useState([]);
    const [profile, setProfile] = useState([]);

    var count = 0;

    const display = () => {
        if (count % 2 == 0) { setDisplayS("show"); } else { setDisplayS('none') }
    }

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    const logOut = () => {
        googleLogout();
        setProfile(null);
        localStorage.removeItem("user");
    };

    const responseMessage = (response) => {
        console.log(response);
        console.log(response);
        setUser(response)
    };

    const errorMessage = (error) => {
        console.log(error);
    };

    // FIXME: Prendre en consideration la position de l'utilisateur pour lui proposer des evenements proche de lui
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            position = position.coords;
            console.log(position);
        });
        //FIXME: API CONDITIONAL CALL BORDEL DE MERDE JE SAIS PAS CE QUE JE VOULAIS DIRE PAR CA 
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
            let url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/evenements-publics-openagenda/records?where=location_name%20like%20%22%25${filtered_location}%25%22%20or%20location_address%20like%20%22%25${filtered_location}%25%22%20or%20location_city%20like%20%22%25${filtered_location}%25%22&limit=8` ;
            fetch(url).then(res => res.json())
            .then(data => setEvenements(data.results))
        }
        //SI: Il complete que le filtre categorie
        else if(filtered_category && !filtered_location){
            let url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/evenements-publics-openagenda/records?where=longdescription_fr%20like%20%22%25${filtered_category}%25%22%20or%20slug%20like%20%22%25${filtered_category}%25%22&limit=8`     
            fetch(url).then(res => res.json())
            .then(data => setEvenements(data.results))
        }
        //SI: Il complete les deux filtres
        else {
            let url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/evenements-publics-openagenda/records?where=location_name%20like%20%22%25${filtered_location}%25%22%20or%20location_address%20like%20%22%25${filtered_location}%25%22%20or%20location_city%20like%20%22%25${filtered_location}%25%22%20and%20longdescription_fr%20like%20%22%25${filtered_category}%25%22&limit=8 `
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

    //DAMS: Google Auth
    useEffect(() => {
        if (user) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    // localStorage.setItem("user", JSON.stringify(res.data))
                    console.table(res.data);
                    fetch("http://localhost:4000/users",{
                        method:"post",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            pseudo: res.data.given_name,
                            email:res.data.email,
                            bio:"",
                            avatar:res.data.picture
                        }),
                    })
                    .then((data)=>{return data.json()})
                    .then((data)=>{
                        localStorage.setItem("user",JSON.stringify(data.user))
                        setProfile(data.user);
                    })
                    .catch(
                        (e)=>{
                            console.error("erreur : "+e);
                        }
                        )
                })
                .catch((err) => console.log(err));
        }
       

    }, [user])



    return (
        <div className={(transitionClass) ? 'body_class' : ''}>
            {/* TODO: Filter Modal */}
            {
                filterModal ? (
                    <div className={(transitionClass) ? (' ' + 'filter_modal ' + transitionClass) : ('filter_modal')}>
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
                        <img src="https://leboncoincorporate.com/wp-content/uploads/2022/05/141_Vous-etes-selectionnee_-bienvenue-chez-leboncoin-Groupe_vec-01.svg" onClick={navigate('/')} alt="logo" style={{width:"10rem",height:"auto"}} />
                        {JSON.parse(localStorage.getItem('user')) ? (
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                                <div style={{ display: "flex", flexDirection: "column", marginRight: "20px" }}>
                                    <h3>User Logged in</h3>
                                    <p>Name: {JSON.parse(localStorage.getItem('user')).pseudo}</p>
                                    <p>Email Address: {JSON.parse(localStorage.getItem('user')).email}</p>
                                    <button style={{}} onClick={logOut}>Log out</button>
                                </div>
                                <img src={JSON.parse(localStorage.getItem('user')).avatar} id='menu' width="50" height="50" style={{ position: "relative" }} onClick={() => { display() }} alt="user image" />
                            </div>
                        ) : (
                            <button onClick={login}>Sign in with Google 🚀 </button>
                        )}
                        {/*MODAL INSCRIPTION*/}
                        {
                            // modalInscription && <div>

                            // </div>
                        }
                        {/* <GoogleLogin clientId="97850260613-uh00e7m1ehdr5fnkti01tdmfvktkjv25.apps.googleusercontent.com" onSuccess={responseMessage} onError={errorMessage} /> */}
                    </nav>

                    <div className='main_body'>

                        <div className='header_image_container' style={{ textAlign: 'center', lineHeight: '5rem', margin: 0, zIndex: "1000", borderBottomLeftRadius: "40px" }}>
                            <img className='svg' style={{position:"relative",zIndex:"100",objectFit:"cover",width:"350px"}} src={svg} />
                            <h1 style={{ position:"relative",zIndex:"2000",textAlign: 'center', lineHeight: '5rem', margin: 0 }} className='title_homepage'>Evenements <br /> à  <br /> venir</h1>
                        </div>
                        {/* <h1 style={{ textAlign: 'center', lineHeight: '5rem', margin: 0, zIndex: "1000", borderBottomLeftRadius: "40px" }} className='title_homepage'>Évènements <br /> à  <br /> venir</h1> */}
                        <div className="bg_top"></div>
                        <div class="container">
                            <div class="carrousel">
                                {evenements.slice(0, 5).map(evenement => {
                                    return (
                                        <article class="card" style={{ height: "300px", backgroundImage: "url('" + evenement.image + "')" }}>
                                            <h1 className='carrou_h1' style={{ zIndex: "1000", fontWeight: "600", padding: "30px" }}>{evenement.title_fr.substr(0, 10) + " ..."}</h1>
                                        </article>)
                                })}
                            </div>
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
                                        <button onClick={() => { navigate(`event/${evenement.uid}`) }} className='button_evenement_homepage'>En Savoir +</button>
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


//USESTATE PROBLEMS a regler