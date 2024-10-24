import React, { useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [fetchedData, setFetchedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    // Build query parameters
    const queryParams = [];
    if (name) queryParams.push(`name=${encodeURIComponent(name)}`);
    if (id) queryParams.push(`id=${encodeURIComponent(id)}`);
    if (age) queryParams.push(`age=${encodeURIComponent(age)}`);
    if (address) queryParams.push(`address=${encodeURIComponent(address)}`);

    const queryString = queryParams.join('&');

    if (!queryString) {
      setErrorMessage("Please enter at least one field");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`https://psz5tpyfx4.execute-api.us-east-1.amazonaws.com/dev/items?${queryString}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log('Fetched result:', result);

      // Update state with fetched data (the whole array)
      setFetchedData(result); // Set fetchedData to the result directly
      setName('');
      setId('');
      setAge('');
      setAddress('');
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("Error fetching data. Please try again later.");
      setFetchedData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Enter a field (name, id, age, or address) to search for data:</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
          />
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter ID"
          />
          <input
            type="text"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter age"
          />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
          />
          <button type="submit">Search</button>
        </form>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        <div>
          <h3>Fetched Data:</h3>
          {loading ? (
            <p>Loading...</p>
          ) : fetchedData ? (
            <div>
              {Array.isArray(fetchedData) && fetchedData.length > 0 ? (
                fetchedData.map((item) => (
                  <div key={item.id}>
                    <p>ID: {item.id}</p>
                    <p>Name: {item.name}</p>
                    <p>Age: {item.age}</p>
                    <p>Address: {item.address}</p>
                  </div>
                ))
              ) : (
                <p>No data found or no search performed yet.</p>
              )}
            </div>
          ) : (
            <p>No data found or no search performed yet.</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
