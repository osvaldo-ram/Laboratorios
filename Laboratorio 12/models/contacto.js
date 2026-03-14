const fs = require('fs');
const path = require('path');

const dataDirectory = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDirectory, 'contactos.txt');

function ensureDataFile() {
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }

  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, '[]');
  }
}

function readContacts() {
  ensureDataFile();

  try {
    const fileContent = fs.readFileSync(dataFile, 'utf8');
    const contacts = JSON.parse(fileContent);
    return Array.isArray(contacts) ? contacts : [];
  } catch (error) {
    return [];
  }
}

function saveContacts(contacts) {
  ensureDataFile();
  fs.writeFileSync(dataFile, JSON.stringify(contacts, null, 2));
}

function getAll() {
  return readContacts();
}

function getById(id) {
  const contacts = readContacts();
  return contacts.find((contact) => contact.id === id);
}

function create(contactData) {
  const contacts = readContacts();
  const newContact = {
    id: Date.now().toString(),
    nombre: contactData.nombre,
    telefono: contactData.telefono,
    correo: contactData.correo,
    ciudad: contactData.ciudad,
    notas: contactData.notas,
  };

  contacts.push(newContact);
  saveContacts(contacts);

  return newContact;
}

module.exports = {
  getAll,
  getById,
  create,
};
