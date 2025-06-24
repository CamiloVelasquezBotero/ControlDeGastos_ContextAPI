import { useMemo } from "react"
import { 
  LeadingActions, 
  SwipeableList, 
  SwipeableListItem, 
  SwipeAction, 
  TrailingActions
} from 'react-swipeable-list' /* Libreria para Deslizar: https://www.npmjs.com/package/react-swipeable-list */
import 'react-swipeable-list/dist/styles.css'; /* Estilos de react-swipeable-list */
import type { Expense } from "../types"
import { categories } from "../data/categories"
import { formatDate } from "../helpers"
import { useBudget } from "../hooks/useBudget";
import AmountDisplay from "./AmountDisplay"

type ExpenseDetailProps = {
    expense: Expense
}

export default function ExpenseDetail({expense}:ExpenseDetailProps) {
  
  const categoryInfo = useMemo(() =>  categories.filter(cat => cat.id === expense.category )[0], [expense])

  const { dispatch } = useBudget()

  const leadingActions = () => ( /* Retornamos componentes... ()*/
    <LeadingActions>
      <SwipeAction
        onClick={() => dispatch({type: 'get-expense-by-id', payload: {id: expense.id}})}
      >
        Actualizar
      </SwipeAction>
    </LeadingActions>
  )
  const trailingActions = () => ( /* Retornamos componentes... ()*/
    <TrailingActions>
      <SwipeAction
        onClick={() => dispatch({type: 'remove-expense', payload: {id: expense.id}})}
        destructive={true} /* Esto solo dara la animacion de eliminar pero no lo elimina */
      > 
        Eliminar
      </SwipeAction>
    </TrailingActions>
  )

  return (
    <SwipeableList>
      <SwipeableListItem
        maxSwipe={1} /* Maximo pixeles que se recorren en al deslizar */
        leadingActions={leadingActions()}
        trailingActions={trailingActions()}
      >
        <div className="bg-white shadow-lg p-5 w-full  border-b border-gray-300 flex gap-5 items-center">
            <div>
              <img src={`/icono_${categoryInfo.icon}.svg`} alt="Icono Categoria" className="w-20"/>
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-sm font-bold uppercase text-slate-500">{categoryInfo.name}</p>
              <p className="first-letter:uppercase">{expense.expenseName}</p>
              <p className="text-slate-600 text-sm">{formatDate(expense.date!.toString())}</p> {/* Como puede ser null le colocamos el (!) para asegurarle a (ts) de que ese valor si va a existir */}
            </div>
            <AmountDisplay
              amount={expense.amount}
            />
        </div>
      </SwipeableListItem>
    </SwipeableList>
  )
}
