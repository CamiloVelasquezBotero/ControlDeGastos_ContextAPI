export function formatCurrency(amount:number) { /* Funcion para mostrar dependiendo a la moneda */
    return new Intl.NumberFormat('en-US', {
        style: 'currency', 
        currency:'USD'
    }).format(amount)
}

export function formatDate(dateStr:string) : string{ /* Tomaremos un parametro de tipo (String) y retornara un valor de tipo (String) */
    const dateObj = new Date(dateStr)
    const options:Intl.DateTimeFormatOptions = { /* Le especificamos el type para que (ts) no no lo influya como string todos por default */
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return new Intl.DateTimeFormat('es-Es', options).format(dateObj) /* Se retorna la fecha ya formateada */
}