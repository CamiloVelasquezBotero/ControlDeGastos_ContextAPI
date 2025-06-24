import { useReducer, createContext, type ReactNode, useMemo } from 'react'
import { budgetReducer, initialState } from '../reducers/budget-reducer'
import type { BudgetActions, BudgetState } from '../reducers/budget-reducer'

type BudgetContextProps = {
    state: BudgetState
    dispatch: React.ActionDispatch<[action: BudgetActions]>,
    totalExpenses: number,
    remainingBudget: number
}

type BudgetProviderProps = {
    children: ReactNode /* Se importa para darle el type */
}

export const BudgetContext = createContext<BudgetContextProps>(null!) /* Con este parametro  se le dice a typescript que se sabe lo que se hace */
/* createContext<BudgetContextProps>({} as BudgetContextProps) Se puede usar asi tambien para evitar el error */

export const BudgetProvider = ({children}:BudgetProviderProps) => { /* El provider es de donde vienen los datos */

    const [state, dispatch] = useReducer(budgetReducer, initialState)

    const totalExpenses = useMemo(() => state.expenses.reduce((total, expense) => expense.amount + total, 0), [state.expenses])
    const remainingBudget = state.budget - totalExpenses

    return (
        <BudgetContext.Provider
            value={{
                state,
                dispatch,
                totalExpenses,
                remainingBudget
            }}
        > {/* Esto envolvera toda nuestra app de react para tener nuestro context en toda la app, por esto lo pasamos como un componente con su caracteristica Provider */}
            {children}
        </BudgetContext.Provider>
    )
}