import React, { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export const Home = (isLogged) => {
    const [evenements, setEvenements] = useState([])
    // let position;
    var count = 0;

    const [user, setUser] = useState([]);
    const [displayS, setDisplayS] = useState([]);
    const [profile, setProfile] = useState([]);

    const display = () => {
        if (count%2==0) {setDisplayS("show"); }else{setDisplayS('none')}
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
                    localStorage.setItem("user",JSON.stringify(res.data))
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
                {JSON.parse(localStorage.getItem('user')) ? (
                    <div  style={{display: "flex",flexDirection:"row", justifyContent:"space-around" }}>
                        <div style={{display: "flex",flexDirection:"column", marginRight:"20px" }}>
                            <h3>User Logged in</h3>
                            <p>Name: {JSON.parse(localStorage.getItem('user')).name}</p>
                            <p>Email Address: {JSON.parse(localStorage.getItem('user')).email}</p>
                            <button style={{}} onClick={logOut}>Log out</button>
                        </div>
                        <img src={JSON.parse(localStorage.getItem('user')).picture} id='menu' width="50" height="50" style={{ position: "relative" }} onClick={() => { display() }} alt="user image" />
                    
      
                    </div>
                ) : (
                    <button onClick={login}>Sign in with Google 🚀 </button>
                )}
                {/* <GoogleLogin clientId="97850260613-uh00e7m1ehdr5fnkti01tdmfvktkjv25.apps.googleusercontent.com" onSuccess={responseMessage} onError={errorMessage} /> */}
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


