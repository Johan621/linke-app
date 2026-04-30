import db from "./db";
import { createClient } from "./supabase/client";
import { getAllLinks, getAllFolders } from "./store";

const supabase = createClient();

export async function syncData() {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) return false;

  const userId = session.session.user.id;

  try {
    // 1. Push local unsynced folders
    const localFolders = await getAllFolders();
    for (const folder of localFolders) {
      if (!folder.synced) {
        const { error } = await supabase.from("folders").upsert({
          id: folder.id,
          user_id: userId,
          name: folder.name,
          created_at: folder.createdAt,
        });
        if (!error) {
          await db.folders.update(folder.id, { synced: true });
        }
      }
    }

    // 2. Push local unsynced links
    const localLinks = await getAllLinks();
    for (const link of localLinks) {
      if (!link.synced) {
        const { error } = await supabase.from("links").upsert({
          id: link.id,
          user_id: userId,
          folder_id: link.folderId === "default" ? null : link.folderId,
          url: link.url,
          title: link.title,
          description: link.description,
          favicon: link.favicon,
          preview: link.preview,
          tags: link.tags,
          created_at: link.createdAt,
        });
        if (!error) {
          await db.links.update(link.id, { synced: true });
        }
      }
    }

    // 3. Pull remote changes (simplified version)
    const { data: remoteFolders } = await supabase.from("folders").select("*");
    if (remoteFolders) {
      for (const rf of remoteFolders) {
        await db.folders.put({
          id: rf.id,
          name: rf.name,
          createdAt: rf.created_at,
          synced: true,
        });
      }
    }

    const { data: remoteLinks } = await supabase.from("links").select("*");
    if (remoteLinks) {
      for (const rl of remoteLinks) {
        await db.links.put({
          id: rl.id,
          folderId: rl.folder_id || "default",
          url: rl.url,
          title: rl.title,
          description: rl.description,
          favicon: rl.favicon,
          preview: rl.preview,
          tags: rl.tags || [],
          createdAt: rl.created_at,
          synced: true,
        });
      }
    }

    return true;
  } catch (err) {
    console.error("Sync failed:", err);
    return false;
  }
}
