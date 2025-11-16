### React ChatRoom Component with Custom Hook Integration

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/reusing-logic-with-custom-hooks.md

This React functional component displays a chat room interface. It manages the server URL state using `useState` and integrates the `useChatRoom` custom hook to handle the connection logic for a specific `roomId` and `serverUrl`, ensuring the connection updates with state changes.

```javascript
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

--------------------------------

### React ChatRoom Component with Dynamic URL and Hook

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/reusing-logic-with-custom-hooks.md

This React component renders the chat room UI, allowing the user to modify the server URL. It uses the `useState` hook to manage the `serverUrl` and the `useChatRoom` custom hook to connect to the chat service based on the `roomId` and the dynamic `serverUrl`.

```javascript
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

--------------------------------

### React: Using the Custom useOnlineStatus Hook in Components

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react/useSyncExternalStore.md

This example showcases how different React components, `StatusBar` and `SaveButton`, consume the `useOnlineStatus` custom hook to adapt their behavior based on network connectivity. It highlights the reusability and clean integration of custom hooks for external store subscriptions.

```javascript
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```javascript
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

--------------------------------

### React Client Component Consuming a Server-Initiated Promise

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/rsc/server-components.md

This Client Component demonstrates how to consume a promise that was initiated on the server using the `use` hook. By awaiting the `commentsPromise` on the client, it suspends its own rendering until the data is available, without blocking the initial render of higher-priority content from the server.

```js
// Client Component
"use client";
import {use} from 'react';

function Comments({commentsPromise}) {
  // NOTE: this will resume the promise from the server.
  // It will suspend until the data is available.
  const comments = use(commentsPromise);
  return comments.map(comment => <p>{comment}</p>);
}
```

--------------------------------

### Implementing useSyncExternalStore in a React Component

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react/useSyncExternalStore.md

This example demonstrates how to integrate `useSyncExternalStore` into a React functional component. It imports the hook and an external `todosStore`, then uses the hook to subscribe to the store and retrieve the current `todos` snapshot, enabling the component to react to external state changes.

```jsx
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

--------------------------------

### Define a React Component Agnostic to Client/Server Rendering

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/rsc/use-client.md

This component demonstrates a simple React component that does not use any client-specific APIs, hooks, or server-only features. Such components can be rendered efficiently on both the client and server without needing a `'use client'` directive, making them highly flexible.

```js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

--------------------------------

### Composing React Server and Client Components for Interactivity

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/rsc/server-components.md

This JavaScript code showcases how to add interactivity to Server Components by importing and using Client Components. The `Notes` Server Component fetches data and renders an `Expandable` Client Component, which uses `useState` for interactive toggling, indicated by the 'use client' directive.

```js
// Server Component
import Expandable from './Expandable';

async function Notes() {
  const notes = await db.notes.getAll();
  return (
    <div>
      {notes.map(note => (
        <Expandable key={note.id}>
          <p note={note} />
        </Expandable>
      ))}
    </div>
  )
}
```

```js
// Client Component
"use client"

export default function Expandable({children}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
      >
        Toggle
      </button>
      {expanded && children}
    </div>
  )
}
```

--------------------------------

### React Application Demonstrating Custom useOnlineStatus Hook

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/reusing-logic-with-custom-hooks.md

This example shows a complete React application integrating the `useOnlineStatus` custom Hook. It includes an `App` component that renders `SaveButton` and `StatusBar`, both consuming the custom Hook to display and react to online status changes.

```javascript
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```javascript
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

--------------------------------

### Connect React component to external chat server using useEffect

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react/useEffect.md

This React example demonstrates using the `useEffect` hook to connect a `ChatRoom` component to an external chat server. It shows how to establish a connection, clean it up on unmount, and re-establish it when `roomId` or `serverUrl` dependencies change, utilizing a mock `chat.js` module for server interaction.

```javascript
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```javascript
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

--------------------------------

### Integrate useList Custom Hook into a React Component

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react/cloneElement.md

This JavaScript code demonstrates how to use the `useList` custom Hook within a React functional component. It destructures the `selected` item and `onNext` function from the hook to render a list of products, highlight the currently selected one, and provide a button to advance the selection.

```js
export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

--------------------------------

### Calling React Hooks from React Functions vs. Regular Functions (JavaScript)

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/rules/rules-of-hooks.md

This snippet clarifies that React Hooks must be called exclusively from React function components or other custom Hooks. It demonstrates the distinction between correctly calling a Hook within a component and the incorrect attempt to call a Hook from a regular JavaScript function, which is not supported.

```javascript
function FriendList() {
  const [onlineStatus, setOnlineStatus] = useOnlineStatus(); // ✅
}

function setOnlineStatus() { // ❌ Not a component or custom Hook!
  const [onlineStatus, setOnlineStatus] = useOnlineStatus();
}
```

--------------------------------

### Migrate from React PropTypes to TypeScript in function components

Source: https://github.com/reactjs/react.dev/blob/main/src/content/blog/2024/04/25/react-19-upgrade-guide.md

This example illustrates the transition from using `PropTypes` and `defaultProps` in a functional React component to adopting TypeScript interfaces and ES6 default parameters. React 19 no longer supports `PropTypes` checks for function components, advocating for static typing solutions like TypeScript.

```javascript
// Before
import PropTypes from 'prop-types';

function Heading({text}) {
  return <h1>{text}</h1>;
}
Heading.propTypes = {
  text: PropTypes.string,
};
Heading.defaultProps = {
  text: 'Hello, world!',
};
```

```typescript
// After
interface Props {
  text?: string;
}
function Heading({text = 'Hello, world!'}: Props) {
  return <h1>{text}</h1>;
}
```

--------------------------------

### Correct vs. Incorrect Dynamic Usage of React Hooks

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/rules/react-calls-components-and-hooks.md

Passing Hooks as regular values or props, like `useData={useDataWithLogging}`, is discouraged as it increases complexity and can lead to violations of the Rules of Hooks. Hooks should always be called directly within the component or another Hook to maintain clarity and enforce local reasoning.

```javascript
function ChatInput() {
  return <Button useData={useDataWithLogging} /> // 🔴 Bad: don't pass Hooks as props
}
```

```javascript
function ChatInput() {
  return <Button />
}

function Button() {
  const data = useDataWithLogging(); // ✅ Good: Use the Hook directly
}

function useDataWithLogging() {
  // If there's any conditional logic to change the Hook's behavior, it should be inlined into
  // the Hook
}
```

--------------------------------

### Defining Valid React Components and Hooks at Module Level in JavaScript

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/eslint-plugin-react-hooks/lints/component-hook-factories.md

This code illustrates the correct way to define React components and custom hooks at the module level. Adhering to this pattern ensures consistent component identity, preserves state, and prevents unnecessary re-renders, aligning with React's performance best practices.

```js
// ✅ Component defined at module level
function Component({ defaultValue }) {
  // ...
}

// ✅ Custom hook at module level
function useData(endpoint) {
  // ...
}
```

--------------------------------

### Avoiding Dynamic Mutation of React Hooks

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/rules/react-calls-components-and-hooks.md

Hooks should be static and immutable; dynamically mutating them, such as by creating higher-order Hooks, is an anti-pattern that can complicate component logic and hinder local reasoning. Instead, create a new, static version of the Hook that encapsulates the desired functionality.

```javascript
function ChatInput() {
  const useDataWithLogging = withLogging(useData); // 🔴 Bad: don't write higher order Hooks
  const data = useDataWithLogging();
}
```

```javascript
function ChatInput() {
  const data = useDataWithLogging(); // ✅ Good: Create a new version of the Hook
}

function useDataWithLogging() {
  // ... Create a new version of the Hook and inline the logic here
}
```

--------------------------------

### Identifying Invalid React Component and Hook Factories in JavaScript

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/eslint-plugin-react-hooks/lints/component-hook-factories.md

This code demonstrates examples of incorrect patterns where React components or custom hooks are defined within other functions. Such patterns lead to performance issues and state loss as React treats each instance as a new component, violating the rule that components and hooks should be defined at the module level.

```js
// ❌ Factory function creating components
function createComponent(defaultValue) {
  return function Component() {
    // ...
  };
}

// ❌ Component defined inside component
function Parent() {
  function Child() {
    // ...
  }

  return <Child />;
}

// ❌ Hook factory function
function createCustomHook(endpoint) {
  return function useData() {
    // ...
  };
}
```

--------------------------------

### Define Custom MDX Components for React.dev (TypeScript)

Source: https://context7.com/reactjs/react.dev/llms.txt

This TypeScript example demonstrates the integration of custom React components, such as `<Intro>`, `<YouWillLearn>`, `<Sandpack>`, `<Pitfall>`, `<DeepDive>`, and `<Note>`, directly within MDX files. It showcases how these components can be used to enrich documentation content, including rendering an interactive code block within a `<Sandpack>` component, enabling rich and dynamic user experiences.

```typescript
// src/components/MDX/MDXComponents.tsx
import { MDXComponents } from 'components/MDX/MDXComponents';

// Example MDX file: src/content/learn/state-management.md
`
# State Management

<Intro>
Learn how to manage state in React applications.
</Intro>

<YouWillLearn>
- How to use useState
- When to lift state up
- How to share state between components
</YouWillLearn>

<Sandpack>

```js App.js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

</Sandpack>

<Pitfall>
Don't mutate state directly. Always use setState.
</Pitfall>

<DeepDive title="How does React track changes?" excerpt="Learn about React's reconciliation">

React uses a virtual DOM to efficiently update the UI...

</DeepDive>

<Note>
This is an important note for developers.
</Note>

<Challenges>

```

--------------------------------

### Data Fetching with React Server Components

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/rsc/server-components.md

This JavaScript example illustrates data fetching directly within React Server Components. `Note` and `Author` components are `async` functions that `await` data from a database during their render cycle, eliminating the need for client-side `useEffect` and reducing waterfalls.

```js
import db from './database';

async function Note({id}) {
  // NOTE: loads *during* render.
  const note = await db.notes.get(id);
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

async function Author({id}) {
  // NOTE: loads *after* Note,
  // but is fast if data is co-located.
  const author = await db.authors.get(id);
  return <span>By: {author.name}</span>;
}
```

--------------------------------

### Render Document Metadata in React Components (React 19)

Source: https://github.com/reactjs/react.dev/blob/main/src/content/blog/2024/12/05/react-19.md

Demonstrates how React 19 natively supports rendering `<title>`, `<meta>`, and `<link>` tags directly within components. React automatically hoists these tags to the document's `<head>`, simplifying metadata management for client-only, streaming SSR, and Server Components. While this reduces the need for manual insertion or third-party libraries for basic use cases, external libraries may still offer advanced features like route-based overrides.

```javascript
function BlogPost({post}) {
  return (
    <article>
      <h1>{post.title}</h1>
      <title>{post.title}</title>
      <meta name="author" content="Josh" />
      <link rel="author" href="https://twitter.com/joshcstory/" />
      <meta name="keywords" content={post.keywords} />
      <p>
        Eee equals em-see-squared...
      </p>
    </article>
  );
}
```

--------------------------------

### React useEffect Hook for Dynamic Chat Connection

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/escape-hatches.md

This React component demonstrates how to use the `useEffect` hook to manage an external resource, in this case, a chat room connection. It connects to a server when the `roomId` prop changes and disconnects on cleanup, showcasing reactive re-synchronization based on dependencies.

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

--------------------------------

### Correct and Incorrect Component Usage in React JSX

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/rules/react-calls-components-and-hooks.md

Components must always be used within JSX, allowing React to manage their rendering lifecycle. Directly calling a component function outside of JSX, like `Article()`, is an anti-pattern as it bypasses React's reconciliation process and can lead to violations of Hook rules.

```javascript
function BlogPost() {
  return <Layout><Article /></Layout>; // ✅ Good: Only use components in JSX
}
```

```javascript
function BlogPost() {
  return <Layout>{Article()}</Layout>; // 🔴 Bad: Never call them directly
}
```

--------------------------------

### Render Static Content with React Server Component at Build Time

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/rsc/server-components.md

This example demonstrates how an `async` React Server Component can directly read static content during the build process. It eliminates the need for client-side libraries (`marked`, `sanitize-html`) in the final bundle and avoids a separate network request, resulting in improved performance and smaller client bundles.

```javascript
import marked from 'marked'; // Not included in bundle
import sanitizeHtml from 'sanitize-html'; // Not included in bundle

async function Page({page}) {
  // NOTE: loads *during* render, when the app is built.
  const content = await file.readFile(`${page}.md`);

  return <div>{sanitizeHtml(marked(content))}</div>;
}
```

--------------------------------

### React `ChatRoom` Component Using Custom Hook with `onReceiveMessage`

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/reusing-logic-with-custom-hooks.md

This React component demonstrates how a `ChatRoom` might use the `useChatRoom` custom Hook if it accepted an `onReceiveMessage` prop. It allows the component to define the specific action to take when a message is received, such as displaying a notification, making the custom hook more versatile.

```js
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });
  // ...
```

--------------------------------

### Install React TypeScript Type Definitions

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/typescript.md

This command installs the necessary TypeScript type definitions for React and ReactDOM as development dependencies. These types enable type-checking, autocompletion, and enhanced tooling support for React components and APIs within a TypeScript project.

```bash
npm install --save-dev @types/react @types/react-dom
```

--------------------------------

### React useEffect Hook for Chat Room Connection

Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/lifecycle-of-reactive-effects.md

This `useEffect` hook handles the synchronization of the `ChatRoom` component with a chat server. It establishes a connection to the specified `roomId` and provides a cleanup function to disconnect when the component unmounts or the `roomId` dependency changes, ensuring proper resource management.

```js
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Connects to the "general" room
    connection.connect();
    return () => {
      connection.disconnect(); // Disconnects from the "general" room
    };
  }, [roomId]);
  // ...
```

--------------------------------

### Import and call Server Function from React Client Component

Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/rsc/server-functions.md

This example demonstrates how to define a reusable Server Function in a dedicated file marked with 'use server', then import and invoke it directly from a React Client Component. This approach facilitates modular server-side logic that can be accessed and executed by multiple client components, promoting code reusability. The client component initiates a server request to run the imported function.

```javascript
"use server";

export async function createNote() {
  await db.notes.create();
}
```

```javascript
"use client";
import {createNote} from './actions';

function EmptyNote() {
  console.log(createNote);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNote'}
  <button onClick={() => createNote()} />
}
