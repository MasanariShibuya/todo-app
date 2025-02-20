// サーバー側の型定義とグローバル変数の初期化
interface Todo {
    id: number;
    text: string;
    done: boolean;
  }
  
  declare global {
    var todos: Todo[];
  }
  
  globalThis.todos = globalThis.todos || [];
  
  // API ハンドラー
  export default defineEventHandler(async (event) => {
    const method = event.req.method;
  
    // GET: 全TODOリストの取得
    if (method === "GET") {
      return globalThis.todos;
    }
    
    // POST: 新しいTODOの追加
    if (method === "POST") {
      const body = await readBody(event);
      const newTodo: Todo = {
        id: Date.now(),
        text: body.text,
        done: false,
      };
      globalThis.todos.push(newTodo);
      return newTodo;
    }
    
    return { error: "Method not allowed on /api/todos" };
  });
  