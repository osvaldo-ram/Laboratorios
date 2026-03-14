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

function normalizeContact(contactData) {
  return {
    id: contactData.id,
    nombre: contactData.nombre,
    telefono: contactData.telefono,
    correo: contactData.correo,
    ciudad: contactData.ciudad,
    notas: contactData.notas || '',
    favorito: Boolean(contactData.favorito),
  };
}

function readContacts() {
  ensureDataFile();

  try {
    const fileContent = fs.readFileSync(dataFile, 'utf8');
    const contacts = JSON.parse(fileContent);

    return Array.isArray(contacts) ? contacts.map(normalizeContact) : [];
  } catch (error) {
    return [];
  }
}

function writeContacts(contacts) {
  ensureDataFile();
  fs.writeFileSync(dataFile, JSON.stringify(contacts, null, 2));
}

module.exports = class Contacto {
  constructor({ nombre, telefono, correo, ciudad, notas, favorito = false }) {
    this.id = Date.now().toString();
    this.nombre = nombre;
    this.telefono = telefono;
    this.correo = correo;
    this.ciudad = ciudad;
    this.notas = notas || '';
    this.favorito = favorito;
  }

  save() {
    const contacts = Contacto.fetchAll();
    contacts.push({
      id: this.id,
      nombre: this.nombre,
      telefono: this.telefono,
      correo: this.correo,
      ciudad: this.ciudad,
      notas: this.notas,
      favorito: this.favorito,
    });

    writeContacts(contacts);
  }

  static fetchAll({ favoritosOnly = false } = {}) {
    const contacts = readContacts();

    if (favoritosOnly) {
      return contacts.filter((contact) => contact.favorito);
    }

    return contacts;
  }

  static findById(id) {
    return Contacto.fetchAll().find((contact) => contact.id === id);
  }

  static findByIds(ids = []) {
    const contacts = Contacto.fetchAll();

    return ids
      .map((id) => contacts.find((contact) => contact.id === id))
      .filter(Boolean);
  }

  static toggleFavorite(id) {
    const contacts = Contacto.fetchAll();
    const contactIndex = contacts.findIndex((contact) => contact.id === id);

    if (contactIndex === -1) {
      return null;
    }

    contacts[contactIndex].favorito = !contacts[contactIndex].favorito;
    writeContacts(contacts);

    return contacts[contactIndex];
  }

  static getStats() {
    const contacts = Contacto.fetchAll();
    const favorites = contacts.filter((contact) => contact.favorito).length;

    return {
      total: contacts.length,
      favorites,
    };
  }
};
