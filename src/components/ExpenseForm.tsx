import { useEffect, useState } from "react";
import type { DraftExpense, Value } from "../types";
import { categories } from "../data/categories";
import DatePicker from 'react-date-picker'; /* https://www.npmjs.com/package/react-date-picker  Utilizamos esta libreria*/
import 'react-calendar/dist/Calendar.css' /* https://github.com/wojtekmaj/react-calendar/blob/v3.x/README.md Utilizamos react-calendar para complementar */
import 'react-date-picker/dist/DatePicker.css'
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";

export default function ExpenseForm() {
  const [expense, setExpense] = useState<DraftExpense>({ /* Generic para establecerle su type */
    amount: 0,
    expenseName: '',
    category: '',
    date: new Date() /* Creamos la fecha actual */
  })
  const [error, setError] = useState('')
  const [previouesAmount, setPreviousAmount] = useState(0)
  const { dispatch, state, remainingBudget } = useBudget()

  useEffect(() => {
    if(state.editingId) {
      const editingExpense = state.expenses.filter(expense => expense.id === state.editingId)[0]
      setExpense(editingExpense) /* Seteamos el que vamos a editar */
      setPreviousAmount(editingExpense.amount)
    }
  }, [state.editingId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { /* Puede ser input o select */
    const {name, value} = e.target
    const isAmountField = ['amount'].includes(name) /* Verificamos si estamos escribiendo en Amount para poder convertirlo en number */
    setExpense({
      ...expense, /* Copiamos los que ya tenemos */
      [name]: isAmountField ? +value : value /* Si escribimos en Amount, convertimos a numero de lo contrario escribimos en string normal */
    })
  }
  const handleChangeDate = (value:Value) => {
    setExpense({
      ...expense,/* Copia del state */
      date: value /* Modificamos solo la fecha */
    })
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(Object.values(expense).includes('') || expense.date === null || expense.amount <= 0) { /* Utilizamos metodo especial para objetos para verificar si alguno de los values esta vacio */
      setError('Todos los campos son obligatorios')
      return 
    }

    /* VALIDAMOS PARA NO PASARNOS DEL LIMITE */
    if((expense.amount - previouesAmount) > remainingBudget) {
      setError(`¡Este gasto se sale del presupuesto! Disponible: ${remainingBudget + previouesAmount}`)
      return
    }

    /* Agregamos o Actualizamos el gasto */
    if(state.editingId) { /* Actualizamos */
      dispatch({type: 'updated-expense', payload: {expense: {id: state.editingId, ...expense}}}) /* El id sera elq eu tenemos en el state que estamos editando y le ponemos una copia del que tenemos en el actual state */
    } else {/* Agregamos Nuevo */
      dispatch({type: 'add-expense', payload: {expense}}) /* Agregamos el nuevo (expense) */
    }

    setError('') /* Reiniciamos el error */
    setExpense({ /* Reiniciamos el state del form */
      amount: 0,
      expenseName: '',
      category: '',
      date: new Date() /* Creamos la fecha actual */
    })
    setPreviousAmount(0) /* Reiniciamos el disponible */
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <legend
        className="uppercase text-center text-2xl font-black border-b-4 py-2 border-blue-500"
      >{state.editingId ? 'Actualizar Gasto' : 'Nuevo Gasto'}</legend>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <div className="flex flex-col gap-2">
        <label htmlFor="expenseName" className="text-xl">Nombre Gasto:</label>
        <input 
          type="text" 
          id="expenseName"
          placeholder="Añade el nombre del gasto"
          className="bg-slate-100 p-2"
          name="expenseName"
          value={expense.expenseName}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-xl">Cantidad:</label>
        <input 
          type="number" 
          id="amount"
          placeholder="Añade la cantidad del gasto: Ej. 300"
          className="bg-slate-100 p-2"
          name="amount"
          value={expense.amount}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="text-xl">Categoria:</label>
        <select 
          id="category"
          className="bg-slate-100 p-2"
          name="category"
          value={expense.category}
          onChange={handleChange}
        >
          <option value="">-- Seleccione --</option>
          {categories.map(category => (
            <option 
              key={category.id}
              value={category.id}
            >{category.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-xl">Fecha Gasto:</label>
        <DatePicker /* Utilizamos el Dateicker https://www.npmjs.com/package/react-date-picker */
          className='bg-salte-100 p-2 border-0'
          value={expense.date}
          onChange={handleChangeDate}
        />
      </div>
      
      <input 
        type="submit" 
        className='bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg'
        value={state.editingId ? 'Guardar Cambios' : 'Registrar Gasto'}
      />
    </form>
  ) 
}
