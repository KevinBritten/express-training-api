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
