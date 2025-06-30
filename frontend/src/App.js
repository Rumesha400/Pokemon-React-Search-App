import logo from "./logo.png";
import "./App.css";
import React, { useState, useEffect } from "react";
import { AiOutlineSortAscending } from "react-icons/ai";
import { AiOutlineSortDescending } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// import { log } from "console";


function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [showModal, setShowModal] = useState(false);
  const [newPokemonName, setNewPokemonName] = useState("");
  const [newPokemonURL, setNewPokemonURL] = useState("");


  // Track sort order
  const [sortOrder, setSortOrder] = useState("null");

  // Fetch Pokémon list from the API when the component mounts

  const fetchPokemonList = async () => {
    try {
      // const response = await fetch("http://localhost:3001/api/pokemon/");
      const response = await fetch("http://192.168.148.188:5000/poke/getPokemon");


      if (!response.ok) {
        throw new Error(`Error fetching Pokémon list: ${response.statusText}`);
      }
      const data = await response.json();
      setPokemonList(data);





    } catch (error) {
      console.error("Error fetching Pokémon list:", error);
    }
  };

  useEffect(() => {
    fetchPokemonList();
  }, []);
  // const filteredPokemonList=[]

  // Sort list when sort order is updated
  const handleSortOrder = (order) => {
    setSortOrder(order);
    setPokemonList((prevList) =>
      [...prevList].sort((a, b) => {
        if (order === "asc") {
          return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
        } else {
          return a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1;
        }
      })
    );
  };


  // Searching 
  const filteredPokemonList = pokemonList
    .filter((pokemon) => pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()));





  const showPokemon = async (url) => {
    try {
      const response = await fetch(`${url}`);
      if (!response.ok) {
        console.error(`Error fetching Pokémon: ${response.statusText}`);
        return;
      }
      const data = await response.json();
      setSelectedPokemon(data);
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
    }
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };



  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPokemonList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPokemonList.length / itemsPerPage);


  // Generate table rows with Sr.No, Name, and URL columns for current items
  const tableRows = currentItems.map((pokemon, index) => (
    <tr key={indexOfFirstItem + index}>
      <td>{indexOfFirstItem + index + 1}</td>
      <td>
        <a href="#" onClick={() => showPokemon(pokemon.url)}>
          {pokemon.name}
        </a>
      </td>
      <td>
        <a href="#" onClick={() => showPokemon(pokemon.url)}>
          {pokemon.url}
        </a>
      </td>
      <td>
        <button
          className="delete-button-backend"
          onClick={() => deletePokemon(pokemon.id)}>

          <RiDeleteBin6Line style={{ fontSize: "20px", cursor: "pointer" }} />
        </button>

      </td>
    </tr>
  ));

  // Function to add Pokémon
  const addPokemon = async () => {
    const newPokemon = { name: newPokemonName, url: newPokemonURL };
    try {
      const response = await
        fetch("http://192.168.148.188:5000/poke/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPokemon),
        });
      console.log('TEST DATA ', response);

      if (!response.ok) throw new Error("Failed to add Pokémon");
      setPokemonList([...pokemonList, newPokemon]);
      setShowModal(false);
      setNewPokemonName("");
      setNewPokemonURL("");
      fetchPokemonList();
    } catch (error) {
      console.error("Error adding Pokémon:", error);
    }
  };

  // Function to delete Pokémon
  const deletePokemon = async (id) => {
    // alert(id)

    const temp = { id }
    try {

      const response = await fetch(`http://192.168.148.188:5000/poke/deletePokemon`,
        {
          method: "DELETE",
          headers: { 'Content-Type': "application/json" },
          body: JSON.stringify(temp),
        });
      if (response.ok) {
        setPokemonList(pokemonList.filter((pokemon) => pokemon.id !== id));
        console.log("Pokémon deleted successfully");
      } else {
        console.error(`Failed to delete Pokémon. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting Pokémon:", error);
    }
  };





  const renderPaginationButtons = () => {
    const pageNumbers = [];

    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(currentPage + 2, totalPages);

    // "First" button and "Previous" button
    if (currentPage >= 1) {
      pageNumbers.push(
        <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
          First
        </button>
      );
      pageNumbers.push(
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          <GrPrevious />

        </button>
      );
    }

    // Add the page numbers with ellipsis
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={i === currentPage ? "active" : ""}
        >
          {i}
        </button>
      );
    }

    // Add ellipsis if there are pages before or after the current range
    if (startPage > 1) {
      pageNumbers.unshift(<span key="ellipsis-start">...</span>);
    }
    if (endPage < totalPages) {
      pageNumbers.push(<span key="ellipsis-end">...</span>);
    }

    // Add the "Next" button and "Last" button
    if (currentPage <= totalPages) {
      pageNumbers.push(
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          <GrNext />
        </button>
      );
      pageNumbers.push(
        <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
          Last
        </button>
      );
    }

    return <div className="pagination-buttons">{pageNumbers}</div>;
  };


  // Show Pokémon details view
  if (selectedPokemon) {
    return (<>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", marginRight: "50px" }} className="backtolist">
        {/* Back to List button */}
        <button
          onClick={() => setSelectedPokemon(null)}
          className="back-button"

        >
          Back to List
        </button>
      </div>

      <div className="pokemon-details-container">
        <div className="pokemon-details">
          <img src={selectedPokemon.sprites.front_default} alt={selectedPokemon.name} />
          <h2>{selectedPokemon.name}</h2>
          <h3>#{selectedPokemon.id}</h3>
        </div>

        <div className="pokemon-details-second">

          <p>Height: {selectedPokemon.height}</p>
          <p>Weight: {selectedPokemon.weight}</p>

          {selectedPokemon.stats.map((stat, index) => (
            <div key={index}>
              <p>
                {stat.stat.name}: {stat.base_stat}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="pokemon-details-third">
        <div className="section">
          <h2>Types</h2>
          {selectedPokemon.types.map((type, index) => (
            <div key={index}>
              <h3>{type.type.name}</h3>
            </div>
          ))}
        </div>

        <div className="section">
          <h2>Abilities</h2>
          {selectedPokemon.abilities.map((ability, index) => (
            <div key={index}>
              <h3>{ability.ability.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </>
    )
  }


  return (<>
    <div className="App">
      <header className="header">
        <div className="header-content">
          <img alt="react logo" className="logo" src={logo} />
          <div className="search-container">
            <Form>
              <Form.Control
                className="search-box"
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </Form>
          </div>
        </div>
      </header>


      <main>

        <div className="search-filter-heading">
          <h2 className="table-heading">SEARCH & FILTER</h2>
          <button className="add-button-backend" onClick={() => setShowModal(true)}>ADD</button>
        </div>


        {/* For displaying the table  */}
        <div style={{ display: "block" }}>
          <div style={{ display: "flex", justifyContent: "center", marginLeft: "20px", marginRight: "20px", border: "all" }}>
            {/* Table container with internal scrolling */}
            <div className="pokemon-table-container">
              <table className="pokemon-table">
                <thead>
                  <tr>
                    <th>Sr. No</th>
                    <th>Name
                      {/* Sort buttons */}
                      &emsp;
                      <button onClick={() => handleSortOrder("asc")} style={{ fontSize: "20px" }}>
                        <AiOutlineSortAscending />
                      </button>
                      <button onClick={() => handleSortOrder("desc")} style={{ fontSize: "20px" }}>
                        <AiOutlineSortDescending />
                      </button>
                    </th>
                    <th>URL</th>
                    <th>BIN</th>
                  </tr>
                </thead>
                <tbody>{tableRows}</tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination outside the scrollable container */}
        <div className="pagination">
          {renderPaginationButtons()}
        </div>

        {/* Total items display */}
        <div className="total-items" style={{ color: "red", textAlign: "left", marginLeft: "50px", marginTop: "20px", marginBottom: "20px", fontWeight: "bold" }}>
          Total {filteredPokemonList.length} of {pokemonList.length} items
        </div>

      </main>
    </div>

    {showModal && (
      <div className="App">
        {/* Button to open modal */}
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add Pokémon
        </Button>

        {/* React-Bootstrap Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add New Pokémon</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="pokemonName">
                <Form.Control
                  type="text"
                  placeholder="Name"
                  value={newPokemonName}
                  onChange={(e) => setNewPokemonName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="pokemonURL" className="mt-3">
                <Form.Control
                  type="text"
                  placeholder="URL"
                  value={newPokemonURL}
                  onChange={(e) => setNewPokemonURL(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={addPokemon}>
              Add Pokémon
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )}
  </>
  );
}

export default App;
