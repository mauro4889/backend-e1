"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const process_1 = require("process");
const prompts_1 = require("prompts");
const fs_1 = require("./fs");
const fs_2 = require("fs");
class Expense {
    constructor({ name, price, description }) {
        this.ID = JSON.parse((0, fs_2.readFileSync)(fs_1.DATABASE_EXPENSES).toString()).length + 1;
        this.name = name;
        this.price = price;
        this.description = description;
    }
}
const addExpense = (expense) => __awaiter(void 0, void 0, void 0, function* () {
    const expenses = yield getExpenses();
    expenses.push(expense);
    yield (0, fs_1.writeExpenseFile)(expenses);
});
const getExpenses = () => __awaiter(void 0, void 0, void 0, function* () {
    const expenses = yield (0, fs_1.readExpensesFile)();
    return JSON.parse(expenses);
});
const createExpense = (expense) => __awaiter(void 0, void 0, void 0, function* () {
    const expenses = yield getExpenses();
    expenses.push(expense);
    yield (0, fs_1.writeExpenseFile)(expenses);
    return expenses;
});
const getExpense = (ID) => __awaiter(void 0, void 0, void 0, function* () {
    const expenses = yield getExpenses();
    return expenses.find((expense) => expense.ID === ID);
});
const deleteExpense = (ID) => __awaiter(void 0, void 0, void 0, function* () {
    const expenses = yield getExpenses();
    const newExpenses = expenses.filter((expense) => expense.ID !== ID);
    return (0, fs_1.writeExpenseFile)(newExpenses);
});
const updateExpense = (ID, price) => __awaiter(void 0, void 0, void 0, function* () {
    const expenses = yield getExpenses();
    const expense = expenses.find((exp) => exp.ID === ID);
    if (!expense)
        return console.log('No se encontro gasto con ese error');
    const index = expenses.indexOf(expense);
    expenses[index] = Object.assign(Object.assign({}, expense), { price });
    yield (0, fs_1.writeExpenseFile)(expenses);
});
const cli = new commander_1.Command();
cli.name('nucba-back').description('CLI e1').version('1.0.0');
cli
    .command('hola')
    .description('primer comando en cli')
    .action(() => {
    console.log(chalk_1.default.red('hola cli'));
});
cli
    .command('gastos')
    .description('Administracion de gastos via CLI')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    const { action } = yield (0, prompts_1.prompt)({
        type: 'select',
        name: 'action',
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
    });
    switch (action) {
        case 'C':
            const { name } = yield (0, prompts_1.prompt)({
                type: 'text',
                name: 'name',
                message: chalk_1.default.yellow('Ingresa el nombre del gasto')
            });
            const { price } = yield (0, prompts_1.prompt)({
                type: 'text',
                name: 'price',
                message: chalk_1.default.yellow('Ingresa el precio')
            });
            const { description } = yield (0, prompts_1.prompt)({
                type: 'text',
                name: 'description',
                message: chalk_1.default.yellow('Ingresa descripcion del gasto')
            });
            try {
                yield createExpense(new Expense({
                    name,
                    price,
                    description,
                }));
                return console.log(chalk_1.default.green('Gasto agregado con exito!'));
            }
            catch (error) {
                return console.log(chalk_1.default.red('Error al agregar gasto'));
            }
        case 'R':
            const data = yield getExpenses();
            return console.table(data);
        case 'U':
            const { ID } = yield (0, prompts_1.prompt)({
                type: 'number',
                name: 'ID',
                message: chalk_1.default.yellow('Ingresa el id del gasto a modificar')
            });
            try {
                const exist = yield getExpense(ID);
                if (!exist)
                    console.log(chalk_1.default.red('No se encontro gastos con ese ID'));
                const { newPrice } = yield (0, prompts_1.prompt)({
                    type: 'number',
                    name: 'newPrice',
                    message: 'Ingresa el nuevo importe',
                });
                yield updateExpense(ID, newPrice);
                return console.log(chalk_1.default.green('Gasto modificado con exito :)'));
            }
            catch (error) {
                return console.log(chalk_1.default.red(error));
            }
        case 'D':
            try {
                const { ID } = yield (0, prompts_1.prompt)({
                    type: 'number',
                    name: 'ID',
                    message: chalk_1.default.yellow('Ingrese el ID del gasto que desea eliminar')
                });
                yield deleteExpense(ID);
                console.log(chalk_1.default.green('Gasto eliminado satisfactoriamente'));
            }
            catch (error) {
                console.log(chalk_1.default.red('Error al eliminar el gasto'));
            }
    }
}));
cli.parse(process_1.argv);
