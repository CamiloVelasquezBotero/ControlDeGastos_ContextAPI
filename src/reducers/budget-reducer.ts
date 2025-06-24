import { v4 as uuidv4 } from 'uuid'
import type { Category, DraftExpense, Expense } from "../types"

export type BudgetActions = 
    { type: 'add-budget', payload: {budget: number} } |
    { type: 'show-modal' } |
    { type: 'close-modal' } |
    { type: 'add-expense', payload: {expense: DraftExpense} } |
    { type: 'remove-expense', payload: {id: Expense['id']} } |
    { type: 'get-expense-by-id', payload: {id: Expense['id']} } |
    { type: 'updated-expense', payload: {expense: Expense} } | /* Creamos un type nuevo ya que  'add-expense' es de tipo 'draftExpense' lo cual ya tenemos el id generado */
    { type: 'reset-app' } |
    { type: 'add-filter-category', payload: {id: Category['id']} }

export type BudgetState = {
    budget: number,
    modal: boolean,
    expenses: Expense[],
    editingId: Expense['id'],
    currentCategory: Category['id']
}

// GET LOCALSTORAGE
const initialBudget = () : number => {
    const localStorageBudget = localStorage.getItem('budget')
    return localStorageBudget ? +localStorageBudget : 0 /* Lo retornamos como number */
}
const initialExpenses = () : Expense[] => {
    const localStorageExpenses = localStorage.getItem('expenses')
    return localStorageExpenses ? JSON.parse(localStorageExpenses) : []
}

export const initialState:BudgetState = {
    budget: initialBudget(),
    modal: false,
    expenses: initialExpenses(),
    editingId: '',
    currentCategory: ''
}

const createExpense = (draftExpense:DraftExpense) : Expense => { /* Reciviremos un (DraftExpense) pero retornara un (Expense) */
    return {
        ...draftExpense,
        id: uuidv4() /* Le creamos el id */
    }
}

export const budgetReducer = (state:BudgetState = initialState, action:BudgetActions) => {
    if(action.type === 'add-budget') {
        return {
            ...state,
            budget: action.payload.budget
        }
    }
    if(action.type === 'show-modal') {
        return {
            ...state,
            modal: true
        }
    }
    if(action.type === 'close-modal') {
        return {
            ...state,
            modal: false,
            editingId: '' /* Reiniciamos en caso de que el usuario se arrepienta y cierre el modal, para que no quede activo... */
        }
    }
    if(action.type === 'add-expense') {
        const expense = createExpense(action.payload.expense)
        return{
            ...state,
            expenses: [...state.expenses, expense],
            modal: false
        }
    }
    if(action.type === 'remove-expense') {
        return{
            ...state,
            expenses: state.expenses.filter(expense => expense.id !== action.payload.id)
        }
    }
    if(action.type === 'get-expense-by-id') {
        return {
            ...state,
            editingId: action.payload.id,
            modal: true
        }
    }
    if(action.type === 'updated-expense') {
        return {
            ...state,
            expenses: state.expenses.map(expense => expense.id === action.payload.expense.id ? 
                action.payload.expense : expense), /* Si lo encuentra, devuelve el actualizado, caso contrario, devolvemos los que ya estan */
            modal: false,
            editingId: ''
        }
    }
    if(action.type === 'reset-app') {
        return {
            ...state,
            budget: 0,
            expenses: []
        }
    }
    if(action.type === 'add-filter-category') {
        return {
            ...state,
            currentCategory: action.payload.id
        }
    }

    return state
}