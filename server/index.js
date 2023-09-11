require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser'); // Middleware pour analyser le corps de la demande JSON

//adding cors
const cors = require('cors');

// const {connect} = require('./src/services/mongoose');
const express = require('express');
const app = express();
app.use(cors());
//allow acces to every site 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// const eventsRouter = require('./routes/events');

const port = process.env.PORT || 3000;

app.use(express.json());

const sequelize = new Sequelize('my_event', 'ionut', 'password', {
  dialect: 'mysql',
  host: 'localhost',
});

const Event = sequelize.define('events', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  participants: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  event_uid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  //remove timestamps
  timestamps: false,
});

const User = sequelize.define('users', {
  pseudo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bio: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
},
  {
    //remove timestamps
    timestamps: false,
  });




// Synchronisez le modèle avec la base de données (créez la table si elle n'existe pas)
sequelize.sync()
  .then(() => {
    console.log('Table events synchronisée avec la base de données.');
  })
  .catch((error) => {
    console.error('Erreur lors de la synchronisation de la table events :', error);
  });


app.post('/create-event', async (req, res) => {
  try {
    // Récupérez les données du corps de la demande
    const { user_id, title, participants, event_uid, location } = req.body;

    // Insérez une nouvelle entrée dans la table events
    const newEvent = await Event.create({
      user_id,
      title,
      participants: JSON.stringify(participants), // Convertir en JSON si nécessaire
      event_uid,
      location,
    });

    // Répondez avec un message de succès et l'événement créé
    res.status(201).json({ message: 'Événement créé avec succès', event: newEvent });
  } catch (error) {
    // En cas d'erreur, renvoyez une réponse d'erreur
    console.error('Erreur lors de la création de l\'événement :', error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la création de l\'événement' });
  }
});

app.get('/events', async (req, res) => {
  try {
    // Récupérez tous les événements de la base de données
    const events = await Event.findAll();

    // Répondez avec les événements
    res.status(200).json(events);
  } catch (error) {
    // En cas d'erreur, renvoyez une réponse d'erreur
    console.error('Erreur lors de la récupération des événements :', error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des événements' });
  }
});

app.get('/events/:id', async (req, res) => {
  try {
    // Récupérez l'ID de l'événement à partir des paramètres de la requête
    const { id } = req.params;

    // Récupérez l'événement de la base de données
    const event = await Event.findByPk(id);

    // Répondez avec l'événement
    res.status(200).json(event);
  } catch (error) {
    // En cas d'erreur, renvoyez une réponse d'erreur
    console.error('Erreur lors de la récupération de l\'événement :', error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération de l\'événement' });
  }
});

// mettre a jour les participants
app.put('/events/:id', async (req, res) => {
  try {
    // Récupérez l'ID de l'événement à partir des paramètres de la requête
    const { id } = req.params;

    // Récupérez les données du corps de la demande
    const { participants } = req.body;
   
    // Mettez à jour l'événement dans la base de données
    const event = await Event.update({ participants: JSON.stringify(participants) }, {
      where: {
        id,
      },
    });

    // Répondez avec un message de succès et l'événement mis à jour
    res.status(200).json({ message: 'Événement mis à jour avec succès', event });
  } catch (error) {
    // En cas d'erreur, renvoyez une réponse d'erreur
    console.error('Erreur lors de la mise à jour de l\'événement :', error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la mise à jour de l\'événement' });
  }
});


app.get('/users', async (req, res) => {
  try {
    // Récupérez tous les événements de la base de données
    const users = await User.findAll();

    // Répondez avec les événements
    res.status(200).json(users);
  } catch (error) {
    // En cas d'erreur, renvoyez une réponse d'erreur
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des utilisateurs' });
  }
});








app.listen(port, () => {
  console.log(`Le serveur est lance a : http://localhost:${port}`);
})