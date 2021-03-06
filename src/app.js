const express = require("express");
const cors = require("cors");
const res = require("express/lib/response");

const { v4 } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    title: title,
    url: url,
    techs: techs,
    likes: 0,
    id: v4(),
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;
  const repository = repositories.find((repo) => repo.id === id);

  if (!repository) {
    return response
      .status(400)
      .json({ status: "error", message: "Repository not found" });
  }

  if (repository) {
    repository.title = title;
    repository.url = url;
    repository.techs = techs;
  }

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repository = repositories.findIndex((repo) => repo.id === id);

  if (repository < 0) {
    return response
      .status(400)
      .json({ status: "error", message: "Repository not found" });
  }

  repositories.splice(repository, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repository = repositories.find((repo) => repo.id === id);

  if (!repository) {
    return response
      .status(400)
      .json({ status: "error", message: "Repository not found" });
  }
  repository.likes += 1;
  return response.json(repository);
});

module.exports = app;
