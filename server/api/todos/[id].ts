// /api/todos/[id].ts
interface Todo {
    id: number;
    text: string;
    done: boolean;
  }
  
  declare global {
    var todos: Todo[];
  }
  
  globalThis.todos = globalThis.todos || [];
  
  export default defineEventHandler(async (event) => {
    const id = Number(event.context.params?.id);
    if (isNaN(id)) {
      return { error: 'Invalid id' };
    }
  
    const method = event.req.method;
    const index = globalThis.todos.findIndex(todo => todo.id === id);
  
    if (index === -1) {
      return { error: 'Todo not found' };
    }
  
    // PATCH: TODO の更新
    if (method === "PATCH") {
      const body = await readBody(event);
      globalThis.todos[index] = { ...globalThis.todos[index], ...body };
      return globalThis.todos[index];
    }
  
    // DELETE: TODO の削除
    if (method === "DELETE") {
      const removed = globalThis.todos.splice(index, 1);
      return removed[0];
    }
  
    return { error: "Method not allowed on /api/todos/:id" };
  });
  