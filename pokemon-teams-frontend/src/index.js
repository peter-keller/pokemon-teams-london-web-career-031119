const BASE_URL = "http://localhost:3000";
const TRAINERS_URL = `${BASE_URL}/trainers`;
const POKEMONS_URL = `${BASE_URL}/pokemons`;

document.addEventListener("DOMContentLoaded", () => {
  fetchTrainers();
});

sendRequest = url => {
  return fetch(url).then(res => {
    return res.json();
  });
};

fetchTrainers = () => {
  sendRequest(TRAINERS_URL).then(response => {
    document.querySelector("main").innerHTML = "";
    response.forEach(element => {
      let container = document.createElement("div");
      container.setAttribute("data-id", element.id);
      container.class = "card";
      container.innerHTML = renderTrainer(element);
      attachListeners(container.querySelectorAll("[data-pokemon-id]"));
      addPokemon(container.querySelector("[data-trainer-id]"));
      document.querySelector("main").appendChild(container);
    });
  });
};

renderTrainer = trainer => {
  return `<p>${trainer.name}</p>
    <button data-trainer-id=${trainer.id}>Add Pokemon</button>
    <ul>${renderPokemons(trainer.pokemons)}
     </ul>
    `;
};

renderPokemons = poki => {
  let res = "";

  poki.forEach(element => {
    res += createListItem(element);
  });
  return res;
};

createListItem = poki => {
  return `
        <li>${poki.nickname} (${poki.species})
            <button class="release" data-pokemon-id=${poki.id}>Release</button
        </li>`;
};

attachListeners = button => {
  button.forEach(element => {
    element.addEventListener("click", e => {
      slaughterPokemon(e.target.getAttribute("data-pokemon-id"));
      e.target.parentNode.remove();
    });
  });
};

slaughterPokemon = victim => {
  fetch(`http://localhost:3000/pokemons/${victim}`, { method: "DELETE" }).then(
    resp => {
      resp.json();
    }
  );
};

addPokemon = button => {
  const user_id = { trainer_id: button.getAttribute("data-trainer-id") };
  console.log(user_id);
  button.addEventListener("click", () => {
    fetch(`http://localhost:3000/pokemons`, {
      method: "POST",
      body: JSON.stringify(user_id),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(resp => {
      fetchTrainers();
    });
  });
};
