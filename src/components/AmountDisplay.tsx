import { formatCurrency } from "../helpers"

type AmountDisplayProps = {
    label?: string, /* Le decimos con el (?) 'Si si exsite... agregale este type' */
    amount: number
}

export default function AmountDisplay({label, amount}:AmountDisplayProps) {
  return (
    <p className="text-2xl text-blue-600 font-bold">
        {label && `${label}: `}
        <span className="font-black text-black">{formatCurrency(amount)}</span>
    </p>
  )
}
