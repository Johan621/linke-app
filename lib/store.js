import { v4 as uuidv4 } from "uuid";
import db from "./db";

/* ─── Links ─── */

export async function getAllLinks() {
  return db.links.orderBy("createdAt").reverse().toArray();
}

export async function getLinksByFolder(folderId) {
  if (!folderId || folderId === "all") return getAllLinks();
  return db.links
    .where("folderId")
    .equals(folderId)
    .reverse()
    .sortBy("createdAt");
}

export async function searchLinks(query) {
  const q = query.toLowerCase();
  const all = await getAllLinks();
  return all.filter(
    (link) =>
      link.title?.toLowerCase().includes(q) ||
      link.description?.toLowerCase().includes(q) ||
      link.url?.toLowerCase().includes(q) ||
      link.tags?.some((t) => t.toLowerCase().includes(q))
  );
}

export async function addLink(linkData) {
  const link = {
    id: uuidv4(),
    url: linkData.url,
    title: linkData.title || "",
    description: linkData.description || "",
    favicon: linkData.favicon || "",
    preview: linkData.preview || null,
    folderId: linkData.folderId || "default",
    tags: linkData.tags || [],
    createdAt: new Date().toISOString(),
    synced: false,
  };
  await db.links.add(link);
  return link;
}

export async function updateLink(id, changes) {
  await db.links.update(id, changes);
  return db.links.get(id);
}

export async function deleteLink(id) {
  await db.links.delete(id);
}

export async function bulkDeleteLinks(ids) {
  await db.links.bulkDelete(ids);
}

/* ─── Folders ─── */

export async function getAllFolders() {
  return db.folders.orderBy("createdAt").toArray();
}

export async function addFolder(name) {
  const folder = {
    id: uuidv4(),
    name,
    createdAt: new Date().toISOString(),
  };
  await db.folders.add(folder);
  return folder;
}

export async function renameFolder(id, newName) {
  await db.folders.update(id, { name: newName });
}

export async function deleteFolder(id) {
  // Move links in this folder to "default"
  const linksInFolder = await db.links.where("folderId").equals(id).toArray();
  for (const link of linksInFolder) {
    await db.links.update(link.id, { folderId: "default" });
  }
  await db.folders.delete(id);
}

export async function getFolderCounts() {
  const links = await getAllLinks();
  const counts = { all: links.length, default: 0 };
  for (const link of links) {
    const fid = link.folderId || "default";
    counts[fid] = (counts[fid] || 0) + 1;
  }
  return counts;
}

/* ─── Tags ─── */

export async function getAllTags() {
  const links = await getAllLinks();
  const tagMap = {};
  for (const link of links) {
    if (link.tags) {
      for (const tag of link.tags) {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      }
    }
  }
  return Object.entries(tagMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/* ─── Seed default folders ─── */
export async function seedDefaults() {
  const count = await db.folders.count();
  if (count === 0) {
    const defaults = ["Development", "Design", "Learning", "Career", "Personal"];
    for (const name of defaults) {
      await addFolder(name);
    }
  }
}
