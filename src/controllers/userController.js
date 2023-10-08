const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config()
const secretKey = process.env.SECRET_KEY;
// const users = require("../data/users"); // Simulando um "banco de dados" de usuários

const users = [];
let userIdCounter = 1;

exports.signup = async (req, res) => {
    const { username, password, dateOfBirth, hobbies } = req.body;

    // Verifica se o usuário já existe
    if (users.some((user) => user.username === username)) {
        return res.status(400).json({ message: "Usuário já cadastrado" });
    }

    // Gera um ID único para o novo usuário
    const userId = userIdCounter++;

    // Calcula a idade com base na data de nascimento
    const dob = new Date(dateOfBirth);
    const today = new Date();
    const age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria um novo usuário com ID único e as novas propriedades
    const newUser = {
        id: userId,
        username,
        password: hashedPassword,
        dateOfBirth,
        age,
        hobbies,
    };
    users.push(newUser);

    res.status(201).json({ message: "Usuário cadastrado com sucesso" });
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    // Encontra o usuário pelo nome de usuário
    const user = users.find((user) => user.username === username);

    if (!user) {
        return res.status(401).json({ message: "Usuário não encontrado" });
    }

    // Verifica a senha
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return res.status(401).json({ message: "Senha incorreta" });
    }

    // Gera um token JWT
    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });

    res.json({ message: "Login bem-sucedido", token });
};

exports.listUsers = (req, res) => {
    const isAdmin = true; // Você deve implementar a verificação real aqui

    if (!isAdmin) {
        return res.status(403).json({ message: "Acesso não autorizado" });
    }

    // Crie uma lista de usuários excluindo a senha
    const usersWithoutPasswords = users.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });

    res.json(usersWithoutPasswords);
};

exports.getUserById = (req, res) => {
    const { id } = req.params; // Obtém o ID a partir dos parâmetros da URL

    // Encontra o usuário pelo ID
    const user = users.find(user => user.id === parseInt(id));

    if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Crie um novo objeto de usuário excluindo a senha
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    res.json(userWithoutPassword);
};

exports.updateUser = async (req, res) => {
    const { id } = req.params; // Obtém o ID a partir dos parâmetros da URL
    const { username, password, dateOfBirth, age, hobbies } = req.body;

    // Encontra o usuário pelo ID
    const user = users.find((user) => user.id === parseInt(id));

    if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Atualiza as propriedades do usuário com os novos valores
    if (username) user.username = username;
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
    }
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (age) user.age = age;
    if (hobbies) user.hobbies = hobbies;

    res.json({ message: "Informações do usuário atualizadas com sucesso" });
};

exports.deleteUser = (req, res) => {
    const { id } = req.params; // Obtém o ID a partir dos parâmetros da URL

    // Encontra o índice do usuário pelo ID
    const userIndex = users.findIndex((user) => user.id === parseInt(id));

    if (userIndex === -1) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Remove o usuário da lista
    users.splice(userIndex, 1);

    res.json({ message: "Usuário removido com sucesso" });
};