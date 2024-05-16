import React from 'react';
import { useState, useEffect } from 'react';
import api from '../api';
import Expense from '../components/Expense';
import '../styles/Home.css';

function Home() {
  const [expenses, setExpenses] = useState([]);
  const [cost, setCost] = useState(0);
  const [title, setTitle] = useState('');
  const [isAscending, setIsAscending] = useState(true);
  const [searchExpenses, setSearchExpenses] = useState([]);

  const [textFilter, setTextFilter] = useState('');

  useEffect(() => {
    getExpenses();
  }, []);

  const getExpenses = () => {
    api
      .get('/api/expenses/')
      .then((res) => res.data)
      .then((data) => {
        setExpenses(data), setSearchExpenses(expenses);
      })
      .catch((err) => alert(err));
  };

  const deleteExpense = (id) => {
    api
      .delete(`/api/expenses/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert('expense deleted');
        else alert('failed to delete expense');
        getExpenses();
      })
      .catch((error) => alert(error));
  };

  const createExpense = (e) => {
    e.preventDefault();
    api
      .post('/api/expenses/', { cost, title })
      .then((res) => {
        if (res.status === 201) alert('expense created');
        else alert('failed to make expense');
        getExpenses();
      })
      .catch((err) => {
        alert(err), console.log('its over');
      });
  };

  const sortExpenses = () => {
    const sourceExpenses = searchExpenses ? [...searchExpenses] : [...expenses];
    const sortedExpenses = sourceExpenses.sort((a, b) =>
      isAscending ? a.cost - b.cost : b.cost - a.cost
    );
    setSearchExpenses(sortedExpenses);
    setIsAscending(!isAscending);
  };

  const Search = (text) => {
    const terms = [...expenses];

    setSearchExpenses(
      terms.filter((expense) =>
        expense.title.toLowerCase().includes(text.toLowerCase())
      )
    );
    setTextFilter(text);
  };

  return (
    <div className="container">
      <form onSubmit={createExpense}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <br />
        <label htmlFor="cost">Cost:</label>

        <input
          type="number"
          id="cost"
          required
          name="cost"
          onChange={(e) => setCost(e.target.value)}
          value={cost}
        />

        <br />
        <input type="submit" value="Submit" />
      </form>
      <div className="expenses-container">
        <div>
          <h2>Expenses</h2>
          <input
            className="Search"
            type="text"
            onChange={(e) => Search(e.target.value)}
          />
          <button onClick={() => sortExpenses()}>sort</button>
        </div>

        <div className="expenses">
          {searchExpenses.length > 0
            ? searchExpenses.map((expense) => (
                <Expense
                  expense={expense}
                  onDelete={deleteExpense}
                  key={expense.id}
                />
              ))
            : expenses.map((expense) => (
                <Expense
                  expense={expense}
                  onDelete={deleteExpense}
                  key={expense.id}
                />
              ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
