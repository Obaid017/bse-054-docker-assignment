# Study Planner

A small study-task tracker (HTML, CSS, JavaScript) served by a Node.js server.
Used for CSC418 DevOps Lab Assignment 2.

## Run locally
    npm start
    # open http://localhost:3000

## Run with Docker
    docker build -t study-planner .
    docker run -p 3000:3000 study-planner
    # open http://localhost:3000

## Change the port
    docker run -e PORT=8080 -p 8080:8080 study-planner
