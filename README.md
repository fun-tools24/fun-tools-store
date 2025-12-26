# @ex/store

> A lightweight, type-safe external store library for React, React Native, and Next.js

[![npm version](https://img.shields.io/npm/v/@ex/store.svg)](https://www.npmjs.com/package/@ex/store)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 📋 Overview

`@ex/store` is a minimal yet powerful state management solution built on React's `useSyncExternalStore` API. It provides automatic handler generation, TypeScript support, and works seamlessly across React, React Native, and Next.js applications.

## ✨ Features

- **🎯 Type-Safe**: Full TypeScript support with intelligent type inference
- **⚡ Lightweight**: Minimal bundle size with zero dependencies (except React peer dependency)
- **🔄 Auto-Generated Handlers**: Automatic CRUD operations for arrays, objects, and primitives
- **🪝 Custom Handlers**: Define your own sync and async state handlers
- **🎨 Flexible API**: Use as a global store or scoped with React Context
- **📦 Tree-Shakeable**: Only bundle what you use
- **🚀 Performance Optimized**: Built-in shallow equality checks and snapshot caching

## 📦 Installation

```bash
npm install @ex/store
```

```bash
yarn add @ex/store
```

```bash
pnpm add @ex/store
```

## 🚀 Quick Start

### Basic Usage (Global Store)

```tsx
import { createStore } from "@ex/store";

// Define your store
const store = createStore({
  states: {
    count: 0,
    user: { name: "John", age: 25 },
    items: ["apple", "banana"],
  },
});

// Use in components
function Counter() {
  const { count } = store.useStore((state) => ({ count: state.count }));
  const handlers = store.useHandlers();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => handlers.count.set((prev) => prev + 1)}>
        Increment
      </button>
      <button onClick={() => handlers.count.reset()}>Reset</button>
    </div>
  );
}
```

### Context-Based Store (Scoped)

```tsx
import { createStoreProvider } from "@ex/store";

// Create provider
const { Provider, useStore, useHandlers } = createStoreProvider({
  states: {
    theme: "light",
    settings: { notifications: true },
  },
});

// Wrap your app
function App() {
  return (
    <Provider>
      <ThemeToggle />
    </Provider>
  );
}

// Use in child components
function ThemeToggle() {
  const { theme } = useStore((state) => ({ theme: state.theme }));
  const handlers = useHandlers();

  return (
    <button
      onClick={() => handlers.theme.set(theme === "light" ? "dark" : "light")}
    >
      Current: {theme}
    </button>
  );
}
```

## 📖 API Reference

### `createStore(config)`

Creates a global store instance.

**Parameters:**

- `states`: Initial state object
- `syncHandlers?`: Custom synchronous handlers (optional)
- `asyncHandlers?`: Custom asynchronous handlers (optional)

**Returns:**

- `useStore<T>(selector)`: Hook to select and subscribe to state
- `useHandlers()`: Hook to access all handlers

### `createStoreProvider(config)`

Creates a context-based store provider.

**Parameters:**

- Same as `createStore`

**Returns:**

- `Provider`: React component to wrap your app
- `useStore<T>(selector)`: Hook to select and subscribe to state
- `useHandlers()`: Hook to access all handlers

## 🎨 Auto-Generated Handlers

The library automatically generates handlers based on your state types:

### For All Types

```tsx
// Set value (supports callbacks)
handlers.count.set(10);
handlers.count.set((prev) => prev + 1);

// Reset to initial value
handlers.count.reset();
```

### For Arrays

```tsx
const store = createStore({
  states: { items: ["a", "b", "c"] },
});

const handlers = store.useHandlers();

// Add items
handlers.items.push("d");
handlers.items.unshift("z");

// Remove items
handlers.items.pop();
handlers.items.shift();

// Transform
handlers.items.filter((item) => item !== "b");
handlers.items.map((item) => item.toUpperCase());
```

### For Objects

```tsx
const store = createStore({
  states: {
    user: {
      name: "John",
      address: { city: "NYC", zip: "10001" },
    },
  },
});

const handlers = store.useHandlers();

// Update single nested property
handlers.user.update("name", "Jane");
handlers.user.update("address.city", "LA");

// Update multiple properties (deep merge)
handlers.user.updateMany({
  name: "Jane",
  address: { city: "LA" },
});
```

## 🔧 Custom Handlers

### Sync Handlers

```tsx
const store = createStore({
  states: {
    count: 0,
  },
  syncHandlers: {
    increment: (states) => {
      states.count++;
    },
    incrementBy: (states, amount: number) => {
      states.count += amount;
    },
  },
});

// Usage
const handlers = store.useHandlers();
handlers.increment(); // count + 1
handlers.incrementBy(5); // count + 5
```

### Async Handlers

```tsx
const store = createStore({
  states: {
    user: null,
    loading: false,
  },
  asyncHandlers: {
    fetchUser: async (states, userId: string) => {
      states.loading = true;
      const response = await fetch(`/api/users/${userId}`);
      states.user = await response.json();
      states.loading = false;
    },
  },
});

// Usage
const handlers = store.useHandlers();
await handlers.fetchUser("123");
```

## 💡 Advanced Usage

### Selective Subscriptions

The `useStore` selector ensures components only re-render when selected state changes:

```tsx
// Component only re-renders when 'count' changes
function CountDisplay() {
  const { count } = store.useStore((state) => ({ count: state.count }));
  return <div>{count}</div>;
}

// Component only re-renders when 'user.name' changes
function UserName() {
  const { name } = store.useStore((state) => ({
    name: state.user.name,
  }));
  return <div>{name}</div>;
}
```

### Multiple Stores

You can create multiple independent stores:

```tsx
const authStore = createStore({
  states: { user: null, isAuthenticated: false },
});

const cartStore = createStore({
  states: { items: [], total: 0 },
});

function App() {
  const { user } = authStore.useStore((state) => ({ user: state.user }));
  const { items } = cartStore.useStore((state) => ({ items: state.items }));

  // ...
}
```

### TypeScript Type Inference

The library provides full type safety with intelligent inference:

```tsx
const store = createStore({
  states: {
    count: 0,
    user: { name: "John", age: 25 },
  },
  syncHandlers: {
    setUserAge: (states, age: number) => {
      states.user.age = age;
    },
  },
});

const handlers = store.useHandlers();

// ✅ TypeScript knows the types
handlers.count.set(10); // ✓
handlers.user.update("name", "Jane"); // ✓
handlers.setUserAge(30); // ✓

// ❌ TypeScript catches errors
handlers.count.set("invalid"); // Error: Argument of type 'string' is not assignable
handlers.setUserAge("invalid"); // Error: Argument of type 'string' is not assignable
```

## 🏗️ Architecture

The library uses React's `useSyncExternalStore` API for optimal performance and compatibility:

- **Snapshot Caching**: Prevents unnecessary re-renders with shallow equality checks
- **WeakMap Storage**: Efficient snapshot management with automatic garbage collection
- **Immutable Updates**: State changes create new references for proper React updates
- **Subscription Management**: Automatic cleanup when components unmount

## 🎯 Use Cases

Perfect for:

- ✅ Small to medium-sized applications
- ✅ Quick prototyping and MVPs
- ✅ React Native mobile apps
- ✅ Next.js applications (SSR compatible)
- ✅ Projects needing simple global state
- ✅ Teams wanting minimal state management setup

## 📝 Examples

### Todo App

```tsx
const todoStore = createStore({
  states: {
    todos: [] as Array<{ id: string; text: string; completed: boolean }>,
  },
  syncHandlers: {
    addTodo: (states, text: string) => {
      states.todos.push({
        id: Date.now().toString(),
        text,
        completed: false,
      });
    },
    toggleTodo: (states, id: string) => {
      const todo = states.todos.find((t) => t.id === id);
      if (todo) todo.completed = !todo.completed;
    },
    removeTodo: (states, id: string) => {
      states.todos = states.todos.filter((t) => t.id !== id);
    },
  },
});

function TodoList() {
  const { todos } = todoStore.useStore((state) => ({ todos: state.todos }));
  const handlers = todoStore.useHandlers();

  return (
    <div>
      {todos.map((todo) => (
        <div key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => handlers.toggleTodo(todo.id)}
          />
          <span
            style={{ textDecoration: todo.completed ? "line-through" : "none" }}
          >
            {todo.text}
          </span>
          <button onClick={() => handlers.removeTodo(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### Form Management

```tsx
const formStore = createStore({
  states: {
    formData: {
      username: "",
      email: "",
      bio: "",
    },
    errors: {} as Record<string, string>,
  },
  syncHandlers: {
    updateField: (
      states,
      { field, value }: { field: string; value: string }
    ) => {
      states.formData = { ...states.formData, [field]: value };
    },
    validate: (states) => {
      const errors: Record<string, string> = {};
      if (!states.formData.username) errors.username = "Required";
      if (!states.formData.email.includes("@")) errors.email = "Invalid email";
      states.errors = errors;
    },
  },
});
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © [Your Name]

## 🔗 Links

- [GitHub Repository](https://github.com/yourusername/ex-store)
- [Issues](https://github.com/yourusername/ex-store/issues)
- [NPM Package](https://www.npmjs.com/package/@ex/store)

---

Made with ❤️ by developers, for developers
