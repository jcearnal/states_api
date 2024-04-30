# INF653 Final Project API

This API provides access to U.S. states data, allowing you to retrieve, create, update, and delete information about states and their fun facts.

## Base URL
`https://states-api-5u6c.onrender.com/`

## Endpoints

### States

- **GET /states/**
  - Returns an array of all states including their state name, abbreviation, and additional details.

- **GET /states/:stateCode**
  - Returns detailed information about a single state, including fun facts if available.

- **POST /states/:stateCode/funfact**
  - Adds new fun facts to a state. Requires JSON body with `funfacts` array.

- **PATCH /states/:stateCode/funfact**
  - Updates a specific fun fact for a state by index. Requires JSON body with `index` and `funfact`.

- **DELETE /states/:stateCode/funfact**
  - Deletes a specific fun fact from a state by index. Requires JSON body with `index`.

### Fun Facts

- **GET /states/:stateCode/funfact**
  - Retrieves a random fun fact about a specified state.

### Additional State Information

- **GET /states/:stateCode/capital**
  - Returns the capital city of the specified state.

- **GET /states/:stateCode/nickname**
  - Returns the nickname of the specified state.

- **GET /states/:stateCode/population**
  - Returns the population of the specified state.

- **GET /states/:stateCode/admission**
  - Returns the admission date of the specified state into the union.


