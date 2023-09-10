import React, { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export const Home = (isLogged) => {
    const [evenements, setEvenements] = useState([])
    // let position;

    const [ user, setUser ] = useState([]);
    const [ profile, setProfile ] = useState([]);

    const login = GoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    const logOut = () => {
        googleLogout();
        setProfile(null);
    };

    const responseMessage = (response) => {
        console.log(response);
        console.log(response);
        setUser(response)
    };
    const errorMessage = (error) => {
        console.log(error);
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            position = position.coords;
            console.log(position);
        });

            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
                        console.table(res.data);
                    })
                    .catch((err) => console.log(err));
            }
        fetch('https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/evenements-publics-openagenda/records')
            .then(res => res.json())
            .then(data => setEvenements(data.results));


    }, [user])

    return (
        <div>
            <nav className="nav">
                <div className='logo'>Logo</div>
                {/* {profile ? (
                <div>
                    <img src={profile.picture} alt="user image" />
                    <h3>User Logged in</h3>
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    <br />
                    <br />
                    <button onClick={logOut}>Log out</button>
                </div>
            ) : ( */}
                <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
                {/* // <button onClick={login}>Sign in with Google 🚀 </button>
            )} */}
                {/* <div className='menu' onClick={window.location.href = 'http://localhost:3000/connect'}>Connect</div> */}
            </nav>
            <div className='main_body'>
                {/* <div className="title_homepage_container">
                    <h1 className='title_homepage'>Evenements</h1>
                    <h1 className='title_homepage'>à</h1>
                    <h1 className='title_homepage'> venir</h1>
                </div> */}
                <h1 style={{ textAlign: 'center', lineHeight: '5rem', margin: 0, zIndex: "1000", borderBottomLeftRadius: "40px" }} className='title_homepage'>Évènements <br /> à  <br /> venir</h1>
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
                    {evenements.map(evenement => (
                        <div key={evenement.uid} className="evenement">
                            <h2 className='title_evenement_homepage'>{evenement.title_fr.substr(0, 18) + " ..."}</h2>
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


