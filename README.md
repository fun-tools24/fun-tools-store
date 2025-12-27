# @fun-tools/store

> A simple and lightweight state management library for React apps

[![npm version](https://img.shields.io/npm/v/@fun-tools/store.svg)](https://www.npmjs.com/package/@fun-tools/store)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 📋 What is @fun-tools/store?

`@fun-tools/store` is an easy-to-use state management library for React. Think of it as a smarter way to share data between your components without the complexity of Redux or other heavy tools.

**Perfect for beginners and experienced developers alike!**

## ✨ Why Choose @fun-tools/store?

- ✅ **Super Easy to Learn** - Get started in minutes, not hours
- ✅ **Automatic Features** - Get built-in functions for free (no need to write repetitive code)
- ✅ **TypeScript Friendly** - Get helpful suggestions as you type
- ✅ **Very Small** - Won't bloat your app size
- ✅ **Fast Performance** - Components only update when they need to
- ✅ **Works Everywhere** - React, React Native, and Next.js

## 📦 Installation

Choose your favorite package manager:

```bash
npm install @fun-tools/store
```

## 🚀 Quick Start - Your First Store

Let's create a simple counter in 3 easy steps:

### Step 1: Create Your Store

```tsx
import { createStore } from "@fun-tools/store";

// Create a store with initial values
const counterStore = createStore({
  states: {
    count: 0, // Our counter starts at 0
  },
});
```

### Step 2: Use It in a Component

```tsx
function Counter() {
  // Get the count value
  const count = counterStore.useStore((state) => state.count);

  // Get the handlers (functions to change the state)
  const handlers = counterStore.useHandlers();

  return (
    <div>
      <h1>Count: {count}</h1>
      {/* Set count to a specific number */}
      <button onClick={() => handlers.count.set(10)}>Set to 10</button>
      {/* Increment using current value */}
      <button onClick={() => handlers.count.set((prev) => prev + 1)}>
        Add 1
      </button>
      {/* Reset to initial value (0) */}
      <button onClick={() => handlers.count.reset()}>Reset</button>
    </div>
  );
}
```

That's it! You have a working counter. 🎉

## 📖 Core Concepts

### 1. Creating a Store

A store is where you keep your app's data. It's like a box that holds all your values.

```tsx
const myStore = createStore({
  states: {
    // Put all your data here
    userName: "John",
    age: 25,
    isLoggedIn: false,
  },
});
```

### 2. Reading Data from the Store

Use `useStore` to read data in your components:

```tsx
function MyComponent() {
  // Method 1: Get one value
  const userName = myStore.useStore((state) => state.userName);

  // Method 2: Get multiple values
  const { userName, age } = myStore.useStore((state) => ({
    userName: state.userName,
    age: state.age,
  }));

  return (
    <div>
      Hello, {userName}! You are {age} years old.
    </div>
  );
}
```

### 3. Changing Data (Using Handlers)

Handlers are functions that change your data. The library creates them automatically!

```tsx
function MyComponent() {
  const handlers = myStore.useHandlers();

  // Change the userName
  handlers.userName.set("Jane");

  // Reset to initial value
  handlers.userName.reset();
}
```

## 🎨 Auto-Generated Handlers

The best part? You get **FREE handlers** based on your data type!

### For Simple Values (String, Number)

```tsx
const store = createStore({
  states: {
    name: "John",
    age: 25,
  },
});

const handlers = store.useHandlers();

// ✅ Set to a new value
handlers.name.set("Jane");
handlers.age.set(26);

// ✅ Set using current value
handlers.age.set((currentAge) => currentAge + 1);

// ✅ Reset to initial value
handlers.name.reset(); // Back to "John"
handlers.age.reset(); // Back to 25
```

### For Boolean (True/False)

```tsx
const store = createStore({
  states: {
    isOpen: false,
    isDarkMode: true,
  },
});

const handlers = store.useHandlers();

// ✅ Toggle (switch between true/false)
handlers.isOpen.toggle();

// ✅ Set to specific value
handlers.isDarkMode.set(false);

// ✅ Reset to initial value
handlers.isOpen.reset();
```

### For Arrays (Lists)

```tsx
const store = createStore({
  states: {
    fruits: ["apple", "banana"],
    numbers: [1, 2, 3],
  },
});

const handlers = store.useHandlers();

// ✅ Add to end
handlers.fruits.push("orange");
// Result: ["apple", "banana", "orange"]

// ✅ Add to beginning
handlers.fruits.unShift("mango");
// Result: ["mango", "apple", "banana", "orange"]

// ✅ Remove from end
handlers.fruits.pop();
// Result: ["mango", "apple", "banana"]

// ✅ Remove from beginning
handlers.fruits.shift();
// Result: ["apple", "banana"]

// ✅ Update item at specific position
handlers.fruits.update(0, "grape");
// Result: ["grape", "banana"]

// ✅ Update item using current value
handlers.numbers.update(1, (current) => current * 2);

// ✅ Remove item at specific position
handlers.fruits.remove(1);
// Result: ["grape"]

// ✅ Set entire array
handlers.fruits.set(["kiwi", "melon"]);

// ✅ Reset to initial value
handlers.fruits.reset();
// Result: ["apple", "banana"]
```

### For Objects

```tsx
const store = createStore({
  states: {
    user: {
      name: "John",
      email: "john@example.com",
      settings: {
        theme: "light",
        notifications: true,
      },
    },
  },
});

const handlers = store.useHandlers();

// ✅ Update single property
handlers.user.update("name", "Jane");

// ✅ Update with current value
handlers.user.update("name", (currentName) => currentName.toUpperCase());

// ✅ Update nested property (use dot notation)
handlers.user.update("settings.theme", "dark");

// ✅ Update multiple properties at once
handlers.user.updateMany({
  name: "Jane",
  email: "jane@example.com",
});

// ✅ Update nested properties
handlers.user.updateMany({
  settings: {
    theme: "dark",
  },
});

// ✅ Set entire object
handlers.user.set({
  name: "Bob",
  email: "bob@example.com",
  settings: { theme: "blue", notifications: false },
});

// ✅ Reset to initial value
handlers.user.reset();
```

## 🔧 Custom Handlers

Sometimes you need custom logic. Create your own handlers!

### Sync Handlers (Instant Changes)

```tsx
const store = createStore({
  states: {
    count: 0,
    firstName: "John",
    lastName: "Doe",
  },

  // Define your custom handlers here
  syncHandlers: {
    // Handler with no parameters
    increment: (state) => {
      state.count = state.count + 1;
    },

    // Handler with parameters
    incrementBy: (state, amount: number) => {
      state.count = state.count + amount;
    },

    // Handler that changes multiple values
    setFullName: (state, first: string, last: string) => {
      state.firstName = first;
      state.lastName = last;
    },
  },
});

// Use them in components
function MyComponent() {
  const handlers = store.useHandlers();

  return (
    <div>
      <button onClick={() => handlers.increment()}>Add 1</button>
      <button onClick={() => handlers.incrementBy(5)}>Add 5</button>
      <button onClick={() => handlers.setFullName("Jane", "Smith")}>
        Change Name
      </button>
    </div>
  );
}
```

### Async Handlers (For API Calls)

Perfect for fetching data from servers!

```tsx
const store = createStore({
  states: {
    user: null,
    loading: false,
    error: null,
  },

  asyncHandlers: {
    // Fetch user from API
    fetchUser: async (state, userId: string) => {
      // Set loading to true
      state.loading = true;
      state.error = null;

      try {
        // Fetch from API
        const response = await fetch(`https://api.example.com/users/${userId}`);
        const data = await response.json();

        // Update state with data
        state.user = data;
      } catch (err) {
        // Handle errors
        state.error = "Failed to fetch user";
      } finally {
        // Set loading to false
        state.loading = false;
      }
    },
  },
});

// Use in component
function UserProfile() {
  const { user, loading } = store.useStore((state) => ({
    user: state.user,
    loading: state.loading,
  }));
  const handlers = store.useHandlers();

  return (
    <div>
      <button onClick={() => handlers.fetchUser("123")}>Load User</button>
      {loading && <p>Loading...</p>}
      {user && <p>Name: {user.name}</p>}
    </div>
  );
}
```

## 🎁 Using Providers (Scoped Stores)

Sometimes you want a store that only works within a specific part of your app. Use `createStoreProvider`!

```tsx
import { createStoreProvider } from "@fun-tools/store";

// Create a provider
const { Provider, useStore, useHandlers } = createStoreProvider({
  states: {
    theme: "light",
    language: "en",
  },
});

// Wrap part of your app
function App() {
  return (
    <Provider>
      <Header />
      <Content />
    </Provider>
  );
}

// Use in any child component
function Header() {
  const theme = useStore((state) => state.theme);
  const handlers = useHandlers();

  return (
    <button
      onClick={() => handlers.theme.set(theme === "light" ? "dark" : "light")}
    >
      Current theme: {theme}
    </button>
  );
}
```

**The difference:**

- `createStore` = Global (available everywhere)
- `createStoreProvider` = Scoped (only available inside `<Provider>`)

## 💡 Performance Tips

### Only Re-render When Needed

Components only re-render when the data they use changes:

```tsx
// ❌ BAD: Component re-renders on ANY state change
const allState = store.useStore((state) => state);

// ✅ GOOD: Component only re-renders when count changes
const count = store.useStore((state) => state.count);

// ✅ GOOD: Component only re-renders when name or age change
const { name, age } = store.useStore((state) => ({
  name: state.name,
  age: state.age,
}));
```

## 📚 Real-World Examples

### Example 1: Todo App

```tsx
const todoStore = createStore({
  states: {
    todos: [] as Array<{ id: number; text: string; done: boolean }>,
  },

  syncHandlers: {
    addTodo: (state, text: string) => {
      state.todos.push({
        id: Date.now(),
        text: text,
        done: false,
      });
    },

    toggleTodo: (state, id: number) => {
      const todo = state.todos.find((t) => t.id === id);
      if (todo) {
        todo.done = !todo.done;
      }
    },

    deleteTodo: (state, id: number) => {
      state.todos = state.todos.filter((t) => t.id !== id);
    },
  },
});

function TodoApp() {
  const todos = todoStore.useStore((state) => state.todos);
  const handlers = todoStore.useHandlers();
  const [input, setInput] = React.useState("");

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a todo..."
      />
      <button
        onClick={() => {
          handlers.addTodo(input);
          setInput("");
        }}
      >
        Add
      </button>

      {todos.map((todo) => (
        <div key={todo.id}>
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => handlers.toggleTodo(todo.id)}
          />
          <span style={{ textDecoration: todo.done ? "line-through" : "none" }}>
            {todo.text}
          </span>
          <button onClick={() => handlers.deleteTodo(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Shopping Cart

```tsx
const cartStore = createStore({
  states: {
    items: [] as Array<{
      id: number;
      name: string;
      price: number;
      quantity: number;
    }>,
    total: 0,
  },

  syncHandlers: {
    addItem: (state, product: { id: number; name: string; price: number }) => {
      // Check if item already exists
      const existing = state.items.find((item) => item.id === product.id);

      if (existing) {
        // Increase quantity
        existing.quantity++;
      } else {
        // Add new item
        state.items.push({ ...product, quantity: 1 });
      }

      // Update total
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },

    removeItem: (state, id: number) => {
      state.items = state.items.filter((item) => item.id !== id);
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});
```

### Example 3: User Authentication

```tsx
const authStore = createStore({
  states: {
    user: null as { id: string; name: string; email: string } | null,
    isAuthenticated: false,
    isLoading: false,
  },

  asyncHandlers: {
    login: async (state, email: string, password: string) => {
      state.isLoading = true;

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        state.user = data.user;
        state.isAuthenticated = true;
      } catch (error) {
        console.error("Login failed:", error);
      } finally {
        state.isLoading = false;
      }
    },

    logout: async (state) => {
      await fetch("/api/logout", { method: "POST" });
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});
```

## 🎓 TypeScript Support

The library works great with TypeScript! You get autocomplete and type safety.

### Defining State Types

```tsx
// Define your state shape
type UserState = {
  name: string;
  age: number;
  email: string;
};

const store = createStore({
  states: {
    count: 0,
    user: {
      name: "John",
      age: 25,
      email: "john@example.com",
    } as UserState,
  },

  syncHandlers: {
    // TypeScript knows the state type!
    updateUser: (state, newUser: UserState) => {
      state.user = newUser;
    },
  },
});

// TypeScript will catch errors
const handlers = store.useHandlers();
handlers.updateUser({
  name: "Jane",
  age: 26,
  // ❌ Error: missing 'email' property
});
```

## ❓ Common Questions

### Q: When should I use a global store vs provider?

**Use Global Store (`createStore`) when:**

- Data is needed across your entire app (like user auth, theme)
- You want simple setup without wrapping components

**Use Provider (`createStoreProvider`) when:**

- Data is only needed in a specific section
- You want better component isolation
- You're building reusable components

### Q: How is this different from useState?

`useState` is great for local component state. Use `@fun-tools/store` when:

- Multiple components need the same data
- You want to avoid prop drilling
- You need more powerful update functions

### Q: Can I use multiple stores?

Yes! Create as many stores as you need:

```tsx
const userStore = createStore({ states: { user: null } });
const cartStore = createStore({ states: { items: [] } });
const themeStore = createStore({ states: { theme: "light" } });
```


## 🔗 Links

- [GitHub Repository](https://github.com/yourusername/ex-store)
- [Report Issues](https://github.com/yourusername/ex-store/issues)
- [NPM Package](https://www.npmjs.com/package/@fun-tools/store)

---

**Made with ❤️ for developers who value simplicity by @Mustak24**

Happy coding! 🚀
