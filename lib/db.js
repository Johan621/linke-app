import Dexie from "dexie";

const db = new Dexie("LinkeDB");

db.version(1).stores({
  links: "id, url, title, folderId, createdAt, synced, *tags",
  folders: "id, name, createdAt",
  tags: "id, name",
});

export default db;
