import { Command } from 'commander'
import chalk from 'chalk'
import { argv } from 'process'
import { prompt } from 'prompts'
import { DATABASE_EXPENSES, readExpensesFile, writeExpenseFile } from './fs'
import { readFileSync } from 'fs'





interface Iexpense {
    name: string,
    price: number,
    description: string
}

class Expense {
    ID: number
    name: string
    price: number
    description: string
    constructor({ name, price, description }: Iexpense) {
        this.ID = JSON.parse(readFileSync(DATABASE_EXPENSES).toString()).length + 1
        this.name = name
        this.price = price
        this.description = description


    }
}

const addExpense = async (expense: Expense) => {
    const expenses = await getExpenses()
    expenses.push(expense)

    await writeExpenseFile(expenses)
}


const getExpenses = async () => {
    const expenses = await readExpensesFile()
    return JSON.parse(expenses)
}

const createExpense = async (expense: Expense) => {
    const expenses = await getExpenses()
    expenses.push(expense)
    await writeExpenseFile(expenses)
    return expenses
}

const getExpense = async (ID: number) => {
    const expenses = await getExpenses()
    return expenses.find((expense: Expense) => expense.ID === ID)
}

const deleteExpense = async (ID: number) => {
    const expenses = await getExpenses()

    const newExpenses = expenses.filter((expense: Expense) => expense.ID !== ID)
    return writeExpenseFile(newExpenses)
}

const updateExpense = async (ID: number, price: number) => {
    const expenses = await getExpenses();
    const expense = expenses.find((exp: Expense) => exp.ID === ID);
    if (!expense) return console.log('No se encontro gasto con ese error');

    const index = expenses.indexOf(expense);
    expenses[index] = { ...expense, price };

    await writeExpenseFile(expenses);
};


const cli = new Command()

cli.name('nucba-back').description('CLI e1').version('1.0.0')

cli
    .command('hola')
    .description('primer comando en cli')
    .action(() => {
        console.log(chalk.red('hola cli'))
    })

cli
    .command('gastos')
    .description('Administracion de gastos via CLI')
    .action(async () => {
        const { action } = await prompt({
            type: 'select',
            name: 'action', //hace referencia a la propiedad que va a devolver
            message: '¿Que accion queres hacer con tus gastos?',
            choices: [
                {
                    title: 'Agregar',
                    value: 'C',
                },
                {
                    title: 'Ver listado',
                    value: 'R',
                },
                {
                    title: 'Actualizar gasto',
                    value: 'U',
                },
                {
                    title: 'Eliminar un eliminar',
                    value: 'D',
                },
            ]
        })

        switch (action) {
            case 'C':
                const { name } = await prompt({
                    type: 'text',
                    name: 'name',
                    message: chalk.yellow('Ingresa el nombre del gasto')
                });
                const { price } = await prompt({
                    type: 'text',
                    name: 'price',
                    message: chalk.yellow('Ingresa el precio')
                });
                const { description } = await prompt({
                    type: 'text',
                    name: 'description',
                    message: chalk.yellow('Ingresa descripcion del gasto')
                });
                try {
                    await createExpense(
                        new Expense({
                            name,
                            price,
                            description,
                        })
                    )
                    return console.log(chalk.green('Gasto agregado con exito!'));
                } catch (error) {
                    return console.log(chalk.red('Error al agregar gasto'))
                }

            case 'R':
                const data = await getExpenses()
                return console.table(data)

            case 'U':
                const { ID } = await prompt({
                    type: 'number',
                    name: 'ID',
                    message: chalk.yellow('Ingresa el id del gasto a modificar')
                })
                try {
                    const exist = await getExpense(ID);
                    if (!exist) console.log(chalk.red('No se encontro gastos con ese ID'));

                    const { newPrice } = await prompt({
                        type: 'number',
                        name: 'newPrice',
                        message: 'Ingresa el nuevo importe',
                    });

                    await updateExpense(ID, newPrice);
                    return console.log(chalk.green('Gasto modificado con exito :)'));
                } catch (error) {
                    return console.log(chalk.red(error));
                }

            case 'D':
                try {
                    const { ID } = await prompt({
                        type: 'number',
                        name: 'ID',
                        message: chalk.yellow('Ingrese el ID del gasto que desea eliminar')
                    })
                    await deleteExpense(ID)
                    console.log(chalk.green('Gasto eliminado satisfactoriamente'))
                } catch (error) {
                    console.log(chalk.red('Error al eliminar el gasto'))
                }

        }

    })

cli.parse(argv)