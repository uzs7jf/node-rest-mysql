//const { restart } = require("nodemon");
const Game = require("../models/game.model.js");
const Player = require("../models/player.model.js");
const playGame = require("../services/games.services.js");

// Retrieve all games from the database.

module.exports = {
  // Create one player
  createOne: async (req, res) => {
    if (Object.keys(req.body).length === 0) {
      await Player.newPlayer("Anonimo");
      res.status(201).json({ message: "New player added as anonymus" });
    } else {
      try {
        let checked = false;
        checked = await Player.checkIfPlayerExists(req.body.name).catch(e => e);
        if (checked === true) {
          await Player.newPlayer(req.body.name);
          res.status(201).json({ message: "New Player added " + checked });
        } else if (checked === false) {
          res
            .status(501)
            .json({ message: `player already EXISTS ` + checked  });
        }
      } catch (e) {
        res
          .status(500)
          .json({ message: e });
      }
  
    }
    // Promise.All() avoid promise rejection error
    
    /* if (checked === undefined) {
      await Player.newPlayer(req.body.name);
      res.status(201).json({ message: "New Player added" });
    } else {
      res.status(501).json({ message: `player already EXISTS result ${checked}`});
    } */
  },

  updateOne: async (req, res) => {
    if (Object.keys(req.body).length === 0) {
      res.status(400).send({ message: "Content can not be empty!" });
    }

    let checked = await Promise.all([
      Player.checkIfPlayerExists(req.body.name).catch((error) => {
        console.log("error message", error.message);
      }),
    ]);
    //
    Player.updateName(req.body.newName, req.body.nickName);
    if (checked === null) {
      res.status(201).json({ message: checked });
    } else {
      res.status(501).json({ message: "Player already exists", checked });
    }
  },

  playOneGame: async (req, res, next) => {
    try {
      let playerId = req.params.playerId;
      let score = await playGame();
      await Game.addScore(playerId, score);
      res.status(201).json({ message: "New game added!" });
    } catch (e) {
      res.status(404).json({ error: e });
    }
  },

  findAll: async (req, res) => {
    try {
      const results = await Player.getAllPlayers();
      res.status(200).send(results);
    } catch (e) {
      console.log(e.message);
      res.sendStatus(500);
    }
  },

  //Retrieve a single object
  findOne: async (req, res) => {
    try {
      const results = await Player.findById(req.params.playerId);
      res.status(200).send(results);
    } catch (e) {
      console.log(e.message);
      res.sendStatus(500);
    }
  },

  // Retrieve a single player score list
  gamesAll: async (req, res) => {
    try {
      const results = await Game.getAllScoresFromPlayer(req.params.playerId);
      res.status(200).send(results);
    } catch (e) {
      console.log(e.message);
      res.sendStatus(500);
    }
  },

  // Retrieve Ranking of all players
  findRanking: async (req, res) => {
    try {
      const results = await Game.getRanking();
      res.status(200).send(results);
    } catch (e) {
      console.log(e.message);
      res.sendStatus(500);
    }
  },

  // Retrieve best player
  findWorst: async (req, res) => {
    try {
      const results = await Game.findLoser();
      res.status(200).send(results);
    } catch (e) {
      console.log(e.message);
      res.sendStatus(500);
    }
  },

  // Retrieve best player
  findBest: async (req, res) => {
    try {
      const results = await Game.findWinner();
      res.status(201).send(results);
    } catch (e) {
      console.log(e.message);
      res.sendStatus(500);
    }
  },

  // Delete one player by ID
  deleteAll: async (req, res) => {
    try {
      const results = await Game.deleteGames(req.params.playerId);
      res.status(200).send(results);
    } catch (e) {
      console.log(e.message);
      res.sendStatus(400);
    }
  },
}; // End Module
