import { db } from "../../utils/firebase";  // ✅ Firestore のインスタンスを取得
import { doc, deleteDoc } from "firebase/firestore";
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "ID is required" });
  }

  try {
    await deleteDoc(doc(db, "todos", id));
    return { message: "Todo deleted successfully" };
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: "Failed to delete todo" });
  }
  // TODO
});
