import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const url = 'https://restcountries.eu/rest/v2/all'

  useEffect(() => {
    const getAll = async () => {
      const response = await axios.get(url)
      return response.data
    }
    getAll()
      .then(allCountries => setCountries(allCountries))
  }, [])

  if (name !== filter) {
    setFilter(name)
    const filteredCountry = countries.find(country => {
      return country.name.toLowerCase() === name.toLowerCase()
    })
    if (filteredCountry) {
      setCountry({
          found: true,
          data: filteredCountry
      })
    } else {
      setCountry({
        found: false
      })
    }
  }

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.data.name} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div>
      <img src={country.data.flag} height='100' alt={`flag of ${country.data.name}`}/>
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App
