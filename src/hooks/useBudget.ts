import { useContext } from 'react'
import { BudgetContext } from '../context/BudgetContext'

export const useBudget = () => {
    const context = useContext(BudgetContext)
    if(!context) {
        throw new Error('useBudget must be use whitin a BudgetProvider') /* En caso de que no se ponga como padre el provider a la aplicacion que se vaya a renderizar */
    }
    return context
}