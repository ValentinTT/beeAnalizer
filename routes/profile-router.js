const routes = require('express').Router();
const multer = require('multer');
const upload = multer();
const Beekeeper = require('./../db/models').Beekeeper;

const authCheck = (req, res, next) => {
  if (!req.user)
    res.redirect('/auth/login');
  else
    next();
};

//profile 
routes
  .get('/', authCheck, (req, res) => {
    res.render('profile', {
      dataApiaries: JSON.stringify(req.user.apiaries),
      apiarios: req.user.apiaries,
      avatarPhoto: req.user.googlePhotoUrl
    });
  })
  .post('/', authCheck, upload.any(), (req, res) => {
    let createNewApiary = req.body["where-to-save"].includes("new-apiary");
    let apiaryName = req.body["apiary-name"];

    console.log("req.body :", req.body);
    console.log("req.files :", req.files);

    let data = "[" + req.files[0].buffer.toString('utf8');
    console.log(data);
    data = JSON.parse(data.slice(0, data.lastIndexOf(",")) + "]",
      (key, value) => key == "time" ? new Date(value) : value); //Parse the string to json, changing the time from a string type to a Date object
    //Get the number of hives in which are gonna be changes or updates by identifying the different ids
    let numberOfHives = data.reduce((acc, curr) => acc.includes(curr.id) ? acc : [...acc, curr.id], []);

    console.log(req.user);

    Beekeeper.findOne({
      googleId: req.user.googleId
    }, (err, beekeeper) => {
      if (err) return; //TODO: agregar una pantalla de error al cargar datos
      if (createNewApiary) {
        let apiary = {
          apiaryName: apiaryName,
          hives: []
        };
        apiary.hives = numberOfHives.map(number => ({
          id: number,
          data: data.filter(d => d.id == number).map(d => {
            let data = {
              time: d.time,
              safe: d.data.safe
            };
            if (d.data.temperature) data.innerTemperature = d.data.temperature;
            if (d.data.humidity) data.innerHumidity = d.data.humidity;
            if (d.data.hiveEntrance) data.entrance = d.data.hiveEntrance;
            if (d.data.fumesLevel) data.fumes = d.data.fumesLevel;
            return data;
          })
        }));
        beekeeper.apiaries.push(apiary);
        beekeeper.save((err, b) => {
          if (err) return;
          res.redirect('/profile');
        });
      } else {
        let apiary = beekeeper.apiaries.find(a => a.apiaryName == apiaryName);
        if (!apiary) return; //TODO: there is no apiary called that way
        numberOfHives.forEach(number => {
          let hive = apiary.hives.find(h => h.id == number);
          if (!hive) {
            apiary.hives.push({
              id: number,
              data: data.filter(d => d.id == number).map(d => {
                let data = {
                  time: d.time,
                  safe: d.data.safe
                };
                if (d.data.temperature) data.innerTemperature = d.data.temperature;
                if (d.data.humidity) data.innerHumidity = d.data.humidity;
                if (d.data.hiveEntrance) data.entrance = d.data.hiveEntrance;
                if (d.data.fumesLevel) data.fumes = d.data.fumesLevel;
                return data;
              })
            });
          } else {
            hive.data = [...hive.data, ...data.filter(d => d.id == number).map(d => {
              let data = {
                time: d.time,
                safe: d.data.safe
              };
              if (d.data.temperature) data.innerTemperature = d.data.temperature;
              if (d.data.humidity) data.innerHumidity = d.data.humidity;
              if (d.data.hiveEntrance) data.entrance = d.data.hiveEntrance;
              if (d.data.fumesLevel) data.fumes = d.data.fumesLevel;
              return data;
            })];
          }
        });
        beekeeper.save((err, b) => {
          if (err) return;
          res.redirect('/profile');
        });
      }
    });
  });

export const Router = routes;