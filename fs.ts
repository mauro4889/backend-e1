import { readFile, writeFile } from "fs/promises"


export const DATABASE_EXPENSES = 'expenses.json'

export const writeExpenseFile = async(data:any) =>{
    await writeFile(DATABASE_EXPENSES, JSON.stringify(data))
    console.log()
    return null
}

export const readExpensesFile = async () =>{
    try {
        const expenses = (await readFile(DATABASE_EXPENSES)).toString()
        return expenses
    } catch (error) {
        await writeExpenseFile([])
        return '[]'
    }
    
}