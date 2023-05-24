const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 4000;

app.use(express.json()); // to support JSON-encoded bodies

app.get("/", (req, res) => {
  res.send("Hello from Nerdbord!");
});

app.listen(PORT, () => {
  console.log("Server listening on port 3000");
});

app.get("/trains", (req, res) => {
  res.sendFile(path.join(__dirname, "data", "trains.json"));
});

app.post("/trains", (req, res) => {
  const newData = req.body;

  const filePath = path.join(__dirname, "data", "trains.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      // handle error
      console.error(err);
      res.status(500).send("Error reading file");
      return;
    }

    let trains = JSON.parse(data);

    // Calculate the new train ID
    const highestId = Math.max(...trains.map((train) => Number(train.id)));
    const newId = highestId + 1;

    // Assign the new ID to the incoming train data
    newData.id = newId.toString();

    trains.push(newData);

    fs.writeFile(filePath, JSON.stringify(trains, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error writing file");
        return;
      }

      res.status(200).send("Successfully added new train data");
    });
  });
});

app.put("/trains/:id", (req, res) => {
  const newData = req.body;

  const filePath = path.join(__dirname, "data", "trains.json");

  let id;
  const idParams = req.params.id;
  const idBody = req.body.id;

  if (idParams !== idBody) {
    res.status(500).send("Ids in params and body do not match");
    return;
  } else {
    id = idParams;
  }

  if (!id) {
    res.status(500).send("No id provided");
    return;
  }

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      // handle error
      console.error(err);
      res.status(500).send("Error reading file");
      return;
    }

    let trains = JSON.parse(data);

    let trainToModify = trains.find((train) => train.id === id);

    if (!trainToModify) {
      res.status(500).send(`No train with id ${id} found`);
      return;
    } else {
      for (let property in newData) {
        trainToModify[property] = newData[property];
      }
    }
    fs.writeFile(filePath, JSON.stringify(trains, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error writing file");
        return;
      }

      res.status(200).send(`Successfully modified train with id ${id}`);
    });
  });
});

app.delete("/trains/:id", (req, res) => {
  const filePath = path.join(__dirname, "data", "trains.json");

  const id = req.params.id;
  if (!id) {
    res.status(500).send("No id provided");
    return;
  }

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading file");
      return;
    }

    let trains = JSON.parse(data);

    let trainIndex = trains.findIndex((train) => train.id === id);

    if (trainIndex === -1) {
      res.status(500).send(`No train with id ${id} found`);
      return;
    } else {
      trains.splice(trainIndex, 1);
    }

    fs.writeFile(filePath, JSON.stringify(trains, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error writing file");
        return;
      }

      res.status(200).send(`Successfully deleted train with id ${id}`);
    });
  });
});
